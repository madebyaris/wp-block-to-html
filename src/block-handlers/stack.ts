import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';
import { convertBlocks } from '../core/converter';

/**
 * Handler for the 'core/stack' block
 */
export const stackBlockHandler: BlockHandler = {
  /**
   * Transform a stack block to HTML
   * @param block Stack block data
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
    
    // Extract stack attributes
    const spacing = block.attrs?.spacing || 'default';
    const justifyContent = block.attrs?.justifyContent || 'flex-start';
    const orientation = block.attrs?.orientation || 'vertical';
    
    // If we already have a div with the stack structure, we'll modify its attributes
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
    
    // If no stack structure, create one
    return createElement('div', { class: classes }, innerContent);
  },
  
  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'flex my-4',
      orientation: {
        vertical: 'flex-col',
        horizontal: 'flex-row',
      },
      spacing: {
        none: 'gap-0',
        small: 'gap-2',
        medium: 'gap-4',
        large: 'gap-6',
        default: 'gap-4',
      },
      justifyContent: {
        'flex-start': 'justify-start',
        'center': 'justify-center',
        'flex-end': 'justify-end',
        'space-between': 'justify-between',
        'space-around': 'justify-around',
        'space-evenly': 'justify-evenly',
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
      block: 'd-flex my-3',
      orientation: {
        vertical: 'flex-column',
        horizontal: 'flex-row',
      },
      spacing: {
        none: 'gap-0',
        small: 'gap-2',
        medium: 'gap-3',
        large: 'gap-4',
        default: 'gap-3',
      },
      justifyContent: {
        'flex-start': 'justify-content-start',
        'center': 'justify-content-center',
        'flex-end': 'justify-content-end',
        'space-between': 'justify-content-between',
        'space-around': 'justify-content-around',
        'space-evenly': 'justify-content-evenly',
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