## Why
- 目前 CLI 仅生成 `/openspec-proposal`、`/openspec-apply` 与 `/openspec-archive` 三个斜杠指令，提案被审阅后若要迭代内容，用户只能手写提示或复制旧文本，导致迭代过程缺乏统一指挥，且不同 AI 工具有各自的模版格式，很容易失配。
- 缺少受管模版还让 `openspec update` 无法同步新阶段的语法或流程，项目一旦手动添加 `/openspec-update` 指令就会在下次更新时被覆盖或遗失。
- 通过官方模板补齐更新阶段，可以让提案→迭代→实施→归档的工作流保持闭环，帮助团队快速定位当前变更 ID 并聚焦在 proposal/tasks/design/spec 的改动点。

## What Changes
- 在共享斜杠指令模板中新增 `update` 阶段（含中英文），沿用 proposal 的 YAML/frontmatter 格式，并明确要求：
  - 确认变更 ID、复盘现有文档后再继续编辑
  - 识别模糊或不明确的细节并在编辑前提问（与 proposal 保持一致）
  - 详细说明如何编辑 spec deltas（ADDED/MODIFIED/REMOVED，修改需求必须包含完整内容）
  - 提供调试命令（`jq '.deltas'` 等）帮助排查验证失败
- 更新 `openspec init`：当用户选择 Claude Code、CodeBuddy、Cline、Crush、Cursor、Factory Droid、OpenCode、Windsurf、Kilo Code、Codex、GitHub Copilot、Gemini CLI、RooCode 等受管工具时，同时生成 `/openspec-update` 文件（路径与既有 proposal/apply/archive 一致）。
- 更新 `openspec update`：在这些工具已经存在 update 文件时刷新其内容，遵循"只更新受管块、不新增缺失文件"的原则。
- 扩充 `cli-init` 与 `cli-update` 规范，记录新增的 update 指令及其指挥内容，确保验证覆盖新的模板。

## Impact
- 影响规范：`specs/cli-init`、`specs/cli-update`
- 影响代码：`src/core/templates/slash-command-templates.ts`、`src/core/configurators/slash/*`、`TemplateManager`、相关 CLI 文档/测试
