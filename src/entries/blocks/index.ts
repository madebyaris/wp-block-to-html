// Import category registration functions
import { registerTextBlockHandlers } from './text';
import { registerMediaBlockHandlers } from './media';
import { registerLayoutBlockHandlers } from './layout';
import { registerWidgetBlockHandlers } from './widget';
import { registerDynamicBlockHandlers } from './dynamic';

// Export individual category registration functions
export {
  registerTextBlockHandlers,
  registerMediaBlockHandlers,
  registerLayoutBlockHandlers,
  registerWidgetBlockHandlers,
  registerDynamicBlockHandlers,
};

/**
 * Register all available block handlers
 * This function registers handlers for all block categories
 */
export function registerAllBlockHandlers(): void {
  // Register text blocks
  registerTextBlockHandlers();

  // Register media blocks
  registerMediaBlockHandlers();

  // Register layout blocks
  registerLayoutBlockHandlers();

  // Register widget blocks
  registerWidgetBlockHandlers();

  // Register dynamic blocks
  registerDynamicBlockHandlers();
}

// Export block handlers from all categories
export * from './text';
export * from './media';
export * from './layout';
export * from './widget';
export * from './dynamic';

// Export core types and functions for usage
export type { Block, BlockList, BlockHandler, ConversionOptions } from '../../types';
export { convertBlocks } from '../../core/converter';
