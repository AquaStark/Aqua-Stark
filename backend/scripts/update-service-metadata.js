#!/usr/bin/env node

/**
 * Service Metadata Update Script
 *
 * This script updates version, date, and author information across all service files
 * from a central configuration file to maintain consistency.
 *
 * @fileoverview Service metadata management
 * @author Aqua Stark Team
 * @version 1.0.0
 * @since 2025-09-16
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import package info
import { PACKAGE_INFO } from '../src/config/package-info.js';

// Configuration
const SERVICES_DIR = path.join(__dirname, '../src/services');
const EXCLUDED_FILES = ['index.js'];

/**
 * Update service file metadata
 */
function updateServiceMetadata(filePath) {
  const fileName = path.basename(filePath);

  if (EXCLUDED_FILES.includes(fileName)) {
    console.log(`Skipping ${fileName} (excluded)`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Create the new JSDoc metadata
    const newMetadata = ` * @class ${fileName.replace('Service.js', 'Service')}
 * @author ${PACKAGE_INFO.author}
 * @version ${PACKAGE_INFO.version}
 * @since ${PACKAGE_INFO.since}`;

    // Check if file contains @since tag
    if (content.includes('@since')) {
      // Replace the @since tag with new date
      content = content.replace(
        /@since\s+[\d-]+/g,
        `@since ${PACKAGE_INFO.since}`
      );

      // Replace version if it exists
      if (content.includes('@version')) {
        content = content.replace(
          /@version\s+[\d.]+/g,
          `@version ${PACKAGE_INFO.version}`
        );
      }

      // Replace author if it exists
      if (content.includes('@author')) {
        content = content.replace(
          /@author\s+.*$/gm,
          `@author ${PACKAGE_INFO.author}`
        );
      }

      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated metadata in ${fileName}`);
    } else {
      console.log(`No @since tag found in ${fileName}`);
    }
  } catch (error) {
    console.error(`Error updating ${fileName}:`, error.message);
  }
}

/**
 * Main function
 */
function main() {
  console.log('Updating service metadata from central configuration...\n');

  console.log('Package Info:');
  console.log(`  Version: ${PACKAGE_INFO.version}`);
  console.log(`  Since: ${PACKAGE_INFO.since}`);
  console.log(`  Author: ${PACKAGE_INFO.author}\n`);

  console.log(`Services directory: ${SERVICES_DIR}`);
  console.log(`Directory exists: ${fs.existsSync(SERVICES_DIR)}\n`);

  // Read services directory
  if (!fs.existsSync(SERVICES_DIR)) {
    console.error(`Services directory not found: ${SERVICES_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(SERVICES_DIR)
    .filter(file => file.endsWith('.js'))
    .map(file => path.join(SERVICES_DIR, file));

  // Update each file
  files.forEach(file => updateServiceMetadata(file));

  console.log('\nService metadata update completed!');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
} else {
  // Also run if called from command line
  main();
}

export { updateServiceMetadata };
