import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';
import { convertBlocks } from '../core/converter';

/**
 * Handler for the 'core/grid' block
 */
export const gridBlockHandler: BlockHandler = {
  /**
   * Transform a grid block to HTML
   * @param block Grid block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);

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

    // Extract grid attributes
    // No attributes needed for current implementation

    // If we already have a div with the grid structure, we'll modify its attributes
    if (innerContent.trim().startsWith('<div') && innerContent.trim().endsWith('</div>')) {
      // Extract existing classes if any
      const existingClassMatch = innerContent.match(/class="([^"]*)"/);
      const existingClass = existingClassMatch ? existingClassMatch[1] : '';

      // Combine existing classes with our framework classes
      const combinedClasses = existingClass ? `${existingClass} ${classes}` : classes;

      // Replace or add the class attribute
      if (existingClassMatch) {
        innerContent = innerContent.replace(/class="([^"]*)"/, `class="${combinedClasses}"`);
      } else {
        innerContent = innerContent.replace(/^<div/, `<div class="${classes}"`);
      }

      return innerContent;
    }

    // If no grid structure, create one
    return createElement('div', { class: classes }, innerContent);
  },

  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'grid my-4',
      columnCount: {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        5: 'grid-cols-5',
        6: 'grid-cols-6',
      },
      rowGap: {
        none: 'gap-y-0',
        small: 'gap-y-2',
        medium: 'gap-y-4',
        large: 'gap-y-6',
        default: 'gap-y-4',
      },
      columnGap: {
        none: 'gap-x-0',
        small: 'gap-x-2',
        medium: 'gap-x-4',
        large: 'gap-x-6',
        default: 'gap-x-4',
      },
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
      block: 'row row-cols-1 my-3',
      columnCount: {
        1: 'row-cols-1',
        2: 'row-cols-md-2',
        3: 'row-cols-md-3',
        4: 'row-cols-md-4',
        5: 'row-cols-md-5',
        6: 'row-cols-md-6',
      },
      rowGap: {
        none: 'g-0',
        small: 'g-2',
        medium: 'g-3',
        large: 'g-4',
        default: 'g-3',
      },
      columnGap: {
        none: 'g-0',
        small: 'g-2',
        medium: 'g-3',
        large: 'g-4',
        default: 'g-3',
      },
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
