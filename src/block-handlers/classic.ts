import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses } from '../core/utils';

/**
 * Handler for the 'core/freeform' block (Classic Editor)
 */
export const classicBlockHandler: BlockHandler = {
  /**
   * Transform a classic editor block to HTML
   * @param block Classic editor block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);
    
    // Extract the content from innerContent
    let content = '';
    
    // If there's innerHTML, use that
    if (block.innerHTML) {
      content = block.innerHTML;
    } 
    // Otherwise join innerContent
    else if (block.innerContent.length > 0) {
      content = block.innerContent.join('');
    }
    
    // For classic editor content, we generally want to preserve the HTML as is
    // We'll just wrap it in a div with our framework classes if needed
    if (options.cssFramework !== 'none' && classes) {
      return `<div class="${classes}">${content}</div>`;
    }
    
    // Otherwise, return the content as is
    return content;
  },
  
  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'my-4',
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
    },
    
    // Bootstrap mappings
    bootstrap: {
      block: 'my-3',
      align: {
        left: 'text-start',
        center: 'text-center',
        right: 'text-end',
      },
    },
  },
}; 