package roles

import (
	"fmt"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

// Only Rules marked 'true' will be skipped,
// all others will be overwritten with default rules if nil.
type SkipRules struct {
	SkipCanView   bool
	SkipCanList   bool
	SkipCanCreate bool
	SkipCanUpdate bool
	SkipCanDelete bool
}

// Note, if SkipRules is nil, the whole collection is skipped.
// If SkipRules is not nil, only Rules marked 'true' will be skipped,
// all others will be overwritten with default rules if nil.
type Config struct {
	App                 core.App
	SkipCollectionRules map[string]*SkipRules
}

func Register(app *pocketbase.PocketBase, cfg Config) {
	app.OnCollectionAfterCreateSuccess().BindFunc(cfg.writeDefaultRules)
}

func (c *Config) writeDefaultRules(e *core.CollectionEvent) error {
	if e.Collection.System {
		return e.Next()
	}

	skipRules, skip := c.SkipCollectionRules[e.Collection.Name]

	if skip {
		if skipRules != nil {
			if !skipRules.SkipCanView {
				c.writeIfNil(&e.Collection.ViewRule, e.Collection.Name, "canView")
			}
			if !skipRules.SkipCanList {
				c.writeIfNil(&e.Collection.ListRule, e.Collection.Name, "canList")
			}
			if !skipRules.SkipCanCreate {
				c.writeIfNil(&e.Collection.CreateRule, e.Collection.Name, "canCreate")
			}
			if !skipRules.SkipCanUpdate {
				c.writeIfNil(&e.Collection.UpdateRule, e.Collection.Name, "canUpdate")
			}
			if !skipRules.SkipCanDelete {
				c.writeIfNil(&e.Collection.DeleteRule, e.Collection.Name, "canDelete")
			}
		}
	} else {
		c.writeIfNil(&e.Collection.ViewRule, e.Collection.Name, "canView")
		c.writeIfNil(&e.Collection.ListRule, e.Collection.Name, "canList")
		c.writeIfNil(&e.Collection.CreateRule, e.Collection.Name, "canCreate")
		c.writeIfNil(&e.Collection.UpdateRule, e.Collection.Name, "canUpdate")
		c.writeIfNil(&e.Collection.DeleteRule, e.Collection.Name, "canDelete")
	}

	err := c.App.Save(e.Collection)
	if err != nil {
		return err
	}

	return e.Next()
}

// check if the rules weren't already set first before writing to them.
func (c *Config) writeIfNil(rule **string, collectionName string, permissionField string) {
	baseRule := `@request.auth.id != '' && (
				   @request.auth.role.name = 'admin' || (
				     @request.auth.role.permissions.collections ?= '*' ||
				     @request.auth.role.permissions.collections ?= '%s'
				   ) &&
				   @request.auth.role.permissions.collections.%s = true
				 )`

	if *rule == nil {
		*rule = types.Pointer(fmt.Sprintf(baseRule, collectionName, permissionField))
	}
}
