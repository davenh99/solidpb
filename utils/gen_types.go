package utils

import (
	"bytes"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func GenerateTypes(app *pocketbase.PocketBase) error {
	collections, err := app.FindAllCollections()
	if err != nil {
		return err
	}

	root, err := projectRoot()
	if err != nil {
		panic(err)
	}

	outPath := filepath.Join(strings.Trim(root, "\t\n\r "), "ui", "src", "types", "base.d.ts")

	f, err := os.Create(outPath)
	if err != nil {
		return err
	}
	defer f.Close()

	f.WriteString("/* This file was automatically generated, changes will be overwritten. */\n\n")

	for _, collection := range collections {
		if collection.System {
			continue
		}

		printBaseType(f, collection)
		printRecordType(f, collection)
	}

	return nil
}

func printBaseType(f *os.File, collection *core.Collection) {
	fmt.Fprintf(f, "export interface %s {\n", capitalise(collection.Name))

	for _, field := range collection.Fields {
		if field.Type() == "autodate" || field.GetName() == "id" || field.GetHidden() {
			continue
		}
		fmt.Fprintf(f, "  %s%s;\n", field.GetName(), toTypeScriptType(field))
	}

	fmt.Fprint(f, "}\n\n")
}

func printRecordType(f *os.File, collection *core.Collection) {
	fmt.Fprintf(f, "/* Collection type: %s */\n", collection.Type)
	fmt.Fprintf(f, "export interface %sRecord {\n", capitalise(collection.Name))

	for _, field := range collection.Fields {
		if field.GetHidden() {
			continue
		}
		fmt.Fprintf(f, "  %s%s; // %s\n", field.GetName(), toTypeScriptType(field), field.Type())
	}

	fmt.Fprint(f, "}\n\n")
}

func capitalise(s string) string {
	if s == "" {
		return ""
	}

	firstLetter := s[0]
	rest := s[1:]

	return strings.ToUpper(string(firstLetter)) + rest
}

func projectRoot() (string, error) {
	cmd := exec.Command("git", "rev-parse", "--show-toplevel")
	cmd.Stderr = os.Stderr

	var out bytes.Buffer
	cmd.Stdout = &out

	if err := cmd.Run(); err != nil {
		return "", fmt.Errorf("failed to find git root: %w", err)
	}

	root := filepath.Clean(out.String())
	return root, nil
}

func toTypeScriptType(f core.Field) string {
	switch f.Type() {
	case "password":
		if sf, ok := f.(*core.PasswordField); ok {
			if sf.Required {
				return ": string"
			}
		}
		return "?: string"
	case "text":
		if sf, ok := f.(*core.TextField); ok {
			if sf.Required {
				return ": string"
			}
		}
		return "?: string"
	case "email":
		if sf, ok := f.(*core.EmailField); ok {
			if sf.Required {
				return ": string"
			}
		}
		return "?: string"
	case "relation":
		if sf, ok := f.(*core.RelationField); ok {
			res := ""
			if !sf.Required {
				res += "?"
			}
			res += ": string"
			if sf.MaxSelect > 1 {
				res += "[]"
			}
			return res
		}
		return "?: string"
	case "autodate":
		return ": string"
	case "date":
		if sf, ok := f.(*core.DateField); ok {
			if sf.Required {
				return ": string"
			}
		}
		return "?: string"
	case "url":
		if sf, ok := f.(*core.FileField); ok {
			if sf.Required {
				return ": string"
			}
		}
		return "?: string"
	case "file":
		if sf, ok := f.(*core.FileField); ok {
			if sf.Required {
				return ": string"
			}
		}
		return "?: string"
	case "select":
		if sf, ok := f.(*core.SelectField); ok {
			res := ""
			values := sf.Values

			if len(values) > 0 {
				var quoted []string
				for _, v := range values {
					quoted = append(quoted, fmt.Sprintf("\"%s\"", v))
				}
				res = strings.Join(quoted, " | ")
			}

			if sf.MaxSelect > 1 {
				res = fmt.Sprintf("(%s)[]", res)
			}
			if sf.Required {
				return fmt.Sprintf(": %s", res)
			} else {
				return fmt.Sprintf("?: %s", res)
			}
		}
		return "?: string"
	case "number":
		if sf, ok := f.(*core.NumberField); ok {
			if sf.Required {
				return ": number"
			}
		}
		return "?: number"
	case "bool":
		if sf, ok := f.(*core.BoolField); ok {
			if sf.Required {
				return ": boolean"
			}
		}
		return "?: boolean"
	case "json":
		if sf, ok := f.(*core.JSONField); ok {
			if sf.Required {
				return ": any"
			}
		}
		return "?: any"
	default:
		return "?: unknown"
	}
}
