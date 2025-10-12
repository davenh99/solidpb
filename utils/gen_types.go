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

	f.WriteString("/*This file was automatically generated, changes will be overwritten.*/\n\n")

	for _, collection := range collections {
		if collection.Name[0] == '_' {
			// loosely skip system collections
			continue
		}
		fmt.Fprintf(f, "/* Collection type: %s */\n", collection.Type)
		fmt.Fprintf(f, "export interface %s {\n", capitalise(collection.Name))
		for _, field := range collection.Fields {
			if !field.GetHidden() {
				fmt.Fprintf(f, "  %s: %s; // %s\n", field.GetName(), toTypeScriptType(field), field.Type())
			}
		}
		fmt.Fprint(f, "}\n\n")
	}

	return nil
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
	case "password", "text", "email", "relation", "autodate", "date", "url", "file":
		return "string"
	case "select":
		if sf, ok := f.(*core.SelectField); ok {
			values := sf.Values
			if len(values) > 0 {
				var quoted []string
				for _, v := range values {
					quoted = append(quoted, fmt.Sprintf("\"%s\"", v))
				}
				return strings.Join(quoted, " | ")
			}
		}
		return "string"
	case "number":
		return "number"
	case "bool":
		return "boolean"
	case "json":
		return "any"
	default:
		return "unknown"
	}
}
