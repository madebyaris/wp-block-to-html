// Export core functionality
export { convertBlocks } from '../core/converter';
export {
  registerBlockHandler,
  getBlockHandler,
  hasBlockHandler,
  getAllBlockHandlers,
  removeBlockHandler,
} from '../core/registry';
export { processPaginatedContent } from '../block-handlers/page-break';

// Export types
export type {
  Block,
  BlockList,
  BlockHandler,
  ConversionOptions,
  CSSFramework,
  OutputFormat,
} from '../types';

// Export framework-specific adapters
export * from './react';
export * from './vue';
export * from './angular';
export * from './svelte';

// Export block categories
export * from './blocks';

// Export SEO functionality
export * from './seo';
