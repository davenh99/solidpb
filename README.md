# solidpb

A framework for creating progressive webapplications using solidjs and pocketbase

After cloning, you can paste in your app name into the following files:

- .goreleaser.yaml
- .env
- ui/package.json
- ui/public/manifest.json

TODO:

- custom pb hook for tracking changes to selected record fields. (changelog model)
- generate types automatically from custom hook on schema change
- public folder with default icons, fonts, manifest.json for pwa.
- role-based routing guard?
- errorboundary? (or does the toaster handle it?)
- add app 'update' command like pocketbase
- setup storybook for ui development??
- create one dark and one light theme
