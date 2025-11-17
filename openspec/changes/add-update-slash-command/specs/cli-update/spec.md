## MODIFIED Requirements
### Requirement: Slash Command Updates
The update command SHALL refresh the new `/openspec-update` files for every supported tool whenever those files already exist.
#### 场景：Updating slash commands for Claude Code
- **AND** 如果 `.claude/commands/openspec/update.md` 已存在，则使用共享模板刷新 `/openspec-update`，并保持与 proposal/apply/archive 相同的 frontmatter 与中文/英文正文结构。

#### 场景：Updating slash commands for CodeBuddy Code
- **AND** `.codebuddy/commands/openspec/update.md` 存在时也必须被刷新，文本内容与其它阶段保持同步。

#### 场景：Updating slash commands for Cline
- **AND** 当 `.clinerules/openspec-update.md` 存在时刷新该文件，并继续附带 Cline 所需的 Markdown 标题前缀。

#### 场景：Updating slash commands for Crush
- **AND** `.crush/commands/openspec/update.md` 若存在，刷新时需保留 Crush frontmatter（category、tags）并写入新的 update 模板正文。

#### 场景：Updating slash commands for Cursor
- **AND** `.cursor/commands/openspec-update.md` 存在时刷新，使 `/openspec-update` 与其它阶段共用模板逻辑。

#### 场景：Updating slash commands for Factory Droid
- **AND** `.factory/commands/openspec-update.md` 存在时刷新，同时维持 `description`、`argument-hint` 与 `$ARGUMENTS` 占位符，只替换受管块。

#### 场景：Updating slash commands for OpenCode
- **AND** `.opencode/command/openspec-update.md` 存在时刷新，并保持 `$ARGUMENTS` 占位符让用户继续传入补充信息。

#### 场景：Updating slash commands for Windsurf
- **AND** `.windsurf/workflows/openspec-update.md` 已存在时刷新，依然包裹在 OpenSpec 管理标记中以便后续更新。

#### 场景：Updating slash commands for Kilo Code
- **AND** `.kilocode/workflows/openspec-update.md` 存在时刷新，延续 “仅更新受管块，缺失文件不创建” 的规则。

#### 场景：Updating slash commands for Codex
- **AND** `~/.codex/prompts/openspec-update.md`（或 `$CODEX_HOME`）存在时刷新，并继续使用 `$1` 占位符承载 slash 参数。

#### 场景：Updating slash commands for GitHub Copilot
- **AND** `.github/prompts/openspec-update.prompt.md` 存在时刷新，同时保留 YAML frontmatter 与 `$ARGUMENTS` 占位符，仅更新 OPENSPEC 标记内的正文。

#### 场景：Updating slash commands for Gemini CLI
- **AND** `.gemini/commands/openspec/update.toml` 存在时刷新，在 `prompt = """` 块内的 `<!-- OPENSPEC:START --> … <!-- OPENSPEC:END -->` 之间写入新的 update 模板，保持 TOML 结构不变。

## ADDED Requirements
### Requirement: Update Slash Command Template
`openspec` SHALL 提供 `/openspec-update` 模板，帮助 AI 在已有提案基础上继续完善同一变更。

#### 场景：Update 模板内容
- **WHEN** 生成 update 模板（任意语言）
- **THEN** 复制 proposal 模板的 frontmatter/语言块结构
- **AND** 在规范要求中添加：确认这是在既有变更上继续迭代；识别任何模糊或不明确的细节并在编辑前提问
- **AND** 在步骤中要求：确认唯一 change-id（可读取 slash 参数或运行 `openspec list`）；阅读现有 `proposal.md`、`tasks.md`、`design.md`（若存在）与所有 `changes/<id>/specs/<capability>/spec.md`；根据用户输入更新相关文档（proposal.md 的 Why/What/Impact、tasks.md 的任务项、design.md 仅在架构改变时调整、specs/*.md 使用 ADDED/MODIFIED/REMOVED 编辑规范增量且修改需求必须包含完整内容）
- **AND** 在参考中提供：使用 `openspec show <id> --json --deltas-only` 复盘已有内容、使用 `rg -n "Requirement:|Scenario:" openspec/specs` 搜索现有需求、使用 `jq '.deltas'` 调试 delta 解析
- **AND** 指示在所有工作完成后运行 `openspec validate <id> --strict` 或总结剩余阻塞。

#### 场景：Locale 自适应
- **WHEN** CLI 根据用户语言生成 update 模板
- **THEN** 中文版本须包含 `**语言要求**`、`**规范要求**` 与 `**步骤**`/`**参考**` 段落；英文版本沿用 proposal 的 Guardrails/Steps/Reference 结构；两个版本都需要明确"根据输入继续完善 change"这一核心目标且包含详细的 spec deltas 编辑指导。
