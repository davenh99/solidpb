package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		roles, err := app.FindCollectionByNameOrId("role")
		if err != nil {
			return err
		}

		permission, err := app.FindFirstRecordByFilter("permission", "name = 'all'")
		if err != nil {
			return err
		}

		record := core.NewRecord(roles)
		record.Set("name", "admin")
		record.Set("permissions+", permission.Id)

		return app.Save(record)
	}, func(app core.App) error {
		record, _ := app.FindRecordById("role", "admin")
		if record == nil {
			return nil // probably already deleted
		}

		return app.Delete(record)
	})
}
