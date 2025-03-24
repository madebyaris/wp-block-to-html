// Export types
export * from './types';

// Export core functionality
export * from './entries/core';

// Export registry functions
export { registerBlockHandler, getBlockHandler } from './core/registry';

// Export CSS framework mappings
export { tailwindMapping, bootstrapMapping } from './css-frameworks';

// Export block handlers by category
export * from './entries/blocks';

// Export framework adapters
export * from './entries/react';
export * from './entries/vue';
export * from './entries/angular';
export * from './entries/svelte';

// Export SEO functionality
export * from './seo';

// Export streaming functionality for large content
export * from './streaming';

// Export incremental rendering functionality
export * from './core/incremental';

// Export framework adapter types
export type { Block, BlockList, BlockHandler, ConversionOptions } from './types';
export type { ReactWordPressBlocksProps } from './framework-adapters';

// Register all block handlers by default when importing the main package
// This preserves backward compatibility with existing code
import { registerAllBlockHandlers } from './entries/blocks';

// Register all block handlers
registerAllBlockHandlers();

// Re-export everything from the entries module
export * from './entries';

// Export additional SSR functionality
export { processBlocksForSSR, DEFAULT_SSR_OPTIONS } from './ssr';

// Additional exports not included in entries
export { BlockTransformStream } from './streaming/stream-converter';

// Additional type exports
export type {
  StreamingOptions,
  SSROptions,
  IncrementalOptions,
  CustomClassMap,
  CSSClassMapping,
  BlockTransformer,
  BlockHandlerRegistry,
} from './types';

// Core functionality exports
export { convertBlocks } from './core/converter';
