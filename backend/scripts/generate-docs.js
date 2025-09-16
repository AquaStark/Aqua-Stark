#!/usr/bin/env node

/**
 * Automatic Documentation Generation Script
 *
 * This script generates comprehensive documentation from JSDoc comments
 * in service files, creating markdown files and API documentation.
 *
 * @fileoverview Automatic documentation generation
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
const DOCS_DIR = path.join(__dirname, '../docs');
const OUTPUT_DIR = path.join(DOCS_DIR, 'services');

/**
 * Documentation Generator Class
 */
class DocumentationGenerator {
  constructor() {
    this.services = new Map();
    this.classes = new Map();
  }

  /**
   * Parse JSDoc comment
   */
  parseJSDocComment(comment) {
    const lines = comment.split('\n').map(line => line.trim());
    const parsed = { description: '', tags: new Map() };

    let currentTag = null;
    let currentContent = [];

    for (const line of lines) {
      if (
        line.startsWith('/**') ||
        line.startsWith('*') ||
        line.startsWith('*/')
      ) {
        continue;
      }

      const trimmedLine = line.replace(/^\*\s?/, '');

      if (trimmedLine.startsWith('@')) {
        // Save previous tag content
        if (currentTag && currentContent.length > 0) {
          const val = currentContent.join('\n').trim();
          const existing = parsed.tags.get(currentTag);
          parsed.tags.set(
            currentTag,
            existing
              ? Array.isArray(existing)
                ? [...existing, val]
                : [existing, val]
              : [val]
          );
          currentContent = [];
        }
        // Parse new tag
        const tagMatch = trimmedLine.match(/^@(\w+)(?:\s+(.*))?$/);
        if (tagMatch) {
          const raw = tagMatch[1];
          currentTag = raw === 'return' ? 'returns' : raw; // normalize
          if (tagMatch[2]) {
            currentContent.push(tagMatch[2]);
          }
        }
      } else if (currentTag) {
        currentContent.push(trimmedLine);
      } else if (!currentTag && trimmedLine) {
        parsed.description += (parsed.description ? '\n' : '') + trimmedLine;
      }
    }

    // Save last tag content
    if (currentTag && currentContent.length > 0) {
      const val = currentContent.join('\n').trim();
      const existing = parsed.tags.get(currentTag);
      parsed.tags.set(
        currentTag,
        existing
          ? Array.isArray(existing)
            ? [...existing, val]
            : [existing, val]
          : [val]
      );
    }

    return parsed;
  }

  /**
   * Extract methods from file content
   */
  extractMethods(content) {
    const methodRegex =
      /static\s+async\s+(\w+)\s*\([^)]*\)\s*{|static\s+(\w+)\s*\([^)]*\)\s*{/g;
    const methods = [];
    let match;

    while ((match = methodRegex.exec(content)) !== null) {
      const methodName = match[1] || match[2];
      methods.push({
        name: methodName,
        start: match.index,
        end: match.index + match[0].length,
      });
    }

    return methods;
  }

  /**
   * Extract JSDoc comments from file content
   */
  extractJSDocComments(content) {
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
   * Process a service file
   */
  processServiceFile(filePath) {
    const fileName = path.basename(filePath, '.js');
    const content = fs.readFileSync(filePath, 'utf8');

    const methods = this.extractMethods(content);
    const jsdocComments = this.extractJSDocComments(content);

    const classMatch = content.match(/export\s+class\s+(\w+)/);
    const className = classMatch ? classMatch[1] : fileName;
    const serviceInfo = {
      fileName,
      className,
      methods: new Map(),
      classDoc: null,
    };

    // Find class documentation
    const classComment = jsdocComments.find(c => c.content.includes('@class'));
    if (classComment) {
      serviceInfo.classDoc = this.parseJSDocComment(classComment.content);
    }

    // Process methods
    methods.forEach(method => {
      const comment = jsdocComments.find(
        c => c.end < method.start && method.start - c.end < 50
      );

      if (comment) {
        const parsedDoc = this.parseJSDocComment(comment.content);
        serviceInfo.methods.set(method.name, {
          ...method,
          documentation: parsedDoc,
        });
      } else {
        serviceInfo.methods.set(method.name, {
          ...method,
          documentation: null,
        });
      }
    });

    this.services.set(fileName, serviceInfo);
  }

  /**
   * Generate markdown documentation for a service
   */
  generateServiceMarkdown(serviceName, serviceInfo) {
    const { classDoc, methods } = serviceInfo;

    let markdown = `# ${serviceName}\n\n`;

    // Class description
    if (classDoc) {
      markdown += `${classDoc.description}\n\n`;

      if (classDoc.tags.has('author')) {
        markdown += `**Author:** ${classDoc.tags.get('author')}\n\n`;
      }
      if (classDoc.tags.has('version')) {
        markdown += `**Version:** ${classDoc.tags.get('version')}\n\n`;
      }
      if (classDoc.tags.has('since')) {
        markdown += `**Since:** ${classDoc.tags.get('since')}\n\n`;
      }
    }

    // Methods documentation
    if (methods.size > 0) {
      markdown += '## Methods\n\n';

      for (const [methodName, methodInfo] of methods) {
        markdown += `### ${methodName}\n\n`;

        if (methodInfo.documentation) {
          const doc = methodInfo.documentation;

          if (doc.description) {
            markdown += `${doc.description}\n\n`;
          }

          // Parameters
          if (doc.tags.has('param')) {
            markdown += '**Parameters:**\n';
            const paramContent = doc.tags.get('param');
            const params = paramContent.split('\n').filter(p => p.trim());
            params.forEach(param => {
              const paramMatch = param.match(
                /^\{([^}]+)\}\s+(\w+)(?:\s+(.*))?$/
              );
              if (paramMatch) {
                const [, type, name, description] = paramMatch;
                markdown += `- \`${name}\` (${type})${description ? ` - ${description}` : ''}\n`;
              }
            });
            markdown += '\n';
          }

          // Return value
          if (doc.tags.has('returns')) {
            const returns = doc.tags.get('returns');
            markdown += `**Returns:** ${returns}\n\n`;
          }

          // Throws
          if (doc.tags.has('throws')) {
            markdown += `**Throws:** ${doc.tags.get('throws')}\n\n`;
          }

          // Example
          if (doc.tags.has('example')) {
            markdown += '**Example:**\n';
            const examples = doc.tags.get('example');
            const exampleArray = Array.isArray(examples)
              ? examples
              : [examples];
            exampleArray.forEach(example => {
              const sanitized = String(example)
                .replace(/```javascript\n?/g, '')
                .replace(/```/g, '');
              markdown += `\`\`\`javascript\n${sanitized}\n\`\`\`\n\n`;
            });
          }
        } else {
          markdown += '*No documentation available*\n\n';
        }
      }
    }

    return markdown;
  }

  /**
   * Generate API overview
   */
  generateAPIOverview() {
    let markdown = '# Aqua Stark Backend Services API\n\n';
    markdown +=
      'This document provides comprehensive API documentation for all backend services.\n\n';

    markdown += '## Overview\n\n';
    markdown += `The Aqua Stark backend consists of ${this.services.size} main service classes:\n\n`;

    for (const [serviceName, serviceInfo] of this.services) {
      const { classDoc } = serviceInfo;
      markdown += `### ${serviceName}\n`;

      if (classDoc && classDoc.description) {
        markdown += `${classDoc.description}\n\n`;
      }

      markdown += `**Methods:** ${serviceInfo.methods.size}\n\n`;
    }

    markdown += '## Service Details\n\n';
    for (const [serviceName, serviceInfo] of this.services) {
      markdown += `- [${serviceName}](./${serviceName}.md)\n`;
    }

    return markdown;
  }

  /**
   * Generate usage examples
   */
  generateUsageExamples() {
    let markdown = '# Service Usage Examples\n\n';
    markdown +=
      'This document provides practical examples of how to use each service.\n\n';

    for (const [serviceName, serviceInfo] of this.services) {
      markdown += `## ${serviceName}\n\n`;

      const { classDoc, methods } = serviceInfo;
      if (classDoc && classDoc.tags.has('example')) {
        markdown += '### Basic Usage\n\n';
        markdown += '```javascript\n';
        markdown += `import { ${serviceInfo.className} } from './services/index.js';\n\n`;
        const example = classDoc.tags.get('example');
        const exampleText = Array.isArray(example) ? example[0] : example;
        markdown += `${exampleText
          .replace(/```javascript\n?/g, '')
          .replace(/```/g, '')}\n`;
        markdown += '```\n\n';
      }

      // Method examples
      let hasMethodExamples = false;
      for (const [methodName, methodInfo] of methods) {
        if (
          methodInfo.documentation &&
          methodInfo.documentation.tags.has('example')
        ) {
          if (!hasMethodExamples) {
            markdown += '### Method Examples\n\n';
            hasMethodExamples = true;
          }

          markdown += `#### ${methodName}\n\n`;
          const ex = methodInfo.documentation.tags.get('example');
          const vals = Array.isArray(ex) ? ex : [ex];
          vals.forEach(v => {
            markdown += '```javascript\n';
            markdown += `${v.replace(/```javascript\n?/g, '').replace(/```/g, '')}\n`;
            markdown += '```\n\n';
          });
        }
      }
    }

    return markdown;
  }

  /**
   * Generate all documentation
   */
  generateAll() {
    console.log('Generating documentation...\n');

    // Create output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Process all service files
    const files = fs
      .readdirSync(SERVICES_DIR)
      .filter(file => file.endsWith('.js') && file !== 'index.js')
      .map(file => path.join(SERVICES_DIR, file));

    files.forEach(file => this.processServiceFile(file));

    // Generate individual service documentation
    for (const [serviceName, serviceInfo] of this.services) {
      const markdown = this.generateServiceMarkdown(serviceName, serviceInfo);
      const outputFile = path.join(OUTPUT_DIR, `${serviceName}.md`);
      fs.writeFileSync(outputFile, markdown);
      console.log(`Generated ${serviceName}.md`);
    }

    // Generate API overview
    const apiOverview = this.generateAPIOverview();
    fs.writeFileSync(path.join(OUTPUT_DIR, 'README.md'), apiOverview);
    console.log('Generated README.md');

    // Generate usage examples
    const usageExamples = this.generateUsageExamples();
    fs.writeFileSync(path.join(OUTPUT_DIR, 'usage-examples.md'), usageExamples);
    console.log('Generated usage-examples.md');

    console.log('\nDocumentation generated successfully!');
    console.log(`Output directory: ${OUTPUT_DIR}`);
    console.log(`Generated ${this.services.size + 2} documentation files`);
  }
}

/**
 * Main function
 */
function main() {
  console.log('Starting documentation generation...\n');

  const generator = new DocumentationGenerator();
  generator.generateAll();
}

// Run if called directly (cross-platform)
if (
  process.argv[1] &&
  pathToFileURL(process.argv[1]).href === import.meta.url
) {
  main();
}

export { DocumentationGenerator };
