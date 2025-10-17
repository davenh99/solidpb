package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		permissions, err := app.FindCollectionByNameOrId("permission")
		if err != nil {
			return err
		}

		record := core.NewRecord(permissions)
		record.Set("name", "all")
		record.Set("collections", "['*']")
		record.Set("canView", true)
		record.Set("canList", true)
		record.Set("canCreate", true)
		record.Set("canUpdate", true)
		record.Set("canDelete", true)

		return app.Save(record)
	}, func(app core.App) error {
		record, _ := app.FindRecordById("permission", "all")
		if record == nil {
			return nil // probably already deleted
		}

		return app.Delete(record)
	})
}
