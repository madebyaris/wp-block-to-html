import { Block, IncrementalOptions } from '../types';

/**
 * Default incremental rendering options
 */
export const DEFAULT_INCREMENTAL_OPTIONS: IncrementalOptions = {
  enabled: false,
  initialRenderCount: 10,
  batchSize: 5,
  batchDelay: 50,
  useIntersectionObserver: false,
  containerSelector: undefined,
  renderCallback: undefined
};

/**
 * Process blocks incrementally for client-side progressive loading
 * 
 * @param blocks Array of WordPress blocks
 * @param processBlockFn Function to process each block
 * @param options Incremental rendering options
 * @returns HTML string with markers for incremental rendering
 */
export function processBlocksIncrementally(
  blocks: Block[],
  processBlockFn: (block: Block) => string, 
  options: IncrementalOptions = DEFAULT_INCREMENTAL_OPTIONS
): string {
  const {
    initialRenderCount = 10,
    batchSize = 5,
    useIntersectionObserver = false
  } = options;

  // Process initial blocks immediately
  const initialBlocks = blocks.slice(0, initialRenderCount);
  const remainingBlocks = blocks.slice(initialRenderCount);
  
  // Generate HTML for initial blocks
  const initialHTML = initialBlocks.map(processBlockFn).join('');
  
  // If no remaining blocks, return just the initial HTML
  if (remainingBlocks.length === 0) {
    return initialHTML;
  }
  
  // Create markers for remaining blocks that will be rendered incrementally
  const remainingBlocksMarkers = remainingBlocks.map((block, index) => {
    const blockId = `incremental-block-${index}`;
    const loadingAttributes = useIntersectionObserver 
      ? `data-lazy-load="true" data-block-index="${index + initialRenderCount}"` 
      : `data-batch-index="${Math.floor(index / batchSize)}" data-block-index="${index + initialRenderCount}"`;
    
    return `<div id="${blockId}" class="wp-block-incremental-placeholder" ${loadingAttributes} data-block-name="${block.blockName || ''}"></div>`;
  }).join('');
  
  // Add script for client-side processing if necessary
  const clientScript = `
    <script class="wp-block-incremental-script">
      (function() {
        // Store the blocks data for later processing
        window.__wpBlocksIncremental = window.__wpBlocksIncremental || {
          remainingBlocks: ${JSON.stringify(remainingBlocks)},
          options: ${JSON.stringify(options)},
          processedCount: ${initialRenderCount}
        };
        
        // Function will be called by the main library or can be called manually
        window.__wpProcessRemainingBlocks = function() {
          console.log("Processing remaining blocks incrementally...");
        };
      })();
    </script>
  `;
  
  // Return combined HTML with markers for incremental loading
  return initialHTML + remainingBlocksMarkers + clientScript;
} 