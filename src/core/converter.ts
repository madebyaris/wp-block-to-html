import {
  Block,
  BlockList,
  ConversionOptions,
  DEFAULT_OPTIONS,
  BlockHandlerRegistry,
} from '../types';
import { getBlockHandler } from './registry';
import { mergeOptions } from './utils';

/**
 * Convert WordPress blocks to the specified format
 * @param blockData WordPress block data (typically from the_content or REST API)
 * @param customOptions Conversion configuration options
 * @returns Converted output as string (HTML) or other format based on options
 */
export function convertBlocks(
  blockData: BlockList | Block[],
  customOptions: ConversionOptions = {},
): string | unknown {
  const options = mergeOptions(DEFAULT_OPTIONS, customOptions);
  
  // Normalize input format
  let blocks: Block[];
  if (Array.isArray(blockData)) {
    blocks = blockData;
  } else if ('blocks' in blockData) {
    blocks = blockData.blocks;
  } else {
    blocks = [blockData as Block];
  }
  
  // Process each block
  if (options.outputFormat === 'html' || options.outputFormat === undefined) {
    // HTML output - concatenate strings
    return blocks.map((block: Block) => convertBlock(block, options)).join('');
  } else {
    // Component output - return array of components or objects
    return blocks.map((block: Block) => convertBlock(block, options));
  }
}

/**
 * Convert a single WordPress block
 * @param block WordPress block data
 * @param options Conversion configuration options
 * @returns Converted output for this block
 */
export function convertBlock(block: Block, options: ConversionOptions): string | unknown {
  if (!block.blockName) {
    // Handle raw HTML or undefined blocks
    return block.innerContent.join('') || '';
  }
  
  // Check for custom transformer first
  const customTransformer = options.blockTransformers?.[block.blockName];
  if (customTransformer) {
    return customTransformer.transform(block, options);
  }
  
  // Fall back to built-in handler
  const handler = getBlockHandler(block.blockName);
  if (handler) {
    return handler.transform(block, options);
  }
  
  // If no handler is available, return original content
  return block.innerContent.join('') || '';
}

/**
 * Convert blocks with handling for specific output formats
 * This is the main entry point that determines which converter to use
 */
export function convertBlocksWithFormat(
  blockData: BlockList | Block[],
  options: ConversionOptions = {},
): string | unknown {
  const mergedOptions = mergeOptions(DEFAULT_OPTIONS, options);
  
  // For HTML output, use the standard converter
  if (!mergedOptions.outputFormat || mergedOptions.outputFormat === 'html') {
    return convertBlocks(blockData, mergedOptions);
  }
  
  // For framework-specific outputs, delegate to the appropriate adapter
  // These will be lazy-loaded to avoid unnecessary dependencies
  switch (mergedOptions.outputFormat) {
    case 'react':
      // This would be implemented in framework-adapters/react.ts
      throw new Error('React output format not yet implemented');
      
    case 'vue':
      // This would be implemented in framework-adapters/vue.ts
      throw new Error('Vue output format not yet implemented');
      
    case 'angular':
      // This would be implemented in framework-adapters/angular.ts
      throw new Error('Angular output format not yet implemented');
      
    case 'svelte':
      // This would be implemented in framework-adapters/svelte.ts
      throw new Error('Svelte output format not yet implemented');
      
    default:
      // For unknown formats, fall back to HTML
      return convertBlocks(blockData, { ...mergedOptions, outputFormat: 'html' });
  }
} 