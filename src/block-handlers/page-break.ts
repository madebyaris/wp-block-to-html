import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';

/**
 * Handler for the 'core/nextpage' block (WordPress page break)
 * This block represents the WordPress <!--nextpage--> tag for pagination
 */
export const pageBreakBlockHandler: BlockHandler = {
  /**
   * Transform a page break block to HTML
   * @param block Page break block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);

    // Handle multipage content differently based on contentHandling setting
    if (options.contentHandling === 'rendered') {
      // In rendered mode, just render the <!--nextpage--> tag as-is
      return '<!--nextpage-->';
    }

    // For raw or hybrid mode, create a more structured pagination divider
    const pageBreakContent = options.paginationLabel || 'Page Break';

    // If there's a custom pagination processor in options, use that
    if (
      options.customPaginationProcessor &&
      typeof options.customPaginationProcessor === 'function'
    ) {
      try {
        const processedContent = options.customPaginationProcessor(block, options);
        if (processedContent) {
          return processedContent;
        }
      } catch (error) {
        console.error('Error processing page break:', error);
      }
    }

    // Create pagination element attributes
    const attrs = {
      class: classes,
      'data-wp-page-break': 'true',
      'aria-label': pageBreakContent,
    };

    // Return a page break element with proper ARIA roles
    return `
      <!-- wp:nextpage -->
      ${createElement('hr', attrs)}
      <div class="wp-block-page-break-nav" data-role="pagination-indicator">
        <span class="screen-reader-text">${pageBreakContent}</span>
      </div>
      <!-- /wp:nextpage -->
    `;
  },

  // CSS framework class mappings
  cssMapping: {
    default: {
      block: 'wp-block-nextpage',
    },
    tailwind: {
      block: 'my-8 border-t border-gray-300',
    },
    bootstrap: {
      block: 'my-4 border-top border-secondary',
    },
  },
};

/**
 * Process WordPress content to handle pagination
 * This utility function splits content by page breaks and provides navigation
 *
 * @param content WordPress content with page breaks
 * @param options Additional options for pagination
 * @returns Paginated content with navigation controls
 */
export function processPaginatedContent(
  content: string,
  options: {
    currentPage?: number;
    showNavigation?: boolean;
    navigationPosition?: 'top' | 'bottom' | 'both';
    prevLabel?: string;
    nextLabel?: string;
    pageIndicatorTemplate?: string;
    wrapperClass?: string;
  } = {},
): { content: string; totalPages: number; hasMultiplePages: boolean } {
  // Set default options
  const {
    currentPage = 1,
    showNavigation = true,
    navigationPosition = 'bottom',
    prevLabel = 'Previous',
    nextLabel = 'Next',
    pageIndicatorTemplate = 'Page %current% of %total%',
    wrapperClass = 'wp-block-post-content-paginated',
  } = options;

  // Split content by page breaks
  const pages = content.split(/<!--nextpage-->/);
  const totalPages = pages.length;
  const hasMultiplePages = totalPages > 1;

  // If there are no page breaks or we're on an invalid page, return the original content
  if (!hasMultiplePages || currentPage < 1 || currentPage > totalPages) {
    return { content, totalPages, hasMultiplePages };
  }

  // Get the content for the current page (adjusting for 0-based array)
  const pageContent = pages[currentPage - 1];

  // Create pagination navigation if enabled
  let navigation = '';
  if (showNavigation) {
    navigation = createPaginationNavigation({
      currentPage,
      totalPages,
      prevLabel,
      nextLabel,
      pageIndicatorTemplate,
    });
  }

  // Position the navigation based on preference
  let paginatedContent = '';

  if (navigationPosition === 'top' || navigationPosition === 'both') {
    paginatedContent += navigation;
  }

  paginatedContent += pageContent;

  if (navigationPosition === 'bottom' || navigationPosition === 'both') {
    paginatedContent += navigation;
  }

  // Wrap the content in a container div
  return {
    content: `<div class="${wrapperClass}" data-current-page="${currentPage}" data-total-pages="${totalPages}">${paginatedContent}</div>`,
    totalPages,
    hasMultiplePages,
  };
}

/**
 * Create pagination navigation controls
 */
function createPaginationNavigation({
  currentPage,
  totalPages,
  prevLabel,
  nextLabel,
  pageIndicatorTemplate,
}: {
  currentPage: number;
  totalPages: number;
  prevLabel: string;
  nextLabel: string;
  pageIndicatorTemplate: string;
}): string {
  // Create pagination indicator text
  const pageIndicator = pageIndicatorTemplate
    .replace('%current%', currentPage.toString())
    .replace('%total%', totalPages.toString());

  // Create previous button (disabled if on first page)
  const prevButton =
    currentPage > 1
      ? `<a href="#page-${currentPage - 1}" class="pagination-prev" data-page="${
          currentPage - 1
        }">${prevLabel}</a>`
      : `<span class="pagination-prev pagination-disabled">${prevLabel}</span>`;

  // Create next button (disabled if on last page)
  const nextButton =
    currentPage < totalPages
      ? `<a href="#page-${currentPage + 1}" class="pagination-next" data-page="${
          currentPage + 1
        }">${nextLabel}</a>`
      : `<span class="pagination-next pagination-disabled">${nextLabel}</span>`;

  // Return the navigation container
  return `
    <nav class="wp-block-pagination" aria-label="Content Pagination">
      <div class="wp-block-pagination-controls">
        ${prevButton}
        <span class="wp-block-pagination-indicator">${pageIndicator}</span>
        ${nextButton}
      </div>
    </nav>
  `;
}
