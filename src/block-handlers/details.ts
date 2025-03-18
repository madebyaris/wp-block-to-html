import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';
import { convertBlocks } from '../core/converter';

/**
 * Handler for the 'core/details' block
 */
export const detailsBlockHandler: BlockHandler = {
  /**
   * Transform a details block to HTML
   * @param block Details block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);

    // Extract the summary text from attributes
    const summary = block.attrs?.summary || 'Details';

    // Process inner blocks if any
    let innerContent = '';
    if (block.innerBlocks && block.innerBlocks.length > 0) {
      // Convert inner blocks using the converter
      innerContent = convertBlocks(block.innerBlocks, options) as string;
    } else {
      // If there's innerHTML, use that
      if (block.innerHTML) {
        innerContent = block.innerHTML;
      }
      // Otherwise join innerContent
      else if (block.innerContent.length > 0) {
        innerContent = block.innerContent.join('');
      }
    }

    // If we already have a details tag, we'll modify its attributes
    if (innerContent.trim().startsWith('<details') && innerContent.trim().endsWith('</details>')) {
      // Extract existing classes if any
      const existingClassMatch = innerContent.match(/class="([^"]*)"/);
      const existingClass = existingClassMatch ? existingClassMatch[1] : '';

      // Combine existing classes with our framework classes
      const combinedClasses = existingClass ? `${existingClass} ${classes}` : classes;

      // Replace or add the class attribute
      if (existingClassMatch) {
        innerContent = innerContent.replace(/class="([^"]*)"/, `class="${combinedClasses}"`);
      } else {
        innerContent = innerContent.replace(/^<details/, `<details class="${classes}"`);
      }

      return innerContent;
    }

    // If no details tag, create one
    // Create summary element
    const summaryElement = createElement(
      'summary',
      { class: getSummaryClass(options.cssFramework) },
      summary,
    );

    // Create details element with summary and content
    return createElement('details', { class: classes }, `${summaryElement}${innerContent}`);
  },

  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'my-4 border border-gray-200 rounded p-2',
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
    },

    // Bootstrap mappings
    bootstrap: {
      block: 'my-3 border rounded p-2',
      align: {
        left: 'text-start',
        center: 'text-center',
        right: 'text-end',
      },
    },
  },
};

/**
 * Helper function to get the summary class
 */
function getSummaryClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'font-medium cursor-pointer p-1 hover:bg-gray-50';
    case 'bootstrap':
      return 'fw-medium cursor-pointer p-1 hover-bg-light';
    default:
      return '';
  }
}
