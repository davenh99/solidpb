# Load env vars
ifneq (,$(wildcard .env))
    include .env
    export $(shell sed 's/=.*//' .env)
endif

build:
	@echo "Building $(VITE_APP_NAME)..."
	@CGO_ENABLED=0 go build -o ./dist/$(VITE_APP_NAME) ./main.go
	@echo "Done"

test:
	@go test -v -coverprofile=coverage.out ./...

serve: build
	@cd dist; ./$(VITE_APP_NAME) serve

build-ui:
	@cd ui && npm run build

ui-dev:
	@cd ui && npm run dev

prod: build-ui build

serve-prod: prod
	@cd dist; ./$(VITE_APP_NAME) serve

serve-dev:
	@trap "pkill -P $$" EXIT; \
	(make serve &) && \
	(make ui-dev)

dev: serve-dev
