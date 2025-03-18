// Import media block handlers
import {
  imageBlockHandler,
  galleryBlockHandler,
  audioBlockHandler,
  videoBlockHandler,
  fileBlockHandler,
  coverBlockHandler,
  mediaTextBlockHandler,
  embedBlockHandler,
} from '../../block-handlers';

// Export media block handlers
export {
  imageBlockHandler,
  galleryBlockHandler,
  audioBlockHandler,
  videoBlockHandler,
  fileBlockHandler,
  coverBlockHandler,
  mediaTextBlockHandler,
  embedBlockHandler,
};

// Import registry functions
import { registerBlockHandler } from '../../core/registry';

// Function to register only media blocks
export function registerMediaBlockHandlers(): void {
  registerBlockHandler('core/image', imageBlockHandler);
  registerBlockHandler('core/gallery', galleryBlockHandler);
  registerBlockHandler('core/audio', audioBlockHandler);
  registerBlockHandler('core/video', videoBlockHandler);
  registerBlockHandler('core/file', fileBlockHandler);
  registerBlockHandler('core/cover', coverBlockHandler);
  registerBlockHandler('core/media-text', mediaTextBlockHandler);
  registerBlockHandler('core/embed', embedBlockHandler);
}

// Export core types and functions for usage
export type { Block, BlockList, BlockHandler, ConversionOptions } from '../../types';
export { convertBlocks } from '../../core/converter';
