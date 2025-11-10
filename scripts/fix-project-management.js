#!/usr/bin/env node
/**
 * Postinstall script to fix @powerhousedao/project-management package.json exports
 * Removes broken "development" conditions that point to non-existent source files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packagePath = path.join(
  __dirname,
  '..',
  'node_modules',
  '@powerhousedao',
  'project-management',
  'package.json'
);

if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Fix exports by removing "development" conditions that point to non-existent files
  if (packageJson.exports) {
    const fixedExports = {};
    
    for (const [key, value] of Object.entries(packageJson.exports)) {
      if (typeof value === 'object' && value !== null) {
        // Remove "development" condition, keep only "types" and "default"
        const fixedValue = {};
        if (value.types) fixedValue.types = value.types;
        if (value.default) fixedValue.default = value.default;
        fixedExports[key] = fixedValue;
      } else {
        fixedExports[key] = value;
      }
    }
    
    packageJson.exports = fixedExports;
    
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log('✅ Fixed @powerhousedao/project-management package.json exports');
  }
} else {
  console.warn('⚠️  @powerhousedao/project-management package.json not found');
}

