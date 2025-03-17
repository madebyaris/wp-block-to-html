import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';
import { convertBlocks } from '../core/converter';

/**
 * Handler for the 'core/columns' block
 */
export const columnsBlockHandler: BlockHandler = {
  /**
   * Transform a columns block to HTML
   * @param block Columns block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);
    
    // Process inner blocks (columns)
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
    
    // If we already have a div tag, we'll modify its attributes
    if (innerContent.trim().startsWith('<div') && innerContent.trim().endsWith('</div>')) {
      // Extract existing classes if any
      const existingClassMatch = innerContent.match(/class="([^"]*)"/);
      const existingClass = existingClassMatch ? existingClassMatch[1] : '';
      
      // Combine existing classes with our framework classes
      const combinedClasses = existingClass
        ? `${existingClass} ${classes}`
        : classes;
      
      // Replace or add the class attribute
      if (existingClassMatch) {
        innerContent = innerContent.replace(
          /class="([^"]*)"/,
          `class="${combinedClasses}"`
        );
      } else {
        innerContent = innerContent.replace(
          /^<div/,
          `<div class="${classes}"`
        );
      }
      
      return innerContent;
    }
    
    // If no div tag, create one
    return createElement('div', { class: classes }, innerContent);
  },
  
  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'flex flex-wrap -mx-2 my-4',
      verticalAlignment: {
        top: 'items-start',
        center: 'items-center',
        bottom: 'items-end',
      },
      isStackedOnMobile: 'md:flex-row flex-col',
      align: {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
        wide: 'max-w-screen-xl mx-auto',
        full: 'w-full',
      },
    },
    
    // Bootstrap mappings
    bootstrap: {
      block: 'row my-3',
      verticalAlignment: {
        top: 'align-items-start',
        center: 'align-items-center',
        bottom: 'align-items-end',
      },
      isStackedOnMobile: 'row',
      align: {
        left: 'justify-content-start',
        center: 'justify-content-center',
        right: 'justify-content-end',
        wide: 'container-lg',
        full: 'container-fluid',
      },
    },
  },
}; 