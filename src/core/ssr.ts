/**
 * Server-Side Rendering Optimization Module
 * Provides performance optimizations for server-rendered content
 */

import { Block, BlockList, ConversionOptions, DEFAULT_OPTIONS, SSROptions } from '../types';
import { mergeOptions } from './utils';
import { convertBlocks } from './converter';

/**
 * Default SSR options
 */
export const DEFAULT_SSR_OPTIONS: SSROptions = {
  enabled: false,
  level: 'balanced',
  stripClientScripts: true,
  optimizeImages: true,
  inlineCriticalCSS: false,
};

/**
 * Process blocks with server-side rendering optimizations
 *
 * @param blockData WordPress block data (blocks or rendered content)
 * @param options Conversion configuration options
 * @returns Optimized HTML string for server-side rendering
 */
export function processBlocksForSSR(
  blockData: BlockList | Block[],
  options: ConversionOptions = {}
): string {
  // Merge with default options
  const mergedOptions = mergeOptions(DEFAULT_OPTIONS, options);
  
  // Set SSR options with defaults
  const ssrOptions = mergeOptions(DEFAULT_SSR_OPTIONS, mergedOptions.ssrOptions || {});
  
  // If SSR optimization is not enabled, just use the standard converter
  if (!ssrOptions.enabled) {
    return convertBlocks(blockData, mergedOptions) as string;
  }
  
  // Pre-process rendered HTML if available and custom function is provided
  let processedBlockData = blockData;
  if (ssrOptions.preProcessHTML && typeof blockData === 'object' && 'rendered' in blockData) {
    const renderedContent = (blockData as any).rendered;
    if (typeof renderedContent === 'string') {
      processedBlockData = {
        ...blockData,
        rendered: ssrOptions.preProcessHTML(renderedContent, mergedOptions),
      } as BlockList;
    }
  }

  // Apply optimization depth constraints if specified
  if (ssrOptions.optimizationDepth && ssrOptions.optimizationDepth !== 'full') {
    processedBlockData = applyOptimizationDepth(processedBlockData, ssrOptions.optimizationDepth);
  }

  // Convert blocks to HTML
  let html = convertBlocks(processedBlockData, mergedOptions) as string;
  
  // No further processing needed for non-HTML output
  if (typeof html !== 'string') {
    return html as unknown as string;
  }
  
  // Apply SSR optimizations based on level
  html = applySSROptimizations(html, ssrOptions, mergedOptions);
  
  // Post-process if custom function is provided
  if (ssrOptions.postProcessHTML) {
    html = ssrOptions.postProcessHTML(html, mergedOptions);
  }
  
  return html;
}

/**
 * Apply server-side rendering optimizations to HTML
 *
 * @param html HTML content to optimize
 * @param ssrOptions SSR optimization options
 * @param conversionOptions Full conversion options
 * @returns Optimized HTML
 */
function applySSROptimizations(
  html: string,
  ssrOptions: SSROptions,
  conversionOptions: ConversionOptions
): string {
  let optimizedHtml = html;
  
  // Apply minimal optimizations (always applied)
  optimizedHtml = optimizeMinimal(optimizedHtml);
  
  // Apply balanced optimizations (default)
  if (ssrOptions.level !== 'minimal') {
    optimizedHtml = optimizeBalanced(optimizedHtml, ssrOptions);
  }
  
  // Apply maximum optimizations
  if (ssrOptions.level === 'maximum') {
    optimizedHtml = optimizeMaximum(optimizedHtml, ssrOptions, conversionOptions);
  }
  
  return optimizedHtml;
}

/**
 * Apply minimal optimizations
 * Focus on essential performance improvements with minimal processing
 */
function optimizeMinimal(html: string): string {
  // Remove excessive whitespace between tags (but preserve whitespace in content)
  html = html.replace(/>\s{2,}</g, '> <');
  
  // Remove HTML comments (except conditional comments for IE)
  html = html.replace(/<!--(?![\[\]>])(?:(?!-->).)*-->/g, '');
  
  return html;
}

/**
 * Apply balanced optimizations
 * Good balance between performance and features
 */
function optimizeBalanced(html: string, ssrOptions: SSROptions): string {
  // Start with minimal optimizations
  let optimizedHtml = html;
  
  // Strip client-only scripts if enabled
  if (ssrOptions.stripClientScripts) {
    // Remove inline event handlers (onclick, onload, etc.)
    optimizedHtml = optimizedHtml.replace(/ on\w+="[^"]*"/g, '');
    
    // Remove script tags with client-side behavior markers
    optimizedHtml = optimizedHtml.replace(
      /<script\b(?:[^>]* class="[^"]*client-only[^"]*"[^>]*|[^>]* data-ssr-exclude[^>]*)>[\s\S]*?<\/script>/gi, 
      ''
    );
  }
  
  // Optimize images if enabled
  if (ssrOptions.optimizeImages) {
    // Add loading="lazy" to images without it
    optimizedHtml = optimizedHtml.replace(
      /<img\b([^>]*)(?!\bloading=(['"]))(.*?)>/gi,
      '<img$1$3 loading="lazy">'
    );
    
    // Set explicit width/height where possible to prevent layout shifts
    // This is a simplified implementation - a real implementation would analyze the image
    optimizedHtml = optimizedHtml.replace(
      /<img\b([^>]*)src="([^"]+)"([^>]*)(?!\bwidth=|\bheight=)([^>]*)>/gi,
      (match, pre, src, mid, post) => {
        // In a real implementation, you would determine dimensions
        // For now, we'll add data attributes that can be processed client-side
        return `<img${pre}src="${src}"${mid}${post} data-ssr-needs-dimensions="true">`;
      }
    );
  }
  
  return optimizedHtml;
}

/**
 * Apply maximum optimizations
 * All optimizations enabled, may be slower but produces optimal output
 */
function optimizeMaximum(
  html: string, 
  ssrOptions: SSROptions,
  conversionOptions: ConversionOptions
): string {
  // Start with balanced optimizations
  let optimizedHtml = html;
  
  // Inline critical CSS if enabled
  if (ssrOptions.inlineCriticalCSS) {
    // A real implementation would extract critical CSS
    // For now, we'll add a placeholder comment for framework-specific implementations
    optimizedHtml = optimizedHtml.replace(
      /<head>([\s\S]*?)<\/head>/i,
      '<head>$1<!-- CRITICAL_CSS_PLACEHOLDER --></head>'
    );
  }
  
  // Add preload hints for images in the initial viewport
  // In a real implementation, this would analyze the DOM and determine what's above the fold
  optimizedHtml = optimizedHtml.replace(
    /<head>([\s\S]*?)<\/head>/i,
    (match, headContent) => {
      // Extract all images from the HTML
      const imgRegex = /<img\b[^>]+src="([^"]+)"[^>]*>/gi;
      const preloads = [];
      let imgMatch;
      let count = 0;
      
      // Only preload the first few images (assuming they're above the fold)
      while ((imgMatch = imgRegex.exec(optimizedHtml)) !== null && count < 3) {
        const imgSrc = imgMatch[1];
        if (imgSrc && !imgSrc.startsWith('data:')) {
          preloads.push(`<link rel="preload" href="${imgSrc}" as="image">`);
          count++;
        }
      }
      
      return `<head>${headContent}${preloads.join('\n')}</head>`;
    }
  );
  
  return optimizedHtml;
}

/**
 * Apply optimization depth constraints to block data
 * Limits how deeply nested blocks are processed
 * 
 * @param blockData Block data to process
 * @param depth The optimization depth ('shallow' or 'medium')
 * @returns The filtered block data
 */
function applyOptimizationDepth(blockData: BlockList | Block[], depth: 'shallow' | 'medium'): BlockList | Block[] {
  // Handle BlockList case (object with blocks property)
  if (typeof blockData === 'object' && 'blocks' in blockData) {
    return {
      ...blockData,
      blocks: filterBlocksByDepth((blockData as BlockList).blocks, depth, 0)
    };
  }
  
  // Handle direct array of blocks
  return filterBlocksByDepth(blockData as Block[], depth, 0);
}

/**
 * Recursively filter blocks based on nesting depth
 * 
 * @param blocks Array of blocks
 * @param depthOption The optimization depth option
 * @param currentDepth Current nesting depth
 * @returns Filtered blocks with limited nesting
 */
function filterBlocksByDepth(blocks: Block[], depthOption: 'shallow' | 'medium', currentDepth: number): Block[] {
  // For 'shallow', only include top-level blocks without inner blocks
  if (depthOption === 'shallow' && currentDepth > 0) {
    return [];
  }
  
  // For 'medium', include up to second level blocks
  if (depthOption === 'medium' && currentDepth > 1) {
    return [];
  }
  
  // Process each block and its inner blocks with depth constraints
  return blocks.map(block => {
    // If block has inner blocks, apply depth filtering recursively
    if (block.innerBlocks && block.innerBlocks.length > 0) {
      return {
        ...block,
        innerBlocks: filterBlocksByDepth(block.innerBlocks, depthOption, currentDepth + 1)
      };
    }
    
    return block;
  });
} 