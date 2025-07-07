#!/usr/bin/env node

/**
 * Script to sync version from package.json to version.ts
 * Run this after updating version with npm version commands
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

try {
  // Read package.json
  const packageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));
  const version = packageJson.version;
  
  // Read current version.ts
  const versionPath = join(rootDir, 'src/config/version.ts');
  let versionContent = readFileSync(versionPath, 'utf8');
  
  // Update version
  versionContent = versionContent.replace(
    /export const VERSION = '[^']+';/,
    `export const VERSION = '${version}';`
  );
  
  // Update build date
  const buildDate = new Date().toISOString();
  versionContent = versionContent.replace(
    /export const BUILD_DATE = '[^']+';/,
    `export const BUILD_DATE = '${buildDate}';`
  );
  
  // Write updated content
  writeFileSync(versionPath, versionContent);
  
  console.log(`✅ Version synced: ${version}`);
  console.log(`📅 Build date updated: ${buildDate}`);
  
} catch (error) {
  console.error('❌ Error syncing version:', error.message);
  process.exit(1);
}