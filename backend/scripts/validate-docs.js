#!/usr/bin/env node

/**
 * Documentation Validation Script
 *
 * Validates JSDoc comments in controller files to ensure:
 * - All exported classes have class-level JSDoc
 * - All static methods have method-level JSDoc
 * - Required JSDoc tags are present (@param, @returns, etc.)
 * - Examples are provided for complex methods
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTROLLERS_DIR = path.join(__dirname, '..', 'src', 'controllers');
const CONTROLLER_FILES = [
  'playerController.js',
  'fishController.js',
  'decorationController.js',
  'minigameController.js'
];

class DocValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Validate all controller files
   */
  async validateAll() {
    console.log('🔍 Validating JSDoc documentation...\n');

    for (const file of CONTROLLER_FILES) {
      const filePath = path.join(CONTROLLERS_DIR, file);
      await this.validateFile(filePath);
    }

    this.printResults();
    return this.errors.length === 0;
  }

  /**
   * Validate a single file
   */
  async validateFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath);

    console.log(`📄 Validating ${fileName}...`);

    // Check for class-level JSDoc
    this.validateClassDoc(content, fileName);

    // Check for method-level JSDoc
    this.validateMethodDocs(content, fileName);

    // Check for consistent patterns
    this.validatePatterns(content, fileName);
  }

  /**
   * Validate class-level documentation
   */
  validateClassDoc(content, fileName) {
    const classMatch = content.match(/export class (\w+)Controller/);
    if (!classMatch) {
      this.errors.push(`${fileName}: Could not find exported controller class`);
      return;
    }

    const className = classMatch[1] + 'Controller';
    // Look for JSDoc comment before the class declaration
    const classDocPattern = /\/\*\*\s*\n(?:\s*\*\s*[^*]*\n)*\s*\*\//g;
    const classDocMatches = content.match(classDocPattern);

    if (!classDocMatches || classDocMatches.length === 0) {
      this.errors.push(`${fileName}: Missing class-level JSDoc for ${className}`);
      return;
    }

    // Check if any JSDoc comment contains the class name
    const hasClassDoc = classDocMatches.some(doc => doc.includes(className));
    if (!hasClassDoc) {
      this.errors.push(`${fileName}: Missing or incorrect class-level JSDoc for ${className}`);
    }

    // Check for @class tag
    const classTagPattern = /@class\s+\w+Controller/;
    if (!classTagPattern.test(content)) {
      this.warnings.push(`${fileName}: Missing @class tag in class documentation`);
    }
  }

  /**
   * Validate method-level documentation
   */
  validateMethodDocs(content, fileName) {
    const methodMatches = content.matchAll(/static async (\w+)\([^)]*\)/g);
    const methods = Array.from(methodMatches, match => match[1]);

    for (const method of methods) {
      this.validateMethodDoc(content, method, fileName);
    }
  }

  /**
   * Validate individual method documentation
   */
  validateMethodDoc(content, methodName, fileName) {
    const methodPattern = new RegExp(`static async ${methodName}\\([^)]*\\)`, 'g');
    const methodMatch = methodPattern.exec(content);

    if (!methodMatch) return;

    const methodIndex = methodMatch.index;
    const beforeMethod = content.substring(0, methodIndex);

    // Look for JSDoc comment before the method - improved regex
    const jsdocPattern = /\/\*\*\s*\n(?:\s*\*\s*[^*]*\n)*\s*\*\//g;
    const jsdocMatches = [...beforeMethod.matchAll(jsdocPattern)];
    const lastJSDocMatch = jsdocMatches[jsdocMatches.length - 1];

    if (!lastJSDocMatch) {
      this.errors.push(`${fileName}: Missing JSDoc for method ${methodName}`);
      return;
    }

    const jsdoc = lastJSDocMatch[0];

    // Check for @static tag
    if (!jsdoc.includes('@static')) {
      this.warnings.push(`${fileName}: Missing @static tag for method ${methodName}`);
    }

    // Check for @async tag
    if (!jsdoc.includes('@async')) {
      this.warnings.push(`${fileName}: Missing @async tag for method ${methodName}`);
    }

    // Check for @param tags if method has parameters
    const methodSignature = content.substring(methodIndex, methodIndex + 200);
    const paramMatch = methodSignature.match(/static async \w+\(([^)]*)\)/);

    if (paramMatch && paramMatch[1].trim()) {
      const params = paramMatch[1].split(',').map(p => p.trim().split(' ')[0]).filter(p => p !== 'req' && p !== 'res');
      const paramTags = (jsdoc.match(/@param\s+\{[^}]+\}\s+\w+/g) || []).length;

      if (paramTags === 0) {
        this.errors.push(`${fileName}: Missing @param tags for method ${methodName}`);
      }
    }

    // Check for @returns tag
    if (!jsdoc.includes('@returns')) {
      this.errors.push(`${fileName}: Missing @returns tag for method ${methodName}`);
    }

    // Check for @example tag for complex methods
    const complexMethods = ['bulkUpdatePositions', 'getPlayerDashboard', 'createGameSession'];
    if (complexMethods.includes(methodName) && !jsdoc.includes('@example')) {
      this.warnings.push(`${fileName}: Missing @example for complex method ${methodName}`);
    }
  }

  /**
   * Validate consistent patterns
   */
  validatePatterns(content, fileName) {
    // Check for consistent error handling pattern
    const errorPatterns = content.match(/res\.status\(\d+\)\.json\(\{\s*error:/g);
    if (!errorPatterns || errorPatterns.length === 0) {
      this.warnings.push(`${fileName}: No standard error responses found`);
    }

    // Check for consistent success pattern
    const successPatterns = content.match(/res\.json\(\{\s*success:\s*true/g);
    if (!successPatterns || successPatterns.length === 0) {
      this.warnings.push(`${fileName}: No standard success responses found`);
    }
  }

  /**
   * Print validation results
   */
  printResults() {
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ All documentation validation passed!');
      return;
    }

    if (this.errors.length > 0) {
      console.log('\n❌ Documentation Errors:');
      this.errors.forEach(error => console.log(`  - ${error}`));
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️  Documentation Warnings:');
      this.warnings.forEach(warning => console.log(`  - ${warning}`));
    }

    console.log(`\n📊 Summary: ${this.errors.length} errors, ${this.warnings.length} warnings`);
  }
}

// Run validation
const validator = new DocValidator();
const isValid = await validator.validateAll();

if (!isValid) {
  console.log('\n💡 Fix the errors above and run validation again.');
  process.exit(1);
}
