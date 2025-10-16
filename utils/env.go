package utils

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Env               string
	SuperuserName     string
	SuperuserPassword string
	GithubOwner       string
	GithubRepo        string
	ArchiveExecutable string
	GithubToken       string
}

var Env Config = initConfig()

func initConfig() Config {
	godotenv.Load()

	return Config{
		Env:               getEnv("ENV", "production"),
		SuperuserName:     getEnv("SUPERUSER_NAME", "admin@test.com"),
		SuperuserPassword: getEnv("SUPERUSER_PASSWORD", "1234567890"),
		GithubOwner:       getEnv("GH_OWNER", ""),
		GithubRepo:        getEnv("GH_REPO", ""),
		ArchiveExecutable: getEnv("ARCHIVE_EXECUTABLE", ""),
		GithubToken:       getEnv("GH_TOKEN", ""),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}

	return fallback
}
