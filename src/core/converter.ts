import { Block, BlockList, ConversionOptions, DEFAULT_OPTIONS } from '../types';
import { getBlockHandler } from './registry';
import { mergeOptions, enhanceRenderedHTML } from './utils';

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

  // Handle rendered content directly if rendered mode is specified and we have rendered HTML
  if (
    options.contentHandling === 'rendered' &&
    'rendered' in blockData &&
    typeof blockData.rendered === 'string'
  ) {
    return blockData.rendered;
  }

  // Handle hybrid mode for rendered content
  if (
    options.contentHandling === 'hybrid' &&
    'rendered' in blockData &&
    typeof blockData.rendered === 'string'
  ) {
    return enhanceRenderedHTML(blockData.rendered, options);
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
 * Map deprecated renderedContentHandling values to new contentHandling values
 * @param options The conversion options
 * @returns Updated rendering mode compatible with block handlers
 */
function getCompatibleRenderingMode(
  options: ConversionOptions,
): 'respect' | 'rebuild' | 'preserve-attrs' {
  // If new contentHandling is specified, map it to old values
  if (options.contentHandling) {
    switch (options.contentHandling) {
      case 'rendered':
        return 'respect';
      case 'hybrid':
        return 'preserve-attrs';
      case 'raw':
      default:
        return 'rebuild';
    }
  }

  // Fall back to the old option if provided
  return options.renderedContentHandling || 'rebuild';
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

  // Map contentHandling to renderedContentHandling for backward compatibility
  const updatedOptions = {
    ...options,
    renderedContentHandling: getCompatibleRenderingMode(options),
  };

  // Check for custom transformer first
  const customTransformer = updatedOptions.blockTransformers?.[block.blockName];
  if (customTransformer) {
    return customTransformer.transform(block, updatedOptions);
  }

  // Fall back to built-in handler
  const handler = getBlockHandler(block.blockName);
  if (handler) {
    return handler.transform(block, updatedOptions);
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
      try {
        // Dynamic import to avoid dependency on react adapter
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { convertBlocksToReact } = require('../framework-adapters/react');
        return convertBlocksToReact(blockData, mergedOptions);
      } catch (error) {
        console.error('Error using React adapter:', error);
        throw new Error('React adapter could not be loaded. Make sure the adapter is available.');
      }

    case 'vue':
      try {
        // Dynamic import to avoid dependency on vue adapter
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { convertBlocksToVue } = require('../framework-adapters/vue');
        return convertBlocksToVue(blockData, mergedOptions);
      } catch (error) {
        console.error('Error using Vue adapter:', error);
        throw new Error('Vue adapter could not be loaded. Make sure the adapter is available.');
      }

    case 'angular':
      try {
        // Dynamic import to avoid dependency on angular adapter
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { convertBlocksToAngular } = require('../framework-adapters/angular');
        return convertBlocksToAngular(blockData, mergedOptions);
      } catch (error) {
        console.error('Error using Angular adapter:', error);
        throw new Error('Angular adapter could not be loaded. Make sure the adapter is available.');
      }

    case 'svelte':
      try {
        // Dynamic import to avoid dependency on svelte adapter
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { convertBlocksToSvelte } = require('../framework-adapters/svelte');
        return convertBlocksToSvelte(blockData, mergedOptions);
      } catch (error) {
        console.error('Error using Svelte adapter:', error);
        throw new Error('Svelte adapter could not be loaded. Make sure the adapter is available.');
      }

    default:
      // For unknown formats, fall back to HTML
      return convertBlocks(blockData, { ...mergedOptions, outputFormat: 'html' });
  }
}
