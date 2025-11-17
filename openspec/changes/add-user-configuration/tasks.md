## 1. Configuration storage
- [x] 1.1 Implement a user configuration service that resolves the config directory (`$OPENSPEC_HOME` override, otherwise OS-specific config dir), loads JSON with defaults, and writes updates atomically.
- [x] 1.2 Define a schema (Zod) for supported keys so invalid structures are rejected with actionable errors.
- [x] 1.3 Support a `language.preferred` key that stores BCP 47 tags (e.g., `zh-CN`, `en-US`) with normalization, validation, and sensible defaults when unset.

## 2. CLI command
- [x] 2.1 Register an `openspec config` command that lists the current config (default action) and supports `--json` output describing location, effective values, and validation errors.
- [x] 2.2 Add `set <key> <value>` and `unset <key>` subcommands (plus `reset --yes` confirmation) that accept comma-separated values for arrays; show success summaries and path info after each write.
- [x] 2.3 Ensure the CLI can set and preview `language.preferred`, including guardrails for unsupported locales and helpful messaging when switching languages.

## 3. Documentation
- [x] 3.1 Update `openspec/AGENTS.md`, README, and CLI help text to describe how to manage user configuration and which keys OpenSpec currently supports.
- [x] 3.2 Document how `language.preferred` influences AI communication, including guidance for Chinese-first teams and instructions for overriding the language per run when necessary.
