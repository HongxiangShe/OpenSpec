## Why
OpenSpec currently has no persistent user-level configuration, preventing individual developers from tailoring OpenSpec behavior to their workflow. Multilingual teams need OpenSpec to remember the language they want AI assistants to use so generated documentation and instructions stay consistent (most teammates work in Chinese, while a subset prefers other dialect-specific writing). A user-level configuration system lets people store their preferred settings once—especially language preferences—and reuse them across projects.

## What Changes
- Add a user configuration store (defaulting to `~/.config/openspec/config.json`, overridable via `OPENSPEC_HOME`) with helpers for reading, writing, and validating key structures.
- Introduce an `openspec config` command (with `list`, `set`, `unset`, and `reset` actions) so users can inspect current preferences and change them without editing JSON manually; include optional JSON output for automation.
- Add a `language.preferred` key (e.g., `zh-CN`, `en-US`) that instructs OpenSpec-generated instructions, prompts, and CLI output to adopt the chosen language so AI assistants consistently communicate in the team's preferred language.
- Document the configuration workflow—including the language toggle—in `openspec/AGENTS.md`, README, and other quick-start material so users know where the config lives and how to manage it.

## Impact
- Affected specs: `specs/cli-config`, `specs/docs-agent-instructions`
- Affected code: `src/cli/index.ts`, `src/core/config.ts`, `src/core/templates`, `src/utils`, documentation
