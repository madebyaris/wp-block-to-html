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
  renderCallback: undefined,
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
  options: IncrementalOptions = DEFAULT_INCREMENTAL_OPTIONS,
): string {
  const {
    initialRenderCount = 10,
    batchSize = 5,
    batchDelay = 50,
    useIntersectionObserver = false,
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

  const remainingBatches = [];
  for (let index = 0; index < remainingBlocks.length; index += batchSize) {
    remainingBatches.push(remainingBlocks.slice(index, index + batchSize));
  }

  const remainingBlocksMarkers = remainingBatches
    .map((batch, batchIndex) => {
      const templateId = `wp-block-incremental-template-${batchIndex}`;
      const mountId = `wp-block-incremental-batch-${batchIndex}`;
      const batchHTML = batch.map(processBlockFn).join('');
      const loadingAttributes = useIntersectionObserver
        ? 'data-lazy-load="true"'
        : 'data-lazy-load="false"';

      return `
        <template id="${templateId}" data-incremental-batch-template="${batchIndex}">${batchHTML}</template>
        <div
          id="${mountId}"
          class="wp-block-incremental-placeholder"
          data-incremental-batch-index="${batchIndex}"
          data-block-count="${batch.length}"
          ${loadingAttributes}
        ></div>
      `;
    })
    .join('');

  const clientScript = `
    <script class="wp-block-incremental-script">
      (function() {
        var processedBatches = Object.create(null);
        var batchDelay = ${batchDelay};
        var useIntersectionObserver = ${useIntersectionObserver ? 'true' : 'false'};
        var batchCount = ${remainingBatches.length};

        function renderBatch(batchIndex) {
          if (processedBatches[batchIndex]) {
            return;
          }

          var template = document.getElementById('wp-block-incremental-template-' + batchIndex);
          var mount = document.getElementById('wp-block-incremental-batch-' + batchIndex);

          if (!template || !mount) {
            return;
          }

          mount.innerHTML = template.innerHTML;
          mount.classList.remove('wp-block-incremental-placeholder');
          template.remove();
          processedBatches[batchIndex] = true;
        }

        function renderSequentially(batchIndex) {
          if (batchIndex >= batchCount) {
            return;
          }

          renderBatch(batchIndex);
          window.setTimeout(function() {
            renderSequentially(batchIndex + 1);
          }, batchDelay);
        }

        window.__wpProcessRemainingBlocks = function(batchIndex) {
          if (typeof batchIndex === 'number') {
            renderBatch(batchIndex);
            return;
          }

          renderSequentially(0);
        };

        if (useIntersectionObserver && 'IntersectionObserver' in window) {
          var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
              if (!entry.isIntersecting) {
                return;
              }

              var batchIndex = Number(entry.target.getAttribute('data-incremental-batch-index'));
              renderBatch(batchIndex);
              observer.unobserve(entry.target);
            });
          }, { rootMargin: '100px 0px' });

          for (var i = 0; i < batchCount; i++) {
            var mount = document.getElementById('wp-block-incremental-batch-' + i);
            if (mount) {
              observer.observe(mount);
            }
          }
        } else {
          renderSequentially(0);
        }
      })();
    </script>
  `;

  // Return combined HTML with markers for incremental loading
  return initialHTML + remainingBlocksMarkers + clientScript;
}
