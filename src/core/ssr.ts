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
  lazyLoadMedia: true,
  preserveFirstImage: false,
  prioritizeAboveTheFold: false,
  criticalPathOnly: false,
  deferNonCritical: false,
  preconnect: false,
  removeDuplicateStyles: false,
  minifyOutput: false,
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
  options: ConversionOptions = {},
): string {
  // Merge with default options
  const mergedOptions = mergeOptions(DEFAULT_OPTIONS, options);

  // Set SSR options with defaults
  const ssrOptions = mergeOptions(DEFAULT_SSR_OPTIONS, mergedOptions.ssrOptions || {});
  const normalizedDepth = normalizeOptimizationDepth(ssrOptions.optimizationDepth);

  // If SSR optimization is not enabled, just use the standard converter
  if (!ssrOptions.enabled) {
    return convertBlocks(blockData, mergedOptions) as string;
  }

  // Pre-process rendered HTML if available and custom function is provided
  let processedBlockData = blockData;
  if (ssrOptions.preProcessHTML && typeof blockData === 'object' && 'rendered' in blockData) {
    const renderedContent = (blockData as BlockList & { rendered?: string }).rendered;
    if (typeof renderedContent === 'string') {
      processedBlockData = {
        ...blockData,
        rendered: ssrOptions.preProcessHTML(renderedContent, mergedOptions),
      } as BlockList;
    }
  }

  // Apply optimization depth constraints if specified
  if (normalizedDepth !== 'full') {
    processedBlockData = applyOptimizationDepth(processedBlockData, normalizedDepth);
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

  if (ssrOptions.minifyOutput) {
    html = minifyHtml(html);
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
  conversionOptions: ConversionOptions,
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

  if (ssrOptions.preconnect) {
    optimizedHtml = addPreconnectHints(optimizedHtml);
  }

  if (ssrOptions.removeDuplicateStyles) {
    optimizedHtml = removeDuplicateStyles(optimizedHtml);
  }

  if (ssrOptions.prioritizeAboveTheFold) {
    optimizedHtml = prioritizeAboveTheFold(optimizedHtml);
  }

  if (ssrOptions.criticalPathOnly) {
    optimizedHtml = markCriticalPath(optimizedHtml);
  }

  if (ssrOptions.deferNonCritical) {
    optimizedHtml = markDeferredContent(optimizedHtml);
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
  html = html.replace(/<!--(?!\[)(?:(?!-->).)*-->/g, '');

  return html;
}

function addPreconnectHints(html: string): string {
  const domains = new Set<string>();

  const attributePattern = /\b(?:src|href)=["']https?:\/\/([^/"']+)/gi;
  let match: RegExpExecArray | null;

  while ((match = attributePattern.exec(html)) !== null) {
    const domain = match[1];
    if (domain && !domain.includes('localhost') && !domain.includes('127.0.0.1')) {
      domains.add(domain);
    }
  }

  if (domains.size === 0) {
    return html;
  }

  const hints = Array.from(domains)
    .map((domain) => `<link rel="preconnect" href="https://${domain}" crossorigin>`)
    .join('');

  return `${hints}${html}`;
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
      '',
    );
  }

  // Optimize images if enabled
  if (ssrOptions.optimizeImages) {
    const normalizedDepth = normalizeOptimizationDepth(ssrOptions.optimizationDepth);
    const shouldLazyLoadMedia = ssrOptions.lazyLoadMedia !== false && normalizedDepth !== 'shallow';
    let isFirstImage = true;

    optimizedHtml = optimizedHtml.replace(/<img\b[^>]*>/gi, (tag) => {
      let nextTag = normalizeVoidTag(tag);

      if (!/\b(?:width|height)=/i.test(nextTag)) {
        nextTag = addAttribute(nextTag, 'data-ssr-needs-dimensions', 'true');
      }

      if (!shouldLazyLoadMedia) {
        return nextTag;
      }

      if (isFirstImage) {
        isFirstImage = false;
        if (ssrOptions.preserveFirstImage) {
          return nextTag;
        }
      }

      return addAttribute(nextTag, 'loading', 'lazy');
    });

    if (shouldLazyLoadMedia) {
      optimizedHtml = optimizedHtml.replace(/<iframe\b[^>]*>/gi, (tag) => {
        return addAttribute(tag, 'loading', 'lazy');
      });
    }
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
  _conversionOptions: ConversionOptions,
): string {
  // Start with balanced optimizations
  let optimizedHtml = html;

  // Inline critical CSS if enabled
  if (ssrOptions.inlineCriticalCSS) {
    // A real implementation would extract critical CSS
    // For now, we'll add a placeholder comment for framework-specific implementations
    optimizedHtml = optimizedHtml.replace(
      /<head>([\s\S]*?)<\/head>/i,
      '<head>$1<!-- CRITICAL_CSS_PLACEHOLDER --></head>',
    );
  }

  // Add preload hints for images in the initial viewport
  // In a real implementation, this would analyze the DOM and determine what's above the fold
  optimizedHtml = optimizedHtml.replace(/<head>([\s\S]*?)<\/head>/i, (match, headContent) => {
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
  });

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
function applyOptimizationDepth(
  blockData: BlockList | Block[],
  depth: 'shallow' | 'medium',
): BlockList | Block[] {
  // Handle BlockList case (object with blocks property)
  if (typeof blockData === 'object' && 'blocks' in blockData) {
    return {
      ...blockData,
      blocks: filterBlocksByDepth((blockData as BlockList).blocks, depth, 0),
    };
  }

  // Handle direct array of blocks
  return filterBlocksByDepth(blockData as Block[], depth, 0);
}

function normalizeOptimizationDepth(
  depth: SSROptions['optimizationDepth'] | number | undefined,
): 'shallow' | 'medium' | 'full' {
  if (depth === undefined || depth === null) {
    return 'full';
  }

  if (typeof depth === 'number') {
    if (depth <= 1) {
      return 'shallow';
    }
    if (depth === 2) {
      return 'medium';
    }
    return 'full';
  }

  return depth;
}

function normalizeVoidTag(tag: string): string {
  return tag.replace(/\s+\/>/, ' />');
}

function addAttribute(tag: string, name: string, value: string): string {
  if (new RegExp(`\\b${name}=`, 'i').test(tag)) {
    return tag;
  }

  return tag.replace(/\s*\/?>$/, (suffix) => ` ${name}="${value}"${suffix}`);
}

function prioritizeAboveTheFold(html: string): string {
  let remaining = 3;
  return html.replace(/<(h[1-6]|p|figure|div|nav)\b[^>]*>/gi, (tag) => {
    if (remaining <= 0) {
      return tag;
    }

    remaining -= 1;
    return addAttribute(tag, 'data-priority', 'high');
  });
}

function markCriticalPath(html: string): string {
  return `<div class="critical-path">${html}</div>`;
}

function markDeferredContent(html: string): string {
  let seen = 0;
  return html.replace(/<(h[1-6]|p|figure|div|nav)\b[^>]*>/gi, (tag) => {
    seen += 1;
    if (seen <= 2) {
      return tag;
    }

    let deferredTag = addAttribute(tag, 'data-defer', 'true');
    if (!/\bloading=/i.test(deferredTag)) {
      deferredTag = addAttribute(deferredTag, 'loading', 'lazy');
    }

    return deferredTag;
  });
}

function removeDuplicateStyles(html: string): string {
  const seenStyles = new Set<string>();

  return html.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, (fullMatch, cssContent) => {
    const normalizedCss = cssContent.trim();
    if (seenStyles.has(normalizedCss)) {
      return '';
    }

    seenStyles.add(normalizedCss);
    return fullMatch;
  });
}

function minifyHtml(html: string): string {
  return html
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .replace(/\n+/g, '')
    .trim();
}

/**
 * Recursively filter blocks based on nesting depth
 *
 * @param blocks Array of blocks
 * @param depthOption The optimization depth option
 * @param currentDepth Current nesting depth
 * @returns Filtered blocks with limited nesting
 */
function filterBlocksByDepth(
  blocks: Block[],
  depthOption: 'shallow' | 'medium',
  currentDepth: number,
): Block[] {
  // For 'shallow', only include top-level blocks without inner blocks
  if (depthOption === 'shallow' && currentDepth > 0) {
    return [];
  }

  // For 'medium', include up to second level blocks
  if (depthOption === 'medium' && currentDepth > 1) {
    return [];
  }

  // Process each block and its inner blocks with depth constraints
  return blocks.map((block) => {
    // If block has inner blocks, apply depth filtering recursively
    if (block.innerBlocks && block.innerBlocks.length > 0) {
      return {
        ...block,
        innerBlocks: filterBlocksByDepth(block.innerBlocks, depthOption, currentDepth + 1),
      };
    }

    return block;
  });
}
