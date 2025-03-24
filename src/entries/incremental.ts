// Export incremental rendering functionality
export * from '../core/incremental';

/**
 * This module enables incremental rendering of WordPress blocks for improved
 * performance with large content sets and better user experience.
 * 
 * Usage:
 * ```js
 * import { convertBlocks } from 'wp-block-to-html';
 * import { DEFAULT_INCREMENTAL_OPTIONS } from 'wp-block-to-html/incremental';
 * 
 * const html = convertBlocks(blocks, {
 *   incrementalOptions: {
 *     enabled: true,
 *     initialRenderCount: 5,
 *     batchSize: 3,
 *     batchDelay: 100,
 *     useIntersectionObserver: true  
 *   }
 * });
 * 
 * // Inject the resulting HTML into the page
 * document.getElementById('content').innerHTML = html;
 * ```
 */ 