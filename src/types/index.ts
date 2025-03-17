/**
 * WordPress Block data structure
 */
export interface Block {
  blockName: string;
  attrs: Record<string, any>;
  innerBlocks: Block[];
  innerContent: string[];
  innerHTML?: string;
}

/**
 * WordPress Block list structure
 */
export interface BlockList {
  blocks: Block[];
}

/**
 * Output format options
 */
export type OutputFormat = 'html' | 'react' | 'vue' | 'angular' | 'svelte';

/**
 * CSS Framework options
 */
export type CSSFramework = 'none' | 'tailwind' | 'bootstrap' | 'custom';

/**
 * Block transformer interface
 */
export interface BlockTransformer {
  transform(block: Block, options: ConversionOptions): string | unknown;
}

/**
 * CSS Class mapping for a block
 */
export interface CSSClassMapping {
  block?: string;
  [key: string]: string | Record<string, string> | undefined;
}

/**
 * Custom class map for blocks
 */
export interface CustomClassMap {
  [blockName: string]: CSSClassMapping;
}

/**
 * Block handler interface
 */
export interface BlockHandler extends BlockTransformer {
  cssMapping?: {
    tailwind?: CSSClassMapping;
    bootstrap?: CSSClassMapping;
    [key: string]: CSSClassMapping | undefined;
  };
}

/**
 * Block handler registry
 */
export interface BlockHandlerRegistry {
  [blockName: string]: BlockHandler;
}

/**
 * Conversion options
 */
export interface ConversionOptions {
  outputFormat?: OutputFormat;
  cssFramework?: CSSFramework;
  customClassMap?: CustomClassMap;
  blockTransformers?: Record<string, BlockTransformer>;
}

/**
 * Default conversion options
 */
export const DEFAULT_OPTIONS: ConversionOptions = {
  outputFormat: 'html',
  cssFramework: 'none',
}; 