## ADDED Requirements
### Requirement: User Config Storage
The CLI SHALL maintain a per-user configuration file that survives across repositories and drives command defaults.

#### Scenario: Resolve config location
- **WHEN** any command needs to read user settings
- **THEN** resolve the config directory to `$OPENSPEC_HOME` when set, otherwise use the operating system's standard config directory (`~/.config/openspec` on macOS/Linux, `%APPDATA%/OpenSpec` on Windows)
- **AND** store settings inside `config.json`
- **AND** expose the resolved absolute path in `openspec config --json` output so users know where the file lives

#### Scenario: Initialize missing config file on write
- **WHEN** `openspec config set` or `openspec config reset` runs and no config file exists yet
- **THEN** create the directory tree automatically
- **AND** write a valid JSON document (at least `{}`) before applying updates
- **AND** perform writes atomically so partially written files do not corrupt the config when a process is interrupted

### Requirement: Config Command Interface
The CLI SHALL expose an `openspec config` command for inspecting and modifying supported settings.

#### Scenario: Listing configuration values
- **WHEN** running `openspec config`
- **THEN** print a table summarizing known keys, effective values, and the config file path
- **AND** support `--json` to emit machine-readable output that includes location, loaded schema version, and all key/value pairs

#### Scenario: Setting configuration values
- **WHEN** running `openspec config set language.preferred zh-CN`
- **THEN** validate and normalize the value
- **AND** persist the update to `config.json`
- **AND** print a success message mentioning the stored value and path

#### Scenario: Unsetting configuration values
- **WHEN** running `openspec config unset language.preferred`
- **THEN** remove the key from the config file (or reset to defaults)
- **AND** keep other keys untouched
- **AND** confirm the action to stdout

#### Scenario: Resetting the configuration
- **WHEN** running `openspec config reset --yes`
- **THEN** delete all keys, recreate the file with `{}`
- **AND** warn users when `--yes` is omitted to prevent accidental wipes

### Requirement: Language Preference Management
The configuration system SHALL let teams store their preferred language so OpenSpec-generated instructions and prompts stay aligned with how the team communicates.

#### Scenario: Setting preferred language to Chinese
- **WHEN** running `openspec config set language.preferred zh-CN`
- **THEN** validate that the value is a supported locale code (BCP 47) and normalize casing (e.g., `zh-CN`)
- **AND** save it to `config.json`
- **AND** display a confirmation mentioning that subsequent CLI instructions will use Chinese until changed

#### Scenario: Reporting preferred language in listings
- **WHEN** running `openspec config --json`
- **THEN** include the resolved `language.preferred` value (or `null` when unset) plus a derived `language.active` field showing the fallback language in use
- **AND** mention the language in the human-readable table output so developers understand why generated docs may appear in Chinese or another locale
