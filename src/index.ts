// Export types
export * from './types';

// Export core functionality
export * from './entries/core';

// Export registry functions
export { registerBlockHandler, getBlockHandler } from './core/registry';

// Export CSS framework mappings
export { tailwindMapping, bootstrapMapping } from './css-frameworks';

// Export block handlers by category
export * from './entries/blocks/text';
export * from './entries/blocks/media';
export * from './entries/blocks/layout';
export * from './entries/blocks/widget';
export * from './entries/blocks/dynamic';

// Export framework adapters
export * from './entries/react';
export * from './entries/vue';

// Export framework adapter types
export type { Block, BlockList, BlockHandler, ConversionOptions } from './types';
export type { ReactWordPressBlocksProps } from './framework-adapters';

// Register all block handlers by default when importing the main package
// This preserves backward compatibility with existing code
import { registerTextBlockHandlers } from './entries/blocks/text';
import { registerMediaBlockHandlers } from './entries/blocks/media';
import { registerLayoutBlockHandlers } from './entries/blocks/layout';
import { registerWidgetBlockHandlers } from './entries/blocks/widget';
import { registerDynamicBlockHandlers } from './entries/blocks/dynamic';

registerTextBlockHandlers();
registerMediaBlockHandlers();
registerLayoutBlockHandlers();
registerWidgetBlockHandlers();
registerDynamicBlockHandlers();
