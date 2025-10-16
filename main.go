package main

import (
	"app/plugins/changelog"
	"app/plugins/gentypes"
	"app/utils"
	"embed"
	"io/fs"
	"log"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"github.com/pocketbase/pocketbase/tools/hook"

	_ "app/migrations"
)

var Version = "dev"

//go:embed ui/dist/*
var embeddedFiles embed.FS

func main() {
	env := utils.Env.Env
	app := pocketbase.New()

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: env == "development",
	})

	changelog.Register(app, changelog.Config{
		Collections: map[string][]string{
			"users": {"name"},
		},
	})

	if env == "development" {
		gentypes.Register(app)
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
