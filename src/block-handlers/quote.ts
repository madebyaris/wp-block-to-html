import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';

/**
 * Handler for the 'core/quote' block
 */
export const quoteBlockHandler: BlockHandler = {
  /**
   * Transform a quote block to HTML
   * @param block Quote block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);
    
    // Extract the quote content from innerContent
    let content = '';
    
    // If there's innerHTML, use that
    if (block.innerHTML) {
      content = block.innerHTML;
    } 
    // Otherwise join innerContent
    else if (block.innerContent.length > 0) {
      content = block.innerContent.join('');
    }
    
    // Extract citation if present
    const citation = block.attrs.citation || '';
    
    // If we already have a blockquote tag, we'll modify its attributes
    if (content.trim().startsWith('<blockquote') && content.trim().endsWith('</blockquote>')) {
      // Extract existing classes if any
      const existingClassMatch = content.match(/class="([^"]*)"/);
      const existingClass = existingClassMatch ? existingClassMatch[1] : '';
      
      // Combine existing classes with our framework classes
      const combinedClasses = existingClass
        ? `${existingClass} ${classes}`
        : classes;
      
      // Replace or add the class attribute
      if (existingClassMatch) {
        content = content.replace(
          /class="([^"]*)"/,
          `class="${combinedClasses}"`
        );
      } else {
        content = content.replace(
          /^<blockquote/,
          `<blockquote class="${classes}"`
        );
      }
      
      // If there's a citation and it's not already present, add it
      if (citation && !content.includes('<cite>')) {
        content = content.replace(
          '</blockquote>',
          `<cite>${citation}</cite></blockquote>`
        );
      }
      
      return content;
    }
    
    // If no blockquote tag, create the structure
    let quoteContent = content;
    
    // Add citation if present
    if (citation) {
      quoteContent += `<cite>${citation}</cite>`;
    }
    
    // Wrap in blockquote
    return createElement('blockquote', { class: classes }, quoteContent);
  },
  
  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'border-l-4 border-gray-300 pl-4 my-4',
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
      style: {
        default: 'italic',
        plain: '',
      },
      citation: 'block mt-2 text-sm text-gray-600',
    },
    
    // Bootstrap mappings
    bootstrap: {
      block: 'blockquote border-start border-4 ps-4 my-4',
      align: {
        left: 'text-start',
        center: 'text-center',
        right: 'text-end',
      },
      style: {
        default: 'fst-italic',
        plain: '',
      },
      citation: 'd-block mt-2 small text-muted',
    },
  },
}; 