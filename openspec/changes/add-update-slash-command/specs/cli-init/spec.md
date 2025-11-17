## MODIFIED Requirements
### Requirement: Slash Command Configuration
The init command SHALL create `/openspec-update` files for each supported assistant alongside the existing proposal/apply/archive commands.
#### 场景：Generating slash commands for Claude Code
- **THEN** 在 `.claude/commands/openspec/` 下同时创建 `update.md`，文件格式与 proposal/apply/archive 一致，内容来自新的 update 模板。

#### 场景：Generating slash commands for CodeBuddy Code
- **THEN** `.codebuddy/commands/openspec/` 也要生成 `update.md`，并沿用共享模板以保持四个阶段文本一致。

#### 场景：Generating slash commands for Cline
- **THEN** 在 `.clinerules/` 中新增 `openspec-update.md`，仍使用 Cline 专属的 Markdown 标题前缀。

#### 场景：Generating slash commands for Crush
- **THEN** 在 `.crush/commands/openspec/` 下创建 `update.md`，保留 Crush frontmatter（category、tags）后写入 update 模板。

#### 场景：Generating slash commands for Cursor
- **THEN** 在 `.cursor/commands/` 下创建 `openspec-update.md`，确保 `/openspec-update` 与其它阶段共享模板。

#### 场景：Generating slash commands for Factory Droid
- **THEN** 在 `.factory/commands/` 下创建 `openspec-update.md`，写入 Factory 版本模板，保持 `description`、`argument-hint` 与 `$ARGUMENTS` 占位符。

#### 场景：Generating slash commands for OpenCode
- **THEN** 在 `.opencode/commands/` 中创建 `openspec-update.md`，沿用 `$ARGUMENTS` 结构以承载用户补充信息。

#### 场景：Generating slash commands for Windsurf
- **THEN** 在 `.windsurf/workflows/` 中生成 `openspec-update.md`，并继续在 OpenSpec 管理块内填充内容。

#### 场景：Generating slash commands for Kilo Code
- **THEN** 在 `.kilocode/workflows/` 中生成 `openspec-update.md`，保持与其他阶段相同的 wrap 方式。

#### 场景：Generating slash commands for Codex
- **THEN** 在 `~/.codex/prompts/`（或 `$CODEX_HOME`）写入 `openspec-update.md`，并继续使用 `$1` 占位符映射 slash 参数。

#### 场景：Generating slash commands for GitHub Copilot
- **THEN** 在 `.github/prompts/` 下创建 `openspec-update.prompt.md`，沿用 YAML frontmatter（含 description、`$ARGUMENTS`）。

#### 场景：Generating slash commands for Gemini CLI
- **THEN** 在 `.gemini/commands/openspec/` 中新增 `update.toml`，写入 `description = "OpenSpec: Update"`（或等效文案）与 `prompt = """` 包裹的模板内容。

#### 场景：Generating slash commands for RooCode
- **THEN** 在 `.roo/commands/` 中创建 `openspec-update.md`，继续使用简单 Markdown 标题并包裹 OpenSpec 管理块。
