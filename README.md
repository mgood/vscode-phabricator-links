# Phabricator Links for VSCode

Provides links to Phabricator objects found in text documents.

## Features

Detects Phabricator's [link syntax](https://secure.phabricator.com/book/phabricator/article/remarkup/#linking-to-objects)
found in open documents (such as `T123`) and turns it into a link to that object
in your phabricator project.

To enable linking, set `phabricator-links.url` in your User or Workspace
Settings to the location of your Phabricator project. For example this setting
will link to Phabricator's own project:

```
{
  "phabricator-links.url": "https://secure.phabricator.com/"
}
```

The following link formats are recognized:

```
T123 - Manifest Tasks
D123 - Differential Revisions
F123 - Files
M123 - Pholio Mocks
```

You can also link to specific comments by ID: `T123#456`

## Extension Settings

This extension contributes the following settings:

* `phabricator-links.url`: Phabricator project URL

## Known Issues

Does not yet support commit links such as `rX123`.

## Release Notes

### 1.0.0

Initial release of phabricator-links
