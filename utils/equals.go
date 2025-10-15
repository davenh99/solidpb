package utils

import (
	"bytes"
	"encoding/json"
	"reflect"
)

func Equals(a, b any) bool {
	if a == nil && b == nil {
		return true
	}
	if a == nil || b == nil {
		return false
	}

	// Prefer JSON-normalised comparison (handles numeric type differences & map ordering)
	ja, errA := json.Marshal(a)
	jb, errB := json.Marshal(b)
	if errA == nil && errB == nil {
		return bytes.Equal(ja, jb)
	}

	// Fallback
	return reflect.DeepEqual(a, b)
}
