import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.windsurf/workflows/openspec-proposal.md',
  update: '.windsurf/workflows/openspec-update.md',
  apply: '.windsurf/workflows/openspec-apply.md',
  archive: '.windsurf/workflows/openspec-archive.md'
};

export class WindsurfSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'windsurf';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string | undefined {
    const descriptions: Record<SlashCommandId, string> = {
      proposal: 'Scaffold a new OpenSpec change and validate strictly.',
      update: 'Continue refining an existing OpenSpec change proposal.',
      apply: 'Implement an approved OpenSpec change and keep tasks in sync.',
      archive: 'Archive a deployed OpenSpec change and update specs.'
    };
    const description = descriptions[id];
    return `---\ndescription: ${description}\nauto_execution_mode: 3\n---`;
  }
}
