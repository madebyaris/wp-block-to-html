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
  /**
   * Array of block objects
   */
  blocks: Block[];
  
  /**
   * Optional pre-rendered content from WordPress
   */
  rendered?: string;
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
 * Incremental rendering options for client-side progressive content loading
 */
export interface IncrementalOptions {
  /**
   * Enable incremental rendering (default: false)
   */
  enabled?: boolean;

  /**
   * Number of blocks to render in the initial pass (default: 10)
   */
  initialRenderCount?: number;

  /**
   * Number of blocks to render in each subsequent batch (default: 5)
   */
  batchSize?: number;

  /**
   * Delay in milliseconds between batch rendering (default: 50)
   */
  batchDelay?: number;

  /**
   * DOM element selector where content should be rendered incrementally
   * If not provided, content is returned as a string with markers for incremental rendering
   */
  containerSelector?: string;

  /**
   * Custom callback for rendering incremental content
   * If provided, this function will be called instead of the default renderer
   */
  renderCallback?: (content: string, options: IncrementalOptions) => void;

  /**
   * Whether to use IntersectionObserver for lazy loading blocks when they come into view
   * (default: false)
   */
  useIntersectionObserver?: boolean;

  /**
   * Custom ID prefix for incremental blocks (default: 'wp-block-')
   */
  idPrefix?: string;
}

/**
 * Streaming-specific options
 */
export interface StreamingOptions {
  /**
   * Number of blocks to process at once (default: 10)
   */
  chunkSize?: number;

  /**
   * Stream high water mark (controls buffer size, default: 16)
   */
  highWaterMark?: number;

  /**
   * Whether to handle backpressure automatically (default: true)
   */
  handleBackpressure?: boolean;
}

/**
 * Server-side rendering optimization options
 */
export interface SSROptions {
  /**
   * Enable server-side rendering optimizations (default: false)
   */
  enabled?: boolean;
  
  /**
   * Optimization level (default: 'balanced')
   * - 'minimal': Only essential optimizations, fastest execution
   * - 'balanced': Good balance between speed and features (default)
   * - 'maximum': All optimizations enabled, may be slower but produces optimal output
   */
  level?: 'minimal' | 'balanced' | 'maximum';
  
  /**
   * Whether to strip client-only scripts automatically (default: true)
   * This removes interactive elements that won't work on the server
   */
  stripClientScripts?: boolean;
  
  /**
   * Whether to optimize images for SSR (default: true)
   * Adds width/height where possible and loading="lazy" attributes
   */
  optimizeImages?: boolean;
  
  /**
   * Whether to strip HTML comments (default: true)
   * Removes comments to reduce page size
   */
  stripComments?: boolean;
  
  /**
   * Whether to inline critical CSS (default: false)
   * For maximum level only - extracts and inlines CSS for above-the-fold content
   */
  inlineCriticalCSS?: boolean;

  /**
   * Whether to prioritize above-the-fold content rendering (default: false)
   * Optimizes initial viewport content for faster LCP and improved user experience
   */
  prioritizeAboveTheFold?: boolean;

  /**
   * Whether to lazy load media elements automatically (default: true)
   * Adds loading="lazy" attribute to images and iframes for deferred loading
   */
  lazyLoadMedia?: boolean;

  /**
   * Whether to preserve the first image for LCP optimization (default: true)
   * Skip lazy loading and prioritize the first image for better LCP
   */
  preserveFirstImage?: boolean;

  /**
   * Controls how deep in the DOM to apply optimizations (default: 'full')
   * - 'shallow': Only top-level elements 
   * - 'medium': Top-level and second level blocks
   * - 'full': All blocks at all nesting levels
   */
  optimizationDepth?: 'shallow' | 'medium' | 'full';

  /**
   * Whether to only render critical path content (default: false)
   * When true, only renders content likely to be in the initial viewport
   */
  criticalPathOnly?: boolean;

  /**
   * Whether to defer loading of non-critical content (default: false)
   * When true, uses progressive loading for below-the-fold content
   */
  deferNonCritical?: boolean;

  /**
   * Whether to add preconnect hints for external resources (default: false)
   * Adds link rel="preconnect" tags for external domains in content
   */
  preconnect?: boolean;

  /**
   * Whether to remove duplicate style blocks (default: false)
   * Deduplicate and merge inline styles to reduce page size
   */
  removeDuplicateStyles?: boolean;

  /**
   * Whether to minify the output HTML (default: false)
   * Removes unnecessary whitespace and optimizes HTML output size
   */
  minifyOutput?: boolean;

  /**
   * Custom function to process HTML content before final return
   * Useful for framework-specific optimizations without binding the library to a framework
   */
  preProcessHTML?: (html: string, options: ConversionOptions) => string;

  /**
   * Custom function to process HTML content after all processing
   * Useful for framework-specific optimizations without binding the library to a framework
   */
  postProcessHTML?: (html: string, options: ConversionOptions) => string;
}

/**
 * Conversion options
 */
export interface ConversionOptions {
  /**
   * CSS framework to use for styling classes
   */
  cssFramework?: string;

  /**
   * Custom CSS class mapper for the selected framework
   */
  cssClassMap?: Record<string, string>;

  /**
   * Custom class mapping for specific blocks
   */
  customClassMap?: Record<string, any>;

  /**
   * Custom transformer functions for specific block types
   */
  blockTransformers?: Record<string, BlockTransformer>;

  /**
   * How to handle pre-rendered content from WordPress
   * @deprecated Use contentHandling instead
   */
  renderedContentHandling?: 'respect' | 'rebuild' | 'preserve-attrs';

  /**
   * Content handling mode
   * - 'raw' = Use block data to rebuild HTML (default)
   * - 'rendered' = Use the rendered HTML from WordPress
   * - 'hybrid' = Use rendered HTML but enhance with framework classes
   */
  contentHandling?: 'raw' | 'rendered' | 'hybrid';

  /**
   * Output format
   * - 'html' = Return HTML string (default)
   * - 'component' = Return array of components or objects
   * - Framework-specific formats: 'react', 'vue', 'angular', 'svelte'
   */
  outputFormat?: 'html' | 'component' | 'react' | 'vue' | 'angular' | 'svelte';

  /**
   * Server-side rendering optimization options
   */
  ssrOptions?: SSROptions;

  /**
   * Advanced streaming options for handling large content sets
   */
  streamingOptions?: StreamingOptions;

  /**
   * Incremental rendering options for client-side progressive content loading
   */
  incrementalOptions?: IncrementalOptions;

  /**
   * Reference to blocks being processed (used for incremental rendering)
   * @internal
   */
  blocks?: Block[];

  /**
   * Custom processor for RSS blocks
   */
  customRssProcessor?: (block: Block, options: ConversionOptions) => string | null;

  /**
   * Custom processor for latest posts blocks
   */
  customLatestPostsProcessor?: (block: Block, options: ConversionOptions) => string | null;

  /**
   * Custom processor for page list blocks
   */
  customPageListProcessor?: (block: Block, options: ConversionOptions) => string | null;

  /**
   * Custom processor for pagination
   */
  customPaginationProcessor?: (block: Block, options: ConversionOptions) => string | null;

  /**
   * Custom processor for embed blocks
   */
  customEmbedProcessor?: (block: Block, options: ConversionOptions) => string | null;

  /**
   * Custom processor for archives blocks
   */
  customArchivesProcessor?: (block: Block, options: ConversionOptions) => string | null;

  /**
   * Custom processor for calendar blocks
   */
  customCalendarProcessor?: (block: Block, options: ConversionOptions) => string | null;

  /**
   * Custom processor for categories blocks
   */
  customCategoriesProcessor?: (block: Block, options: ConversionOptions) => string | null;

  /**
   * Custom processor for term list blocks
   */
  customTermListProcessor?: (block: Block, options: ConversionOptions) => string | null;

  /**
   * Custom processor for search blocks
   */
  customSearchProcessor?: (block: Block, options: ConversionOptions) => string | null;

  /**
   * Custom processor for shortcode blocks
   */
  customShortcodeProcessor?: (
    shortcodeContent: string,
    block: Block,
    options: ConversionOptions,
  ) => string | null;

  /**
   * HTML sanitization function
   */
  sanitizeHtml?: (htmlContent: string) => string;

  /**
   * Component factory for framework-specific component creation
   */
  componentFactory?: (tag: string, attributes: Record<string, any>, children: any) => unknown;

  /**
   * Label to use for pagination
   */
  paginationLabel?: string;

  /**
   * Options for pagination when handling paginated content
   */
  paginationOptions?: {
    currentPage?: number;
    showNavigation?: boolean;
    navigationPosition?: 'top' | 'bottom' | 'both';
    prevLabel?: string;
    nextLabel?: string;
    pageIndicatorTemplate?: string;
    wrapperClass?: string;
  };
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

  /**
   * Process a nested list structure (optional, for List blocks)
   */
  processNestedList?: (
    content: string,
    tag: string,
    classes: string,
    block: Block,
    options: ConversionOptions,
  ) => string;

  /**
   * Process list items including nested lists (optional, for List blocks)
   */
  processListItems?: (content: string, block: Block, options: ConversionOptions) => string;

  /**
   * Process unstructured list content (optional, for List blocks)
   */
  processUnstructuredList?: (
    content: string,
    tag: string,
    classes: string,
    block: Block,
    options: ConversionOptions,
  ) => string;

  /**
   * Process a list item with nested lists (optional, for List blocks)
   */
  processItemWithNestedList?: (
    match: string,
    itemContent: string,
    block: Block,
    options: ConversionOptions,
  ) => string;

  /**
   * Get the appropriate wrapper class based on CSS framework (optional, for Image/Gallery blocks)
   */
  getWrapperClass?: (cssFramework?: string) => string;

  /**
   * Get the appropriate caption class based on CSS framework (optional, for Image/Gallery blocks)
   */
  getCaptionClass?: (cssFramework?: string) => string;
}

/**
 * Default conversion options
 */
export const DEFAULT_OPTIONS: ConversionOptions = {
  outputFormat: 'html',
  cssFramework: 'none',
  contentHandling: 'raw',
};
