import chalk from 'chalk';
import { confirm } from '@inquirer/prompts';
import {
  ConfigKey,
  ConfigSummary,
  UserConfigService,
} from '../core/user-config.js';
import { UpdateCommand } from '../core/update.js';
import { FileSystemUtils } from '../utils/file-system.js';
import path from 'path';

type ListOptions = { json?: boolean };
type ResetOptions = { yes?: boolean };

const SUPPORTED_KEYS: ConfigKey[] = ['language.preferred'];

export class UserConfigCommand {
  private readonly service: UserConfigService;

  constructor() {
    this.service = new UserConfigService();
  }

  async list(options?: ListOptions): Promise<void> {
    const summary = await this.service.getSummary();
    if (options?.json) {
      console.log(
        JSON.stringify(
          {
            location: summary.location,
            exists: summary.exists,
            schemaVersion: summary.schemaVersion,
            values: summary.values,
            derived: summary.derived,
            issues: summary.issues,
          },
          null,
          2
        )
      );
      return;
    }

    this.printSummary(summary);
  }

  async set(keyInput: string, rawValue: string): Promise<void> {
    const key = this.normalizeKey(keyInput);
    const value = this.parseInputValue(key, rawValue);
    const summary = await this.service.setValue(key, value);
    console.log(
      chalk.green(
        `✓ Saved ${key} to ${summary.location} (active language: ${summary.derived.language.active})`
      )
    );
    this.printSummary(summary);

    // Auto-update slash commands when language preference changes
    if (key === 'language.preferred') {
      await this.autoUpdateSlashCommands();
    }
  }

  async unset(keyInput: string): Promise<void> {
    const key = this.normalizeKey(keyInput);
    const summary = await this.service.unsetValue(key);
    console.log(chalk.green(`✓ Removed ${key} from ${summary.location}`));
    this.printSummary(summary);

    // Auto-update slash commands when language preference changes
    if (key === 'language.preferred') {
      await this.autoUpdateSlashCommands();
    }
  }

  async reset(options?: ResetOptions): Promise<void> {
    if (!options?.yes) {
      const shouldReset = await confirm({
        message: 'This will remove all saved configuration. Continue?',
        default: false,
      });
      if (!shouldReset) {
        console.log('Reset cancelled.');
        return;
      }
    }

    const summary = await this.service.reset();
    console.log(chalk.green(`✓ Reset configuration at ${summary.location}`));
    this.printSummary(summary);
  }

  private normalizeKey(input: string): ConfigKey {
    if (SUPPORTED_KEYS.includes(input as ConfigKey)) {
      return input as ConfigKey;
    }

    throw new Error(
      `Unsupported config key: ${input}. Supported keys: ${SUPPORTED_KEYS.join(', ')}`
    );
  }

  private parseInputValue(
    key: ConfigKey,
    value: string
  ): string {
    return value;
  }

  private async autoUpdateSlashCommands(): Promise<void> {
    const cwd = process.cwd();
    const openspecPath = path.join(cwd, 'openspec');

    // Check if current directory has an openspec/ folder
    const hasOpenSpec = await FileSystemUtils.directoryExists(openspecPath);

    if (hasOpenSpec) {
      console.log();
      console.log(chalk.gray('Updating slash commands with new language preference...'));
      try {
        const updateCommand = new UpdateCommand();
        await updateCommand.execute(cwd);
      } catch (error) {
        console.log(chalk.yellow('Note: Could not auto-update slash commands. Run `openspec update` manually if needed.'));
      }
    } else {
      console.log();
      console.log(chalk.gray('Note: Language preference saved. Run `openspec init` or `openspec update` in a project to apply changes.'));
    }
  }

  private printSummary(summary: ConfigSummary): void {
    console.log();
    console.log(chalk.white('OpenSpec user configuration'));
    console.log(`Location: ${summary.location}`);
    console.log(`Schema version: ${summary.schemaVersion}`);
    console.log(
      `Active language: ${summary.derived.language.active}` +
        (summary.values.language?.preferred
          ? ' (from language.preferred)'
          : ' (default)')
    );

    const values = summary.values;
    console.log();
    console.log(chalk.white('Values:'));
    console.log(
      `- language.preferred: ${values.language?.preferred ?? 'undefined'}`
    );

    if (summary.issues.length > 0) {
      console.log();
      console.log(chalk.yellow('Warnings:'));
      for (const issue of summary.issues) {
        console.log(`- ${issue.key}: ${issue.message}`);
      }
    }

    console.log();
    console.log(
      'Use `openspec config set <key> <value>` to update a value or `openspec config unset <key>` to remove it.'
    );
  }
}
