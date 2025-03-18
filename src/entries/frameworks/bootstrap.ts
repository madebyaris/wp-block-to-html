// Export only Bootstrap CSS framework mapping
export { bootstrapMapping } from '../../css-frameworks';

// Export core types and functions for usage
export type { Block, BlockList, BlockHandler, ConversionOptions } from '../../types';
export { convertBlocks } from '../../core/converter';
export { registerBlockHandler } from '../../core/registry';
export { createElement, getBlockClasses } from '../../core/utils';
