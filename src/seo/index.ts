/**
 * SEO metadata extraction module for WordPress Block to HTML Converter
 * This module provides tools for extracting SEO-relevant metadata from WordPress blocks.
 */

export { extractMetadata } from './metadata-extractor';
export type { SEOMetadata } from './metadata-extractor';

// Re-export specific analyzers for targeted use cases
export { default as generateSEOHead } from './head-generator';
