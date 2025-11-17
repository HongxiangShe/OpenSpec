## 1. 模板与内容
- [x] 1.1 在 `src/core/templates/slash-command-templates.ts` 中加入 `update` stage，扩充 `SlashCommandId`、英文/中文 body，并沿用 proposal/frontmatter 的结构。
- [x] 1.2 为 update 模板补齐具体步骤：确认 change-id、阅读 `proposal.md`/`tasks.md`/`design.md`/`spec`、根据输入继续完善，并输出参考指引。
- [x] 1.3 完善 update 模板内容：添加"识别模糊细节"指导、详细说明 spec deltas 编辑方式（ADDED/MODIFIED/REMOVED）、增强参考部分的调试命令。

## 2. init 指令生成
- [x] 2.1 更新各 SlashCommandConfigurator（Claude、CodeBuddy、Cline、Crush、Cursor、Factory、OpenCode、Windsurf、Kilo Code、Codex、Copilot、Gemini、RooCode），在初始化时创建 update 指令文件，路径与其他阶段保持一致。
- [x] 2.2 针对带 frontmatter 的工具（Crush、Factory、Copilot、Gemini 等）验证 `description`、`argument-hint`、`$ARGUMENTS` 等字段仍符合要求。

## 3. update 指令刷新
- [x] 3.1 扩展 `openspec update` 的刷新逻辑，仅在对应 update 文件存在时写入新模板，并保持“只更新受管块不新增文件”的约束。
- [x] 3.2 为新阶段补齐单元/集成测试，覆盖至少一个本地目录型工具与一个全局提示目录工具。

## 4. 文档与校验
- [x] 4.1 更新 README/AGENTS/CLI 帮助中列举的可用斜杠命令，使 `/openspec-update` 与其它阶段并列。
- [x] 4.2 运行 `openspec validate add-update-slash-command --strict`，整理任何校验错误。
