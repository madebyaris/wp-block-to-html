import { Block, BlockList, ConversionOptions } from '../types';
import { convertBlocks as coreConvertBlocks } from '../core/converter';
import { mergeOptions } from '../core/utils';

/**
 * Convert WordPress blocks to Svelte-compatible format
 * This function generates an HTML string for use with {@html } syntax
 *
 * @param blockData WordPress block data
 * @param options Conversion options
 * @returns HTML string for use with Svelte
 */
export function convertBlocksToSvelte(
  blockData: BlockList | Block[],
  options: ConversionOptions = {},
): string {
  // Set output format to HTML since we're generating a string
  const svelteOptions = mergeOptions(options, { outputFormat: 'html' });

  // Use the standard converter which will return HTML string
  return coreConvertBlocks(blockData, svelteOptions) as string;
}

/**
 * Create Svelte component code for WordPress blocks
 * This function generates a string representation of a Svelte component
 *
 * @returns Svelte component code as string
 */
export function createSvelteComponentCode() {
  // This implementation is intentionally abstract to avoid direct
  // Svelte dependency in the main package

  // In a real implementation, this would return a string with Svelte component code
  // that could be used with the Svelte compiler

  // Example implementation that consumer would use:
  // return `
  //   <script>
  //     import { convertBlocksToSvelte } from 'wp-block-to-html/svelte';
  //
  //     export let blocks;
  //     export let options = {};
  //     export let className = '';
  //
  //     $: htmlContent = convertBlocksToSvelte(blocks, options);
  //   </script>
  //
  //   <div class={className}>
  //     {@html htmlContent}
  //   </div>
  // `;

  throw new Error(
    'createSvelteComponentCode() requires Svelte to be available. ' +
      'Please use this function in a Svelte environment.',
  );
}

/**
 * Create a Svelte store for WordPress blocks
 * This function creates a store that can be used in Svelte components
 *
 * @returns Svelte store factory
 */
export function createSvelteStore() {
  // This implementation is intentionally abstract to avoid direct
  // Svelte dependency in the main package

  // In a real implementation, this would:
  // 1. Import Svelte's writable store
  // 2. Create a store with methods to update and access block data

  // Example implementation:
  // import { writable } from 'svelte/store';
  //
  // export function createBlocksStore(initialBlocks = []) {
  //   const { subscribe, set, update } = writable(initialBlocks);
  //
  //   return {
  //     subscribe,
  //     set,
  //     update,
  //     convertToHTML: (options = {}) => {
  //       let blocks;
  //       subscribe(value => { blocks = value })();
  //       return convertBlocksToSvelte(blocks, options);
  //     }
  //   };
  // }

  throw new Error(
    'createSvelteStore() requires Svelte to be available. ' +
      'Please use this function in a Svelte environment.',
  );
}
