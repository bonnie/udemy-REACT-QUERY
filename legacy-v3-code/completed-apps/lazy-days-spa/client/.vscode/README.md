# How to get ESLint and Prettier working with VSCode

Make sure the [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extensions are installed, and not generating any errors in the [output window](https://docs.microsoft.com/en-us/visualstudio/ide/reference/output-window?view=vs-2022).

## Why two versions of `settings.json`?

The [ESLint extension for VSCode](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) made some updates in [version 2.0.4](https://github.com/microsoft/vscode-eslint#version-204), and most of the ESLint options in _eslint-2.03-settings.json_ are no longer necessary. Some of them, such as `configFile`, [will even cause errors](https://github.com/microsoft/vscode-eslint/issues/1357#issuecomment-966807993) if you're using ESLint plugin version 2.0.4+ and ESLint version 8+.

### How to find your ESLint extension version

1. Select the Code -> Preferences -> Extensions menu item.
1. Search for `eslint`
1. Click the extension called ESLint in the results
1. Look for the version next to the ESLint title in the details page

### If you are using ESLint extension 2.0.4 or above

Nothing to do; you can use the _settings.json_ in this directory.

### If you are using ESLint extension 2.0.3 or below

#### Option 1

Update the extension to version 2.0.4 or above.

#### Option 2

Rename _eslint-2.0.3-settings.json_ in this directory to _settings.json_ (overwriting the _settings.json_ that's already here).
