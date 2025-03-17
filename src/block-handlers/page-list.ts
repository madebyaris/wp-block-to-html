import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';

/**
 * Handler for the 'core/page-list' block
 */
export const pageListBlockHandler: BlockHandler = {
  /**
   * Transform a page list block to HTML
   * @param block Page list block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);
    
    // Extract page list attributes
    const parentPageId = block.attrs?.parentPageId || 0;
    const showHierarchy = block.attrs?.showHierarchy || true;
    
    // Create a placeholder for the page list
    // In a real implementation, this would be replaced with actual page data
    let content = '';
    
    // Check if we have a custom page list processor in options
    if (options.customPageListProcessor && typeof options.customPageListProcessor === 'function') {
      try {
        const processedContent = options.customPageListProcessor(block, options);
        if (processedContent) {
          return processedContent;
        }
      } catch (error) {
        console.error('Error processing page list:', error);
      }
    }
    
    // If no custom processor or it failed, return a placeholder
    content = `
      <ul class="${getPageListClass(options.cssFramework)}">
        ${generatePagePlaceholders(5, parentPageId, showHierarchy)}
      </ul>
    `;
    
    // Create the page list container
    return createElement('div', { 
      class: classes,
      'data-parent-page-id': parentPageId,
      'data-show-hierarchy': showHierarchy ? 'true' : 'false'
    }, content);
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
function getPageListClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'list-disc pl-5 space-y-2';
    case 'bootstrap':
      return 'list-unstyled';
    default:
      return 'wp-block-page-list';
  }
}

/**
 * Generate placeholder page items
 */
function generatePagePlaceholders(
  count: number,
  parentPageId: number,
  showHierarchy: boolean
): string {
  // Sample pages
  const pages = [
    { id: 1, title: 'Home', parent: 0 },
    { id: 2, title: 'About Us', parent: 0 },
    { id: 3, title: 'Our Team', parent: 2 },
    { id: 4, title: 'Our History', parent: 2 },
    { id: 5, title: 'Services', parent: 0 },
    { id: 6, title: 'Web Design', parent: 5 },
    { id: 7, title: 'SEO', parent: 5 },
    { id: 8, title: 'Contact', parent: 0 },
  ];
  
  // Filter pages based on parentPageId
  const filteredPages = parentPageId === 0
    ? pages.filter(page => page.parent === 0)
    : pages.filter(page => page.parent === parentPageId);
  
  // Limit to the requested count
  const limitedPages = filteredPages.slice(0, count);
  
  if (showHierarchy) {
    // For hierarchical display, we need to build a tree
    return buildPageHierarchy(pages, parentPageId);
  } else {
    // For flat display, just list the pages
    return limitedPages.map(page => {
      return `<li><a href="#">${page.title}</a></li>`;
    }).join('');
  }
}

/**
 * Build a hierarchical page list
 */
function buildPageHierarchy(
  pages: Array<{id: number, title: string, parent: number}>,
  parentId: number,
  level: number = 0
): string {
  const children = pages.filter(page => page.parent === parentId);
  
  if (children.length === 0) {
    return '';
  }
  
  return children.map(page => {
    const padding = level > 0 ? ' style="margin-left: ' + (level * 20) + 'px;"' : '';
    
    const childrenHtml = buildPageHierarchy(pages, page.id, level + 1);
    
    if (childrenHtml) {
      return `
        <li${padding}><a href="#">${page.title}</a>
          <ul>
            ${childrenHtml}
          </ul>
        </li>
      `;
    } else {
      return `<li${padding}><a href="#">${page.title}</a></li>`;
    }
  }).join('');
} 