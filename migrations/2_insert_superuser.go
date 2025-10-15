package migrations

import (
	"app/utils"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		superusers, err := app.FindCollectionByNameOrId(core.CollectionNameSuperusers)
		if err != nil {
			return err
		}

		record := core.NewRecord(superusers)

		record.Set("email", utils.Env.SuperuserName)
		record.Set("password", utils.Env.SuperuserPassword)

		return app.Save(record)
	}, func(app core.App) error {
		record, _ := app.FindAuthRecordByEmail(core.CollectionNameSuperusers, utils.Env.SuperuserName)
		if record == nil {
			return nil // probably already deleted
		}

		return app.Delete(record)
	})
}
