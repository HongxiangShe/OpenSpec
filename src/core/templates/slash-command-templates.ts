export type SlashCommandId = 'proposal' | 'apply' | 'archive';

// English templates
const baseGuardrails = `**Guardrails**
- Favor straightforward, minimal implementations first and add complexity only when it is requested or clearly required.
- Keep changes tightly scoped to the requested outcome.
- Refer to \`openspec/AGENTS.md\` (located inside the \`openspec/\` directory—run \`ls openspec\` or \`openspec update\` if you don't see it) if you need additional OpenSpec conventions or clarifications.`;

const proposalGuardrails = `${baseGuardrails}\n- Identify any vague or ambiguous details and ask the necessary follow-up questions before editing files.`;

const proposalSteps = `**Steps**
1. Review \`openspec/project.md\`, run \`openspec list\` and \`openspec list --specs\`, and inspect related code or docs (e.g., via \`rg\`/\`ls\`) to ground the proposal in current behaviour; note any gaps that require clarification.
2. Choose a unique verb-led \`change-id\` and scaffold \`proposal.md\`, \`tasks.md\`, and \`design.md\` (when needed) under \`openspec/changes/<id>/\`.
3. Map the change into concrete capabilities or requirements, breaking multi-scope efforts into distinct spec deltas with clear relationships and sequencing.
4. Capture architectural reasoning in \`design.md\` when the solution spans multiple systems, introduces new patterns, or demands trade-off discussion before committing to specs.
5. Draft spec deltas in \`changes/<id>/specs/<capability>/spec.md\` (one folder per capability) using \`## ADDED|MODIFIED|REMOVED Requirements\` with at least one \`#### Scenario:\` per requirement and cross-reference related capabilities when relevant.
6. Draft \`tasks.md\` as an ordered list of small, verifiable work items that deliver user-visible progress, include validation (tests, tooling), and highlight dependencies or parallelizable work.
7. Validate with \`openspec validate <id> --strict\` and resolve every issue before sharing the proposal.`;

const proposalReferences = `**Reference**
- Use \`openspec show <id> --json --deltas-only\` or \`openspec show <spec> --type spec\` to inspect details when validation fails.
- Search existing requirements with \`rg -n "Requirement:|Scenario:" openspec/specs\` before writing new ones.
- Explore the codebase with \`rg <keyword>\`, \`ls\`, or direct file reads so proposals align with current implementation realities.`;

const applySteps = `**Steps**
Track these steps as TODOs and complete them one by one.
1. Read \`changes/<id>/proposal.md\`, \`design.md\` (if present), and \`tasks.md\` to confirm scope and acceptance criteria.
2. Work through tasks sequentially, keeping edits minimal and focused on the requested change.
3. Confirm completion before updating statuses—make sure every item in \`tasks.md\` is finished.
4. Update the checklist after all work is done so each task is marked \`- [x]\` and reflects reality.
5. Reference \`openspec list\` or \`openspec show <item>\` when additional context is required.`;

const applyReferences = `**Reference**
- Use \`openspec show <id> --json --deltas-only\` if you need additional context from the proposal while implementing.`;

const archiveSteps = `**Steps**
1. Determine the change ID to archive:
   - If this prompt already includes a specific change ID (for example inside a \`<ChangeId>\` block populated by slash-command arguments), use that value after trimming whitespace.
   - If the conversation references a change loosely (for example by title or summary), run \`openspec list\` to surface likely IDs, share the relevant candidates, and confirm which one the user intends.
   - Otherwise, review the conversation, run \`openspec list\`, and ask the user which change to archive; wait for a confirmed change ID before proceeding.
   - If you still cannot identify a single change ID, stop and tell the user you cannot archive anything yet.
2. Validate the change ID by running \`openspec list\` (or \`openspec show <id>\`) and stop if the change is missing, already archived, or otherwise not ready to archive.
3. Run \`openspec archive <id> --yes\` so the CLI moves the change and applies spec updates without prompts (use \`--skip-specs\` only for tooling-only work).
4. Review the command output to confirm the target specs were updated and the change landed in \`changes/archive/\`.
5. Validate with \`openspec validate --strict\` and inspect with \`openspec show <id>\` if anything looks off.`;

const archiveReferences = `**Reference**
- Use \`openspec list\` to confirm change IDs before archiving.
- Inspect refreshed specs with \`openspec list --specs\` and address any validation issues before handing off.`;

// Chinese templates
const languageInstructionZh = `**语言要求**
- 请使用简体中文与我沟通
- 生成的所有文档（proposal.md、tasks.md、design.md、spec.md）都使用简体中文
- 代码、文件名和技术术语保持英文`;

const baseGuardrailsZh = `**规范要求**
- 优先采用简单直接的实现，仅在明确需要时增加复杂度。
- 保持变更范围紧密聚焦于请求的结果。
- 如需了解更多 OpenSpec 约定或澄清细节，请参考 \`openspec/AGENTS.md\`（位于 \`openspec/\` 目录下——如果看不到该文件，请运行 \`ls openspec\` 或 \`openspec update\`）。`;

const proposalGuardrailsZh = `${languageInstructionZh}\n\n${baseGuardrailsZh}\n- 识别任何模糊或不明确的细节，并在编辑文件前提出必要的后续问题。`;

const proposalStepsZh = `**步骤**
1. 查看 \`openspec/project.md\`，运行 \`openspec list\` 和 \`openspec list --specs\`，并检查相关代码或文档（例如，通过 \`rg\`/\`ls\`），以便将提案建立在当前行为的基础上；记录任何需要澄清的空白。
2. 选择一个独特的动词引导的 \`change-id\`，并在 \`openspec/changes/<id>/\` 下搭建 \`proposal.md\`、\`tasks.md\` 和 \`design.md\`（如果需要）。
3. 将变更映射为具体的能力或需求，将多范围的工作分解为具有清晰关系和顺序的独特规范增量。
4. 当解决方案跨越多个系统、引入新模式或在提交规范前需要权衡讨论时，在 \`design.md\` 中记录架构推理。
5. 在 \`changes/<id>/specs/<capability>/spec.md\` 中起草规范增量（每个能力一个文件夹），使用 \`## 新增|修改|删除 需求\`，每个需求至少包含一个 \`#### 场景：\`，并在相关时交叉引用相关能力。
6. 将 \`tasks.md\` 起草为一个有序的小型、可验证的工作项列表，这些工作项提供用户可见的进展，包括验证（测试、工具），并突出依赖关系或可并行的工作。
7. 使用 \`openspec validate <id> --strict\` 进行验证，并在分享提案前解决所有问题。`;

const proposalReferencesZh = `**参考**
- 当验证失败时，使用 \`openspec show <id> --json --deltas-only\` 或 \`openspec show <spec> --type spec\` 检查详细信息。
- 在编写新需求前，使用 \`rg -n "Requirement:|Scenario:" openspec/specs\` 搜索现有需求。
- 使用 \`rg <keyword>\`、\`ls\` 或直接文件读取探索代码库，以便提案与当前实现现实对齐。`;

const applyGuardrailsZh = `${languageInstructionZh}\n\n${baseGuardrailsZh}`;

const applyStepsZh = `**步骤**
将这些步骤作为待办事项跟踪，并逐一完成。
1. 阅读 \`changes/<id>/proposal.md\`、\`design.md\`（如果存在）和 \`tasks.md\` 以确认范围和验收标准。
2. 按顺序处理任务，保持编辑最小化并专注于请求的变更。
3. 在更新状态前确认完成——确保 \`tasks.md\` 中的每个项目都已完成。
4. 在所有工作完成后更新检查清单，以便每个任务都标记为 \`- [x]\` 并反映现实。
5. 当需要额外上下文时，引用 \`openspec list\` 或 \`openspec show <item>\`。`;

const applyReferencesZh = `**参考**
- 如果在实现时需要来自提案的额外上下文，请使用 \`openspec show <id> --json --deltas-only\`。`;

const archiveGuardrailsZh = `${languageInstructionZh}\n\n${baseGuardrailsZh}`;

const archiveStepsZh = `**步骤**
1. 确定要归档的变更 ID：
   - 如果此提示已经包含特定的变更 ID（例如，在由斜杠命令参数填充的 \`<ChangeId>\` 块中），请在修剪空格后使用该值。
   - 如果对话松散地引用了变更（例如，通过标题或摘要），请运行 \`openspec list\` 以显示可能的 ID，共享相关候选项，并确认用户的意图。
   - 否则，请查看对话，运行 \`openspec list\`，并询问用户要归档哪个变更；在继续之前等待确认的变更 ID。
   - 如果仍然无法识别单个变更 ID，请停止并告诉用户您还无法归档任何内容。
2. 通过运行 \`openspec list\`（或 \`openspec show <id>\`）验证变更 ID，如果变更缺失、已归档或未准备好归档，则停止。
3. 运行 \`openspec archive <id> --yes\`，以便 CLI 移动变更并在不提示的情况下应用规范更新（仅对工具相关工作使用 \`--skip-specs\`）。
4. 查看命令输出以确认目标规范已更新，变更已落入 \`changes/archive/\`。
5. 使用 \`openspec validate --strict\` 进行验证，如果有任何问题，请使用 \`openspec show <id>\` 检查。`;

const archiveReferencesZh = `**参考**
- 在归档前使用 \`openspec list\` 确认变更 ID。
- 使用 \`openspec list --specs\` 检查更新的规范，并在交接前解决任何验证问题。`;

const slashCommandBodiesEn: Record<SlashCommandId, string> = {
  proposal: [proposalGuardrails, proposalSteps, proposalReferences].join('\n\n'),
  apply: [baseGuardrails, applySteps, applyReferences].join('\n\n'),
  archive: [baseGuardrails, archiveSteps, archiveReferences].join('\n\n')
};

const slashCommandBodiesZh: Record<SlashCommandId, string> = {
  proposal: [proposalGuardrailsZh, proposalStepsZh, proposalReferencesZh].join('\n\n'),
  apply: [applyGuardrailsZh, applyStepsZh, applyReferencesZh].join('\n\n'),
  archive: [archiveGuardrailsZh, archiveStepsZh, archiveReferencesZh].join('\n\n')
};

const hasChineseLocale = (languageCode?: string): boolean => {
  if (!languageCode) {
    return false;
  }
  return languageCode.toLowerCase().startsWith('zh');
};

export function getSlashCommandBody(id: SlashCommandId, language?: string): string {
  const usesChinese = hasChineseLocale(language);
  const bodies = usesChinese ? slashCommandBodiesZh : slashCommandBodiesEn;
  return bodies[id];
}
