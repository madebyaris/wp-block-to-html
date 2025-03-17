import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';

/**
 * Handler for the 'core/list' block
 */
export const listBlockHandler: BlockHandler = {
  /**
   * Transform a list block to HTML
   * @param block List block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);
    
    // Determine list type (ordered or unordered)
    const isOrdered = block.attrs.ordered === true;
    const tag = isOrdered ? 'ol' : 'ul';
    
    // Extract the list content from innerContent
    let content = '';
    
    // If there's innerHTML, use that
    if (block.innerHTML) {
      content = block.innerHTML;
    } 
    // Otherwise join innerContent
    else if (block.innerContent.length > 0) {
      content = block.innerContent.join('');
    }
    
    // If we already have a list tag, we'll modify its attributes
    const listRegex = new RegExp(`^<${tag}[^>]*>.*</${tag}>$`, 's');
    if (listRegex.test(content.trim())) {
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
          new RegExp(`^<${tag}`),
          `<${tag} class="${classes}"`
        );
      }
      
      return content;
    }
    
    // Process list items
    // This is a simplistic approach - in a real-world scenario, 
    // we would need to parse the HTML and properly handle nested lists
    const items = content.split('<li>').filter(Boolean).map(item => {
      return `<li>${item.replace('</li>', '')}</li>`;
    });
    
    // Create list with items
    return createElement(tag, { class: classes }, items.join(''));
  },
  
  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: '',
      ordered: 'list-decimal pl-5',
      unordered: 'list-disc pl-5',
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
    },
    
    // Bootstrap mappings
    bootstrap: {
      block: '',
      ordered: 'list-group list-group-numbered',
      unordered: 'list-group',
      align: {
        left: 'text-start',
        center: 'text-center',
        right: 'text-end',
      },
    },
  },
}; 