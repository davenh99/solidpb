package main

import (
	"app/utils"
	"embed"
	"fmt"
	"io/fs"
	"log"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/jsvm"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"github.com/pocketbase/pocketbase/tools/hook"
	"github.com/spf13/cobra"
)

var Version = "dev"

//go:embed ui/dist/*
var embeddedFiles embed.FS

func main() {
	app := pocketbase.New()
	env := utils.Env.Env

	migrationsFilePattern := `^\d.*\.(js|ts)`
	if env == "development" {
		migrationsFilePattern = `^.*\.(js|ts)$`
	}

	jsvm.MustRegister(app, jsvm.Config{
		MigrationsDir:          "./pb_migrations",
		MigrationsFilesPattern: migrationsFilePattern,
	})

	// migrate command (with js templates)
	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		TemplateLang: migratecmd.TemplateLangJS,
		Automigrate:  env == "development",
	})

	app.RootCmd.AddCommand(&cobra.Command{
		Use: "gen-types",
		Run: func(cmd *cobra.Command, args []string) {
			err := utils.GenerateTypes(app)
			if err != nil {
				fmt.Printf("error: %v\n", err)
			}
		},
	})

	app.OnCollectionAfterUpdateSuccess().BindFunc(func(e *core.CollectionEvent) error {
		err := utils.GenerateTypes(app)
		if err != nil {
			return err
		}

		return e.Next()
	})

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
