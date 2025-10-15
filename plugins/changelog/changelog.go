package changelog

import (
	"context"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"

	_ "app/migrations"
	"app/utils"
)

type Config struct {
	Collections map[string][]string
}

func Register(app *pocketbase.PocketBase, cfg Config) {
	app.OnRecordAfterCreateSuccess().BindFunc(cfg.logCreate)

	app.OnRecordUpdate().BindFunc(cfg.attachOldRecord)
	app.OnRecordAfterUpdateSuccess().BindFunc(cfg.logUpdate)

	app.OnRecordDelete().BindFunc(cfg.attachOldRecord)
	app.OnRecordAfterDeleteSuccess().BindFunc(cfg.logDelete)
}

type Diff struct {
	changelogId string
	field       string
	valueNew    any
	valueOld    any
}

func (c *Config) attachOldRecord(e *core.RecordEvent) error {
	if _, ok := c.Collections[e.Record.TableName()]; !ok {
		return e.Next() // skip untracked collections
	}

	if oldRec, err := e.App.FindRecordById(e.Record.TableName(), e.Record.Id); err == nil {
		e.Context = context.WithValue(e.Context, "oldRecord", oldRec)
	}
	return e.Next()
}

func (c *Config) logCreate(e *core.RecordEvent) error {
	trackedFields, ok := c.Collections[e.Record.TableName()]
	if !ok {
		return e.Next() // skip untracked collections
	}

	newRecord := e.Record

	diffs := []Diff{}
	for _, field := range trackedFields {
		diffs = append(diffs, Diff{field: field, valueOld: nil, valueNew: newRecord.Get(field)})
	}

	err := c.createChangelog(e, newRecord.TableName(), newRecord.Id, "create", diffs)
	if err != nil {
		return err
	}

	return e.Next()
}

func (c *Config) logUpdate(e *core.RecordEvent) error {
	trackedFields, ok := c.Collections[e.Record.TableName()]
	if !ok {
		return e.Next() // skip untracked collections
	}

	oldVal, ok := e.Context.Value("oldRecord").(*core.Record)
	if !ok {
		e.App.Logger().Error("changelog skipped - old record not found")
		return e.Next()
	}

	oldRecord := oldVal
	newRecord := e.Record

	diffs := []Diff{}
	for _, field := range trackedFields {
		oldVal := oldRecord.Get(field)
		newVal := newRecord.Get(field)
		if !utils.Equals(oldVal, newVal) {
			diffs = append(diffs, Diff{field: field, valueOld: oldVal, valueNew: newVal})
		}
	}

	if len(diffs) > 0 {
		if err := c.createChangelog(e, oldRecord.TableName(), oldRecord.Id, "update", diffs); err != nil {
			return err
		}
	}

	return e.Next()
}

func (c *Config) logDelete(e *core.RecordEvent) error {
	trackedFields, ok := c.Collections[e.Record.TableName()]
	if !ok {
		return e.Next() // skip untracked collections
	}

	oldRecord, ok := e.Context.Value("oldRecord").(*core.Record)
	if !ok {
		e.App.Logger().Error("changelog skipped - old record not found")
		return e.Next()
	}

	diffs := []Diff{}
	for _, field := range trackedFields {
		diffs = append(diffs, Diff{field: field, valueOld: oldRecord.Get(field), valueNew: nil})
	}

	err := c.createChangelog(e, oldRecord.TableName(), oldRecord.Id, "delete", diffs)
	if err != nil {
		return err
	}

	return e.Next()
}

func (c *Config) createChangelog(e *core.RecordEvent, collectionName string, recordId string, changeType string, diffs []Diff) error {
	collection, err := e.App.FindCollectionByNameOrId("changelog")
	if err != nil {
		return err
	}

	return e.App.RunInTransaction(func(txApp core.App) error {
		authRecordId := "unknown"
		authRecord, ok := e.Context.Value("authRecord").(*core.Record)
		if ok {
			authRecordId = authRecord.Id
		} else {
			e.App.Logger().Warn("Could not find user id for changelog")
		}

		record := core.NewRecord(collection)
		record.Set("collection", collectionName)
		record.Set("recordId", recordId)
		record.Set("changeType", changeType)
		record.Set("reason", "")
		record.Set("changed_by", authRecordId)

		err = txApp.Save(record)
		if err != nil {
			e.App.Logger().Error("changelog save failed", "err", err)
			return err
		}

		for _, diff := range diffs {
			err := c.createChangeLogDiff(txApp, diff, record.Id)
			if err != nil {
				e.App.Logger().Error("changelogDiff save failed", "err", err)
				return err
			}
		}

		return nil
	})
}

func (c *Config) createChangeLogDiff(txApp core.App, diff Diff, changelogId string) error {
	collection, err := txApp.FindCollectionByNameOrId("changelogDiff")
	if err != nil {
		return err
	}

	record := core.NewRecord(collection)
	record.Set("changelogId", diff.changelogId)
	record.Set("field", diff.field)
	record.Set("valueNew", diff.valueNew)
	record.Set("valueOld", diff.valueOld)

	return txApp.Save(record)
}
