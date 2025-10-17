package main

import (
	"app/plugins/changelog"
	"app/plugins/gentypes"
	"app/plugins/roles"
	"app/utils"
	"embed"
	"io/fs"
	"log"
	"net/http"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/ghupdate"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"github.com/pocketbase/pocketbase/tools/hook"

	_ "app/migrations"
)

var Version = "dev"

//go:embed ui/dist/*
var embeddedFiles embed.FS

func main() {
	env := utils.Env
	app := pocketbase.New()

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: env.Env == "development",
	})

	changelog.Register(app, changelog.Config{
		Collections: map[string][]string{
			"users": {"name"},
		},
	})

	roles.Register(app, roles.Config{
		App: app,
		SkipCollectionRules: map[string]*roles.SkipRules{
			"user":          nil,
			"changelog":     nil,
			"changelogDiff": nil,
			"role":          nil,
			"permission":    nil,
		},
	})

	switch env.Env {
	case "development":
		gentypes.Register(app)
	case "production":
		ghupdate.MustRegister(app, app.RootCmd, ghupdate.Config{
			Owner:             env.GithubOwner,
			Repo:              env.GithubRepo,
			ArchiveExecutable: env.ArchiveExecutable,
			HttpClient: &utils.AuthClient{
				Token: env.GithubToken,
				Base:  http.DefaultClient,
			},
		})
	}

	// frontend
	app.OnServe().Bind(&hook.Handler[*core.ServeEvent]{
		Func: func(e *core.ServeEvent) error {
			distFS, err := fs.Sub(embeddedFiles, "ui/dist")
			if err != nil {
				return err
			}

			e.Router.GET("/{path...}", apis.Static(distFS, true))

			return e.Next()
		},
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
