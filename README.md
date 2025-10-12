# solidpb

A framework for creating progressive web applications using solidjs and pocketbase

After cloning, you can paste in your app name into the following files:

- .goreleaser.yaml
- .env
- ui/package.json
- ui/public/manifest.json

TODO:

- custom pb hook for tracking changes to selected record fields. (changelog model)
- role-based routing guard?
- add app 'update' command like pocketbase
- add nullable to generated types

TODO components:

- dateinput
- textarea
- text
- heading
- link
- select (dropdown)
- tagarea
- tooltip
- dropdown menu
- skeleton (for loading, add relevant css animation)
- fileinput
- searchinput
- toast/notification
- themeswitch (for light, dark mode)
- relationpicker (for FKs)
- image

Components half done (need variants, dark mode styling)

- Checkbox
- Input
- NumberInput
- Switch

TODO views:

- app (layout with navigation)
- header
- footer
- card
- container
- modal
- list (will have a bunch of components in the one file maybe, including a list searchbox, filters maybe)
- form
- tabs
- dashboard
- settings
