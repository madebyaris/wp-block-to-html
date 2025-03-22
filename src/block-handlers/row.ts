import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';
import { convertBlocks } from '../core/converter';

/**
 * Handler for the 'core/row' block
 */
export const rowBlockHandler: BlockHandler = {
  /**
   * Transform a row block to HTML
   * @param block Row block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
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

    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);

    // If we already have a div with the row structure, we'll modify its attributes
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

    // If no row structure, create one
    return createElement('div', { class: classes }, innerContent);
  },

  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'flex flex-wrap my-4',
      justifyContent: {
        'space-between': 'justify-between',
        center: 'justify-center',
        start: 'justify-start',
        end: 'justify-end',
        'space-around': 'justify-around',
        'space-evenly': 'justify-evenly',
      },
      verticalAlignment: {
        top: 'items-start',
        center: 'items-center',
        bottom: 'items-end',
        stretch: 'items-stretch',
      },
      isStackedOnMobile: 'md:flex-row flex-col',
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
      block: 'row my-3',
      justifyContent: {
        'space-between': 'justify-content-between',
        center: 'justify-content-center',
        start: 'justify-content-start',
        end: 'justify-content-end',
        'space-around': 'justify-content-around',
        'space-evenly': 'justify-content-evenly',
      },
      verticalAlignment: {
        top: 'align-items-start',
        center: 'align-items-center',
        bottom: 'align-items-end',
        stretch: 'align-items-stretch',
      },
      isStackedOnMobile: 'row',
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
