// Export types
export * from './types';

// Export core functionality
export { convertBlocks } from './core/converter';

// Export registry functions
export { registerBlockHandler, getBlockHandler } from './core/registry';

// Export CSS framework mappings
export { tailwindMapping, bootstrapMapping } from './css-frameworks';

// Export block handlers
export {
  paragraphBlockHandler,
  headingBlockHandler,
  listBlockHandler,
  imageBlockHandler,
  quoteBlockHandler,
  codeBlockHandler,
  preformattedBlockHandler,
  tableBlockHandler,
  buttonBlockHandler,
  separatorBlockHandler,
  spacerBlockHandler,
  groupBlockHandler,
  columnsBlockHandler,
  columnBlockHandler,
  embedBlockHandler,
  galleryBlockHandler,
  detailsBlockHandler,
  pullquoteBlockHandler,
  verseBlockHandler,
  classicBlockHandler,
  audioBlockHandler,
  videoBlockHandler,
  fileBlockHandler,
  coverBlockHandler,
  mediaTextBlockHandler,
  rowBlockHandler,
  stackBlockHandler,
  gridBlockHandler,
  pageBreakBlockHandler,
  moreBlockHandler,
  shortcodeBlockHandler,
  customHtmlBlockHandler,
  latestPostsBlockHandler
} from './block-handlers';

// Export utility functions
export { createElement, getBlockClasses, mergeOptions } from './core/utils';

// Export framework adapters
export {
  // React
  convertBlocksToReact,
  createReactComponent,
  // Vue
  convertBlocksToVue,
  createVueComponentOptions,
  useWordPressBlocks
} from './framework-adapters';

// Export framework adapter types
export type { Block, BlockList, BlockHandler, ConversionOptions } from './types';
export type { ReactWordPressBlocksProps } from './framework-adapters';

// Register built-in block handlers
import { registerBuiltInBlockHandlers } from './block-handlers';
registerBuiltInBlockHandlers(); 