import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';

/**
 * Handler for the 'core/paragraph' block
 */
export const paragraphBlockHandler: BlockHandler = {
  /**
   * Transform a paragraph block to HTML
   * @param block Paragraph block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);
    
    // Extract the paragraph content from innerContent
    let content = '';
    
    // If there's innerHTML, use that
    if (block.innerHTML) {
      content = block.innerHTML;
    } 
    // Otherwise join innerContent
    else if (block.innerContent.length > 0) {
      content = block.innerContent.join('');
    }
    
    // If we already have a <p> tag, we'll modify its attributes
    if (content.trim().startsWith('<p') && content.trim().endsWith('</p>')) {
      // Extract existing classes if any
      const existingClassMatch = content.match(/class="([^"]*)"/);
      const existingClass = existingClassMatch ? existingClassMatch[1] : '';
      
      // Combine existing classes with our framework classes
      const combinedClasses = existingClass
        ? `${existingClass} ${classes}`
        : classes;
      
      // Replace the <p> tag or add class attribute
      if (existingClassMatch) {
        content = content.replace(
          /class="([^"]*)"/,
          `class="${combinedClasses}"`
        );
      } else {
        content = content.replace(
          /^<p/,
          `<p class="${classes}"`
        );
      }
      
      return content;
    }
    
    // If no <p> tag, wrap the content
    return createElement('p', { class: classes }, content);
  },
  
  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: '',
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
      // Additional paragraph-specific mappings
      dropCap: 'first-letter:float-left first-letter:text-7xl first-letter:font-bold first-letter:mr-3',
    },
    
    // Bootstrap mappings
    bootstrap: {
      block: '',
      align: {
        left: 'text-start',
        center: 'text-center',
        right: 'text-end',
      },
      // Additional paragraph-specific mappings
      dropCap: 'first-letter:float-left first-letter:font-size-4 first-letter:font-weight-bold',
    },
  },
}; 