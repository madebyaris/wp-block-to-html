// Import and export Vue-specific adapters
export {
  convertBlocksToVue,
  createVueComponentOptions,
  useWordPressBlocks,
} from '../framework-adapters/vue';

// Export core types and functions for usage with Vue
export type { Block, BlockList, BlockHandler, ConversionOptions } from '../types';
export { convertBlocks } from '../core/converter';
export { registerBlockHandler } from '../core/registry';
