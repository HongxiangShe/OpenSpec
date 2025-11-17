import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { ProjectContext } from './project-template.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_PATH = path.resolve(
  __dirname,
  '../../../openspec/AGENTS.md'
);

let cachedTemplate: string | null = null;

const loadTemplate = (targetPath: string, fallback: string): string => {
  try {
    return fs.readFileSync(targetPath, 'utf-8');
  } catch {
    return fallback;
  }
};

const getTemplate = (): string => {
  if (cachedTemplate === null) {
    cachedTemplate = loadTemplate(TEMPLATE_PATH, '# OpenSpec Instructions\n');
  }
  return cachedTemplate;
};

export const agentsTemplate = (_context: ProjectContext = {}): string => {
  // AGENTS.md is project-level and language-agnostic
  // User language preferences only affect slash commands and generated docs
  return getTemplate();
};
