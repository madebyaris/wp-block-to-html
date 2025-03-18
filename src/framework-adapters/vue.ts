import { Block, BlockList, ConversionOptions } from '../types';
import { convertBlocks as coreConvertBlocks } from '../core/converter';
import { mergeOptions } from '../core/utils';

/**
 * Convert WordPress blocks to Vue-compatible format
 * This function generates an HTML string for use with v-html directive
 *
 * @param blockData WordPress block data
 * @param options Conversion options
 * @returns HTML string for use with Vue
 */
export function convertBlocksToVue(
  blockData: BlockList | Block[],
  options: ConversionOptions = {},
): string {
  // Set output format to HTML since we're generating a string
  const vueOptions = mergeOptions(options, { outputFormat: 'html' });

  // Use the standard converter which will return HTML string
  return coreConvertBlocks(blockData, vueOptions) as string;
}

/**
 * Generate a Vue component definition object for WordPress blocks
 * This is a factory function that returns a Vue component options object
 *
 * @returns Vue component options object
 */
export function createVueComponentOptions() {
  // This implementation is intentionally abstract to avoid direct
  // Vue dependency in the main package

  // In a real implementation, this would return a Vue component options object
  // that could be used with Vue.component or in a Vue SFC

  // Example implementation that consumer would use:
  // return {
  //   props: {
  //     blocks: { type: Array, required: true },
  //     options: { type: Object, default: () => ({}) },
  //     className: { type: String }
  //   },
  //   computed: {
  //     htmlContent() {
  //       return convertBlocksToVue(this.blocks, this.options);
  //     }
  //   },
  //   template: '<div :class="className" v-html="htmlContent"></div>'
  // };

  throw new Error(
    'createVueComponentOptions() requires Vue to be available. ' +
      'Please use this function in a Vue environment.',
  );
}

/**
 * Get Vue 3 composition API compatible function
 * This function is meant to be used in Vue 3 components with the composition API
 *
 * @returns Function that can be used in Vue 3 composition API
 */
export function useWordPressBlocks() {
  // This implementation is intentionally abstract to avoid direct
  // Vue dependency in the main package

  // In a real implementation with Vue 3, this would:
  // 1. Use Vue's ref/reactive functions
  // 2. Return methods to convert and render blocks

  // Example implementation:
  // return {
  //   renderBlocks: (blocks, options) => {
  //     return convertBlocksToVue(blocks, options);
  //   }
  // };

  throw new Error(
    'useWordPressBlocks() requires Vue 3 to be available. ' +
      'Please use this function in a Vue 3 environment.',
  );
}
