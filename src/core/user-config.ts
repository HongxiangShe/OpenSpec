import os from 'os';
import path from 'path';
import { promises as fs } from 'fs';
import { FileSystemUtils } from '../utils/file-system.js';

export type ConfigKey = 'language.preferred';

export interface UserConfigData {
  language?: {
    preferred?: string;
  };
}

export interface ConfigIssue {
  key: string;
  message: string;
}

export interface ConfigSummary {
  location: string;
  exists: boolean;
  schemaVersion: number;
  values: UserConfigData;
  derived: {
    language: {
      active: string;
    };
  };
  issues: ConfigIssue[];
}

const SCHEMA_VERSION = 1;
const DEFAULT_LANGUAGE = 'en-US';

export class UserConfigService {
  private readonly configDir: string;
  private readonly configPath: string;

  constructor() {
    this.configDir = this.resolveConfigDirectory();
    this.configPath = path.join(this.configDir, 'config.json');
  }

  get path(): string {
    return this.configPath;
  }

  get defaultLanguage(): string {
    return DEFAULT_LANGUAGE;
  }

  async getSummary(): Promise<ConfigSummary> {
    const { data, issues, exists } = await this.loadInternal();
    return {
      location: this.configPath,
      exists,
      schemaVersion: SCHEMA_VERSION,
      values: data,
      derived: {
        language: {
          active: data.language?.preferred ?? DEFAULT_LANGUAGE,
        },
      },
      issues,
    };
  }

  async setValue(key: ConfigKey, value: unknown): Promise<ConfigSummary> {
    const config = await this.readRawConfig();
    switch (key) {
      case 'language.preferred': {
        const parsed = this.parseLanguageInput(value);
        config.language = config.language ?? {};
        config.language.preferred = parsed;
        break;
      }
      default:
        throw new Error(`Unsupported config key: ${key as string}`);
    }

    this.cleanupEmptyContainers(config);
    await this.writeRawConfig(config);
    return await this.getSummary();
  }

  async unsetValue(key: ConfigKey): Promise<ConfigSummary> {
    const config = await this.readRawConfig();
    switch (key) {
      case 'language.preferred':
        if (config.language) {
          delete config.language.preferred;
        }
        break;
      default:
        throw new Error(`Unsupported config key: ${key as string}`);
    }

    this.cleanupEmptyContainers(config);
    await this.writeRawConfig(config);
    return await this.getSummary();
  }

  async reset(): Promise<ConfigSummary> {
    await this.writeRawConfig({});
    return await this.getSummary();
  }

  async getEffectiveConfig(): Promise<UserConfigData> {
    const { data } = await this.loadInternal();
    return data;
  }

  private resolveConfigDirectory(): string {
    const override = process.env.OPENSPEC_HOME?.trim();
    if (override) {
      return path.resolve(override);
    }

    if (process.platform === 'win32') {
      const appData = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
      return path.join(appData, 'OpenSpec');
    }

    const xdg = process.env.XDG_CONFIG_HOME?.trim();
    const baseDir = xdg && xdg.length > 0 ? xdg : path.join(os.homedir(), '.config');
    return path.join(baseDir, 'openspec');
  }

  private async loadInternal(): Promise<{ data: UserConfigData; issues: ConfigIssue[]; exists: boolean }> {
    const issues: ConfigIssue[] = [];
    const exists = await FileSystemUtils.fileExists(this.configPath);
    if (!exists) {
      return { data: {}, issues, exists };
    }

    try {
      const content = await fs.readFile(this.configPath, 'utf-8');
      const raw = JSON.parse(content);
      const normalized = this.normalizeRawData(raw, issues);
      return { data: normalized, issues, exists };
    } catch (error: any) {
      issues.push({ key: 'global', message: `Invalid config file: ${error.message}` });
      return { data: {}, issues, exists };
    }
  }

  private normalizeRawData(raw: unknown, issues: ConfigIssue[]): UserConfigData {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      issues.push({
        key: 'global',
        message: 'Configuration must be a JSON object. Run "openspec config reset" to regenerate the file.',
      });
      return {};
    }

    const result: UserConfigData = {};
    const candidate = raw as Record<string, unknown>;

    if (candidate.language !== undefined) {
      if (!candidate.language || typeof candidate.language !== 'object' || Array.isArray(candidate.language)) {
        issues.push({ key: 'language', message: '"language" must be an object.' });
      } else {
        const language: Record<string, unknown> = candidate.language as Record<string, unknown>;
        const normalized: UserConfigData['language'] = {};

        if ('preferred' in language) {
          const value = this.normalizeLanguage(language.preferred, issues, false);
          if (value) {
            normalized.preferred = value;
          }
        }

        if (Object.keys(normalized).length > 0) {
          result.language = normalized;
        }
      }
    }

    return result;
  }

  private normalizeLanguage(value: unknown, issues: ConfigIssue[], strict: boolean): string | undefined {
    if (value === undefined || value === null) {
      if (strict) {
        throw new Error('language.preferred expects a BCP 47 language tag (e.g., zh-CN, en-US).');
      }
      return undefined;
    }

    if (typeof value !== 'string') {
      if (strict) {
        throw new Error('language.preferred expects a string language tag.');
      }
      issues.push({ key: 'language.preferred', message: 'Expected a string language tag (e.g., zh-CN).' });
      return undefined;
    }

    const trimmed = value.trim();
    if (!trimmed) {
      if (strict) {
        throw new Error('language.preferred cannot be empty.');
      }
      return undefined;
    }

    try {
      const canonical = Intl.getCanonicalLocales(trimmed)[0];
      if (!canonical) {
        throw new Error(`Invalid language code: ${value}`);
      }
      return canonical;
    } catch (error: any) {
      if (strict) {
        throw new Error(`Invalid language code: ${value}. ${error.message}`);
      }
      issues.push({ key: 'language.preferred', message: `Ignored invalid language tag "${value}".` });
      return undefined;
    }
  }

  private parseLanguageInput(value: unknown): string {
    const parsed = this.normalizeLanguage(value, [], true);
    if (!parsed) {
      throw new Error('language.preferred expects a valid BCP 47 language tag (e.g., zh-CN, en-US).');
    }
    return parsed;
  }

  private cleanupEmptyContainers(config: UserConfigData): void {
    if (config.language && Object.keys(config.language).length === 0) {
      delete config.language;
    }
  }

  private async readRawConfig(): Promise<UserConfigData> {
    const exists = await FileSystemUtils.fileExists(this.configPath);
    if (!exists) {
      return {};
    }

    const content = await fs.readFile(this.configPath, 'utf-8');
    try {
      const raw = JSON.parse(content);
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
        return {};
      }
      return raw as UserConfigData;
    } catch {
      return {};
    }
  }

  private async writeRawConfig(data: UserConfigData): Promise<void> {
    const payload = JSON.stringify(data, null, 2) + '\n';
    await FileSystemUtils.createDirectory(path.dirname(this.configPath));
    const tempPath = path.join(
      path.dirname(this.configPath),
      `.tmp-${Date.now()}-${Math.random().toString(36).slice(2)}`
    );
    await fs.writeFile(tempPath, payload, 'utf-8');
    await fs.rename(tempPath, this.configPath);
  }
}
