#!/usr/bin/env node

/**
 * Documentation Validation Script
 *
 * This script validates JSDoc documentation across all service files,
 * checking for completeness, consistency, and proper formatting.
 *
 * @fileoverview Documentation validation and reporting
 * @author Aqua Stark Team
 * @version 1.0.0
 * @since 2025-09-16
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SERVICES_DIR = path.join(__dirname, '../src/services');
const EXCLUDED_FILES = ['index.js'];
const REQUIRED_TAGS = ['@param', '@returns'];
const OPTIONAL_TAGS = [
  '@since',
  '@author',
  '@version',
  '@description',
  '@throws',
  '@example',
];

/**
 * Validation results storage
 */
class ValidationResults {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.stats = {
      totalFiles: 0,
      totalMethods: 0,
      documentedMethods: 0,
      missingDocumentation: 0,
    };
  }

  addError(file, method, message) {
    this.errors.push({ file, method, message });
  }

  addWarning(file, method, message) {
    this.warnings.push({ file, method, message });
  }

  incrementStats(stat) {
    this.stats[stat]++;
  }

  getReport() {
    const totalIssues = this.errors.length + this.warnings.length;
    const documentationCoverage =
      this.stats.totalMethods > 0
        ? (
            (this.stats.documentedMethods / this.stats.totalMethods) *
            100
          ).toFixed(2)
        : 0;

    return {
      summary: {
        totalFiles: this.stats.totalFiles,
        totalMethods: this.stats.totalMethods,
        documentedMethods: this.stats.documentedMethods,
        documentationCoverage: `${documentationCoverage}%`,
        totalErrors: this.errors.length,
        totalWarnings: this.warnings.length,
        totalIssues: totalIssues,
      },
      errors: this.errors,
      warnings: this.warnings,
    };
  }
}

/**
 * Extract JSDoc comments from file content
 */
function extractJSDocComments(content) {
  const jsdocRegex = /\/\*\*[\s\S]*?\*\//g;
  const comments = [];
  let match;

  while ((match = jsdocRegex.exec(content)) !== null) {
    comments.push({
      content: match[0],
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return comments;
}

/**
 * Extract method signatures from file content
 */
function extractMethods(content) {
  const methodRegex = /static\s+(?:async\s+)?(\w+)\s*\(([^)]*)\)\s*{/g;
  const methods = [];
  let match;

  while ((match = methodRegex.exec(content)) !== null) {
    const methodName = match[1];
    const paramsRaw = (match[2] || '').trim();
    const paramCount =
      paramsRaw === ''
        ? 0
        : paramsRaw.split(',').filter(p => p.trim() !== '').length;
    methods.push({
      name: methodName,
      paramCount,
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return methods;
}

/**
 * Validate JSDoc comment structure
 */
function validateJSDocComment(comment, method, results, fileName) {
  const content = comment.content;

  // Check for required tags
  for (const tag of REQUIRED_TAGS) {
    if (!content.includes(tag)) {
      // Methods with no parameters don't need @param
      if (tag === '@param' && method.paramCount === 0) {
        continue;
      }
      results.addError(fileName, method.name, `Missing required tag: ${tag}`);
    }
  }

  // Check for proper parameter documentation (optional warning)
  const paramMatches = content.match(
    /@param\s+\{([^}]+)\}\s+([\w.\[\]]+)(?:\s+-?\s*(.+))?/g
  );
  if (paramMatches) {
    paramMatches.forEach(param => {
      // Only warn if parameter has no description at all
      if (
        !param.includes('-') &&
        !param.includes('The ') &&
        !param.includes('Optional')
      ) {
        results.addWarning(
          fileName,
          method.name,
          `Parameter description missing: ${param}`
        );
      }
    });
  }

  // Check for return type documentation
  if (content.includes('@returns')) {
    const returnsMatch = content.match(/@returns\s+\{([^}]+)\}/);
    if (!returnsMatch) {
      results.addError(
        fileName,
        method.name,
        'Missing return type in @returns tag'
      );
    }
  }

  // Check for example code (optional)
  if (content.includes('@example')) {
    const exampleMatch = content.match(/@example[\s\S]*?```[\s\S]+?```/);
    if (!exampleMatch) {
      results.addWarning(
        fileName,
        method.name,
        'Example code block is empty or malformed'
      );
    }
  }

  // Check for class documentation
  if (content.includes('@class')) {
    if (
      !content.includes('@description') &&
      !content.includes('@fileoverview')
    ) {
      results.addWarning(
        fileName,
        method.name,
        'Class documentation missing description'
      );
    }
  }
}

/**
 * Validate a single service file
 */
function validateServiceFile(filePath, results) {
  const fileName = path.basename(filePath);

  if (EXCLUDED_FILES.includes(fileName)) {
    return;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    results.incrementStats('totalFiles');

    // Extract methods and JSDoc comments
    const methods = extractMethods(content);
    const jsdocComments = extractJSDocComments(content);

    // Validate each method
    methods.forEach(method => {
      results.incrementStats('totalMethods');

      // Find corresponding JSDoc comment
      const comment = jsdocComments.find(
        c => c.end < method.start && method.start - c.end < 100 // allow reasonable spacing
      );

      if (comment) {
        results.incrementStats('documentedMethods');
        validateJSDocComment(comment, method, results, fileName);
      } else {
        results.incrementStats('missingDocumentation');
        results.addError(
          fileName,
          method.name,
          'Method missing JSDoc documentation'
        );
      }
    });

    // Check for class-level documentation
    const classComment = jsdocComments.find(c => c.content.includes('@class'));
    if (!classComment) {
      results.addWarning(
        fileName,
        'Class',
        'Missing class-level JSDoc documentation'
      );
    }
  } catch (error) {
    results.addError(fileName, 'File', `Error reading file: ${error.message}`);
  }
}

/**
 * Generate detailed report
 */
function generateReport(results) {
  const report = results.getReport();

  console.log('\nDOCUMENTATION VALIDATION REPORT');
  console.log('=====================================\n');

  // Summary
  console.log('SUMMARY');
  console.log(`   Total Files: ${report.summary.totalFiles}`);
  console.log(`   Total Methods: ${report.summary.totalMethods}`);
  console.log(`   Documented Methods: ${report.summary.documentedMethods}`);
  console.log(
    `   Documentation Coverage: ${report.summary.documentationCoverage}`
  );
  console.log(`   Total Errors: ${report.summary.totalErrors}`);
  console.log(`   Total Warnings: ${report.summary.totalWarnings}`);
  console.log(`   Total Issues: ${report.summary.totalIssues}\n`);

  // Errors
  if (report.errors.length > 0) {
    console.log('ERRORS');
    report.errors.forEach(error => {
      console.log(`   ${error.file}::${error.method}: ${error.message}`);
    });
    console.log();
  }

  // Warnings
  if (report.warnings.length > 0) {
    console.log('WARNINGS');
    report.warnings.forEach(warning => {
      console.log(`   ${warning.file}::${warning.method}: ${warning.message}`);
    });
    console.log();
  }

  // Recommendations
  console.log('RECOMMENDATIONS');
  if (report.summary.totalErrors === 0 && report.summary.totalWarnings === 0) {
    console.log('   All documentation is properly formatted!');
  } else {
    console.log('   Fix errors and warnings to improve documentation quality');
    console.log('   Add missing @param, @returns, @throws, and @example tags');
    console.log(
      '   Include descriptive parameter and return value documentation'
    );
  }

  return report.summary.totalErrors === 0;
}

/**
 * Main validation function
 */
function main() {
  console.log('Starting documentation validation...\n');

  const results = new ValidationResults();

  console.log(`Services directory: ${SERVICES_DIR}`);
  console.log(`Directory exists: ${fs.existsSync(SERVICES_DIR)}`);

  // Read services directory
  if (!fs.existsSync(SERVICES_DIR)) {
    console.error(`Services directory not found: ${SERVICES_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(SERVICES_DIR)
    .filter(file => file.endsWith('.js'))
    .map(file => path.join(SERVICES_DIR, file));

  // Validate each file
  files.forEach(file => validateServiceFile(file, results));

  // Generate and display report
  const isValid = generateReport(results);

  // Exit with appropriate code
  process.exit(isValid ? 0 : 1);
}

// Run validation only when executed directly (cross-platform)
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  main();
}

export { ValidationResults, validateServiceFile, generateReport };
