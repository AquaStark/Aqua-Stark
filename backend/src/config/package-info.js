/**
 * Central package information configuration
 * 
 * This file contains version, date, and author information that can be
 * imported and used across all service files to maintain consistency.
 * 
 * @fileoverview Central package configuration
 */

/**
 * Central package information configuration
 * 
 * Update these values to change version, date, and author information
 * across all service files. Then run: npm run metadata:update
 */
export const PACKAGE_INFO = {
  /** Package version */
  version: '1.0.0',
  
  /** Initial release date */
  since: '2025-09-16',
  
  /** Author information */
  author: 'Aqua Stark Team',
  
  /** Package description */
  description: 'Aqua Stark Backend Services',
  
  /** License information */
  license: 'MIT',
  
  /** Current year for copyright */
  year: '2025'
};

/**
 * Get JSDoc metadata object for services
 * @returns {Object} JSDoc metadata
 */
export function getJSDocMetadata() {
  return {
    version: PACKAGE_INFO.version,
    since: PACKAGE_INFO.since,
    author: PACKAGE_INFO.author
  };
}

/**
 * Get formatted JSDoc tags as string
 * @returns {string} Formatted JSDoc tags
 */
export function getJSDocTags() {
  const meta = getJSDocMetadata();
  return ` * @version ${meta.version}\n * @author ${meta.author}\n * @since ${meta.since}`;
}
