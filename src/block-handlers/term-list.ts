import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';

/**
 * Handler for the 'core/term-list' block
 */
export const termListBlockHandler: BlockHandler = {
  /**
   * Transform a term list block to HTML
   * @param block Term list block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);

    // Extract term list attributes
    const taxonomy = block.attrs?.taxonomy || 'category';
    const showHierarchy = block.attrs?.showHierarchy || false;
    const showPostCounts = block.attrs?.showPostCounts || false;
    const showOnlyTopLevel = block.attrs?.showOnlyTopLevel || false;

    // Create a placeholder for the term list
    // In a real implementation, this would be replaced with actual term data
    let content = '';

    // Check if we have a custom term list processor in options
    if (options.customTermListProcessor && typeof options.customTermListProcessor === 'function') {
      try {
        const processedContent = options.customTermListProcessor(block, options);
        if (processedContent) {
          return processedContent;
        }
      } catch (error) {
        console.error('Error processing term list:', error);
      }
    }

    // If no custom processor or it failed, return a placeholder
    content = `
      <ul class="${getTermListClass(options.cssFramework)}">
        ${generateTermPlaceholders(5, taxonomy, showHierarchy, showPostCounts, showOnlyTopLevel)}
      </ul>
    `;

    // Create the term list container
    return createElement(
      'div',
      {
        class: classes,
        'data-taxonomy': taxonomy,
        'data-show-hierarchy': showHierarchy ? 'true' : 'false',
        'data-show-post-counts': showPostCounts ? 'true' : 'false',
        'data-show-only-top-level': showOnlyTopLevel ? 'true' : 'false',
      },
      content,
    );
  },

  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'my-6',
      align: {
        left: 'mr-auto',
        center: 'mx-auto',
        right: 'ml-auto',
        wide: 'max-w-screen-xl mx-auto',
        full: 'w-full',
      },
    },

    // Bootstrap mappings
    bootstrap: {
      block: 'my-4',
      align: {
        left: 'float-start',
        center: 'd-block mx-auto',
        right: 'float-end',
        wide: 'container-lg',
        full: 'container-fluid',
      },
    },
  },
};

/**
 * Helper functions for CSS classes
 */
function getTermListClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'list-disc pl-5 space-y-2';
    case 'bootstrap':
      return 'list-unstyled';
    default:
      return 'wp-block-term-list';
  }
}

/**
 * Generate placeholder term items
 */
function generateTermPlaceholders(
  count: number,
  taxonomy: string,
  showHierarchy: boolean,
  showPostCounts: boolean,
  showOnlyTopLevel: boolean,
): string {
  // Sample terms for different taxonomies
  const termsByTaxonomy: Record<
    string,
    Array<{ id: number; name: string; count: number; parent: number }>
  > = {
    category: [
      { id: 1, name: 'Uncategorized', count: 5, parent: 0 },
      { id: 2, name: 'Technology', count: 12, parent: 0 },
      { id: 3, name: 'Programming', count: 8, parent: 2 },
      { id: 4, name: 'Web Development', count: 6, parent: 3 },
      { id: 5, name: 'Design', count: 7, parent: 0 },
    ],
    post_tag: [
      { id: 1, name: 'WordPress', count: 15, parent: 0 },
      { id: 2, name: 'Development', count: 20, parent: 0 },
      { id: 3, name: 'Design', count: 10, parent: 0 },
      { id: 4, name: 'UX', count: 8, parent: 0 },
      { id: 5, name: 'Performance', count: 5, parent: 0 },
    ],
    product_cat: [
      { id: 1, name: 'Electronics', count: 25, parent: 0 },
      { id: 2, name: 'Computers', count: 15, parent: 1 },
      { id: 3, name: 'Laptops', count: 10, parent: 2 },
      { id: 4, name: 'Clothing', count: 30, parent: 0 },
      { id: 5, name: 'T-shirts', count: 20, parent: 4 },
    ],
  };

  // Get terms for the specified taxonomy, or use categories as default
  const terms = termsByTaxonomy[taxonomy] || termsByTaxonomy['category'];

  // Filter terms based on showOnlyTopLevel
  const filteredTerms = showOnlyTopLevel ? terms.filter((term) => term.parent === 0) : terms;

  // Limit to the requested count
  const limitedTerms = filteredTerms.slice(0, count);

  if (showHierarchy && !showOnlyTopLevel) {
    // For hierarchical display, we need to build a tree
    return buildTermHierarchy(terms, 0, showPostCounts);
  } else {
    // For flat display, just list the terms
    return limitedTerms
      .map((term) => {
        const postCountText = showPostCounts ? ` (${term.count})` : '';
        return `<li><a href="#">${term.name}${postCountText}</a></li>`;
      })
      .join('');
  }
}

/**
 * Build a hierarchical term list
 */
function buildTermHierarchy(
  terms: Array<{ id: number; name: string; count: number; parent: number }>,
  parentId: number,
  showPostCounts: boolean,
  level: number = 0,
): string {
  const children = terms.filter((term) => term.parent === parentId);

  if (children.length === 0) {
    return '';
  }

  return children
    .map((term) => {
      const postCountText = showPostCounts ? ` (${term.count})` : '';
      const padding = level > 0 ? ' style="margin-left: ' + level * 20 + 'px;"' : '';

      const childrenHtml = buildTermHierarchy(terms, term.id, showPostCounts, level + 1);

      if (childrenHtml) {
        return `
        <li${padding}><a href="#">${term.name}${postCountText}</a>
          <ul>
            ${childrenHtml}
          </ul>
        </li>
      `;
      } else {
        return `<li${padding}><a href="#">${term.name}${postCountText}</a></li>`;
      }
    })
    .join('');
}
