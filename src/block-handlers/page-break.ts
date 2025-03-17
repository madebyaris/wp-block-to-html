import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';

/**
 * Handler for the 'core/nextpage' block (Page Break)
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
    
    // Create a page break element
    const pageBreakContent = `
      <span class="${getPageBreakTextClass(options.cssFramework)}">Page Break</span>
    `;
    
    // Create the page break container
    return createElement('div', { class: classes }, pageBreakContent);
  },
  
  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'border-t-2 border-b-2 border-gray-300 py-2 my-6 text-center',
      align: {
        left: 'mr-auto',
        center: 'mx-auto',
        right: 'ml-auto',
      },
    },
    
    // Bootstrap mappings
    bootstrap: {
      block: 'border-top border-bottom border-secondary py-2 my-4 text-center',
      align: {
        left: 'float-start',
        center: 'd-block mx-auto',
        right: 'float-end',
      },
    },
  },
};

/**
 * Helper function to get the page break text class
 */
function getPageBreakTextClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'text-gray-500 text-sm font-medium';
    case 'bootstrap':
      return 'text-secondary small fw-medium';
    default:
      return 'wp-block-nextpage-text';
  }
} 