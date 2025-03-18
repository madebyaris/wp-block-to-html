/**
 * WordPress block data
 */
export interface Block {
  /**
   * Block name (e.g., 'core/paragraph')
   */
  blockName: string;

  /**
   * Block attributes
   */
  attrs?: Record<string, any>;

  /**
   * Inner blocks
   */
  innerBlocks?: Block[];

  /**
   * Inner content
   */
  innerContent: string[];

  /**
   * HTML content (optional)
   */
  innerHTML?: string;
}

/**
 * List of blocks
 */
export interface BlockList {
  blocks: Block[];
}

/**
 * Output format options
 */
export type OutputFormat = 'html' | 'component' | 'react' | 'vue' | 'angular' | 'svelte';

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
 * Block handler registry
 */
export interface BlockHandlerRegistry {
  [blockName: string]: BlockHandler;
}

/**
 * Options for the conversion process
 */
export interface ConversionOptions {
  /**
   * Output format (html or component)
   */
  outputFormat?: OutputFormat;

  /**
   * CSS framework to use for styling
   */
  cssFramework?: CSSFramework;

  /**
   * Custom CSS class mappings
   */
  customCssMapping?: Record<string, any>;

  /**
   * Custom class map for blocks
   */
  customClassMap?: CustomClassMap;

  /**
   * Custom component factory
   */
  componentFactory?: (tag: string, props: Record<string, any>, children: any) => any;

  /**
   * Custom block transformers
   */
  blockTransformers?: Record<string, BlockTransformer>;

  /**
   * Custom shortcode processor function
   * @param shortcodeContent The raw shortcode content
   * @param block The block object
   * @param options The conversion options
   * @returns Processed HTML or component
   */
  customShortcodeProcessor?: (
    shortcodeContent: string,
    block: Block,
    options: ConversionOptions,
  ) => string | unknown;

  /**
   * HTML sanitizer function
   * @param html The HTML content to sanitize
   * @returns Sanitized HTML string
   */
  sanitizeHtml?: (html: string) => string;

  /**
   * Custom latest posts processor function
   * @param block The latest posts block object
   * @param options The conversion options
   * @returns Processed HTML or component
   */
  customLatestPostsProcessor?: (block: Block, options: ConversionOptions) => string | unknown;

  /**
   * Custom archives processor function
   * @param block The archives block object
   * @param options The conversion options
   * @returns Processed HTML or component
   */
  customArchivesProcessor?: (block: Block, options: ConversionOptions) => string | unknown;

  /**
   * Custom calendar processor function
   * @param block The calendar block object
   * @param options The conversion options
   * @returns Processed HTML or component
   */
  customCalendarProcessor?: (block: Block, options: ConversionOptions) => string | unknown;

  /**
   * Custom categories processor function
   * @param block The categories block object
   * @param options The conversion options
   * @returns Processed HTML or component
   */
  customCategoriesProcessor?: (block: Block, options: ConversionOptions) => string | unknown;

  /**
   * Custom term list processor function
   * @param block The term list block object
   * @param options The conversion options
   * @returns Processed HTML or component
   */
  customTermListProcessor?: (block: Block, options: ConversionOptions) => string | unknown;

  /**
   * Custom page list processor function
   * @param block The page list block object
   * @param options The conversion options
   * @returns Processed HTML or component
   */
  customPageListProcessor?: (block: Block, options: ConversionOptions) => string | unknown;

  /**
   * Custom RSS processor function
   * @param block The RSS block object
   * @param options The conversion options
   * @returns Processed HTML or component
   */
  customRssProcessor?: (block: Block, options: ConversionOptions) => string | unknown;

  /**
   * Custom search processor function
   * @param block The search block object
   * @param options The conversion options
   * @returns Processed HTML or component
   */
  customSearchProcessor?: (block: Block, options: ConversionOptions) => string | unknown;

  /**
   * Custom processor for social links blocks
   * @param block The social links block object
   * @param options The conversion options
   * @returns Processed HTML or component
   */
  customSocialLinksProcessor?: (block: Block, options: ConversionOptions) => string | unknown;

  /**
   * Custom processor for embed blocks
   * @param block The embed block object
   * @param options The conversion options
   * @returns Processed HTML or component
   */
  customEmbedProcessor?: (block: Block, options: ConversionOptions) => string | unknown;

  /**
   * How to handle WordPress content
   * - 'raw' (default): Process raw block data for full control over the output HTML
   * - 'rendered': Use the rendered HTML content as-is from WordPress
   * - 'hybrid': Combine rendered HTML with framework-specific styling
   */
  contentHandling?: 'raw' | 'rendered' | 'hybrid';

  /**
   * @deprecated Use contentHandling instead
   * How to handle pre-rendered content from WordPress API
   * - 'respect': Use the pre-rendered HTML from WordPress (default)
   * - 'rebuild': Extract content and rebuild with our classes
   * - 'preserve-attrs': Use pre-rendered HTML but add our classes to existing tags
   */
  renderedContentHandling?: 'respect' | 'rebuild' | 'preserve-attrs';
}

/**
 * Block handler interface
 */
export interface BlockHandler {
  /**
   * Transform a block to HTML or component
   * @param block Block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown;

  /**
   * CSS framework mappings
   */
  cssMapping?: Record<string, any>;
}

/**
 * Default conversion options
 */
export const DEFAULT_OPTIONS: ConversionOptions = {
  outputFormat: 'html',
  cssFramework: 'none',
  contentHandling: 'raw',
};
