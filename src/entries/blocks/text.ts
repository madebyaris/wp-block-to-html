// Import text block handlers
import {
  paragraphBlockHandler,
  headingBlockHandler,
  listBlockHandler,
  quoteBlockHandler,
  codeBlockHandler,
  preformattedBlockHandler,
  pullquoteBlockHandler,
  verseBlockHandler,
  classicBlockHandler,
  detailsBlockHandler,
  mathBlockHandler,
} from '../../block-handlers';

// Export text block handlers
export {
  paragraphBlockHandler,
  headingBlockHandler,
  listBlockHandler,
  quoteBlockHandler,
  codeBlockHandler,
  preformattedBlockHandler,
  pullquoteBlockHandler,
  verseBlockHandler,
  classicBlockHandler,
  detailsBlockHandler,
  mathBlockHandler,
};

// Import registry functions
import { registerBlockHandler } from '../../core/registry';

// Function to register only text blocks
export function registerTextBlockHandlers(): void {
  registerBlockHandler('core/paragraph', paragraphBlockHandler);
  registerBlockHandler('core/heading', headingBlockHandler);
  registerBlockHandler('core/list', listBlockHandler);
  registerBlockHandler('core/quote', quoteBlockHandler);
  registerBlockHandler('core/code', codeBlockHandler);
  registerBlockHandler('core/preformatted', preformattedBlockHandler);
  registerBlockHandler('core/pullquote', pullquoteBlockHandler);
  registerBlockHandler('core/verse', verseBlockHandler);
  registerBlockHandler('core/freeform', classicBlockHandler); // Classic editor
  registerBlockHandler('core/details', detailsBlockHandler);
  registerBlockHandler('core/math', mathBlockHandler);
}

// Export core types and functions for usage
export type { Block, BlockList, BlockHandler, ConversionOptions } from '../../types';
export { convertBlocks } from '../../core/converter';
