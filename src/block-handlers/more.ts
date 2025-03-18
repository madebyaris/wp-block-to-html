import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';

/**
 * Handler for the 'core/more' block
 */
export const moreBlockHandler: BlockHandler = {
  /**
   * Transform a more block to HTML
   * @param block More block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);

    // Extract more attributes
    const customText = block.attrs?.customText || 'Read more';
    const noTeaser = block.attrs?.noTeaser || false;

    // Create a more element
    const moreContent = `
      <span class="${getMoreTextClass(options.cssFramework)}">${customText}</span>
    `;

    // Create the more container
    return createElement(
      'div',
      {
        class: classes,
        'data-no-teaser': noTeaser ? 'true' : 'false',
      },
      moreContent,
    );
  },

  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'border-t-2 border-gray-300 py-2 my-6 text-center',
      align: {
        left: 'mr-auto',
        center: 'mx-auto',
        right: 'ml-auto',
      },
    },

    // Bootstrap mappings
    bootstrap: {
      block: 'border-top border-secondary py-2 my-4 text-center',
      align: {
        left: 'float-start',
        center: 'd-block mx-auto',
        right: 'float-end',
      },
    },
  },
};

/**
 * Helper function to get the more text class
 */
function getMoreTextClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'text-gray-500 text-sm font-medium';
    case 'bootstrap':
      return 'text-secondary small fw-medium';
    default:
      return 'wp-block-more-text';
  }
}
