import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';

/**
 * Handler for the 'core/table' block
 */
export const tableBlockHandler: BlockHandler = {
  /**
   * Transform a table block to HTML
   * @param block Table block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);
    
    // Extract the table content from innerContent
    let content = '';
    
    // If there's innerHTML, use that
    if (block.innerHTML) {
      content = block.innerHTML;
    } 
    // Otherwise join innerContent
    else if (block.innerContent.length > 0) {
      content = block.innerContent.join('');
    }
    
    // Check if the block has a caption
    const hasCaption = block.attrs?.caption && block.attrs.caption.length > 0;
    const caption = hasCaption ? block.attrs.caption : '';
    
    // Check if the table has a header
    const hasHeader = block.attrs?.hasFixedLayout === true;
    
    // If we already have a table tag, we'll modify its attributes
    if (content.trim().startsWith('<table') && content.trim().endsWith('</table>')) {
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
          /^<table/,
          `<table class="${classes}"`
        );
      }
      
      // Add caption if it doesn't exist and is provided in attrs
      if (hasCaption && !content.includes('<caption>')) {
        content = content.replace(
          /^<table[^>]*>/,
          `$&<caption>${caption}</caption>`
        );
      }
      
      return content;
    }
    
    // If no table tag, create the structure
    // This is a simplified approach - in a real-world scenario,
    // we would need to parse the content and create a proper table structure
    
    // If content is empty, create a basic table structure
    if (!content.trim()) {
      // Create a basic table with header if specified
      let tableContent = '';
      
      if (hasHeader) {
        tableContent += '<thead><tr><th>Header 1</th><th>Header 2</th></tr></thead>';
      }
      
      tableContent += '<tbody><tr><td>Cell 1</td><td>Cell 2</td></tr></tbody>';
      
      // Add caption if provided
      if (hasCaption) {
        tableContent = `<caption>${caption}</caption>${tableContent}`;
      }
      
      return createElement('table', { class: classes }, tableContent);
    }
    
    // If content exists but is not wrapped in a table tag
    // Wrap it in a table structure
    let tableContent = content;
    
    // Add caption if provided
    if (hasCaption) {
      tableContent = `<caption>${caption}</caption>${tableContent}`;
    }
    
    return createElement('table', { class: classes }, tableContent);
  },
  
  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'min-w-full border-collapse my-4',
      hasFixedLayout: 'table-fixed',
      stripes: 'stripe-table',
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
      // Additional classes for table elements
      head: 'bg-gray-100',
      cell: 'border px-4 py-2',
      caption: 'text-sm text-gray-600 mb-2',
    },
    
    // Bootstrap mappings
    bootstrap: {
      block: 'table my-4',
      hasFixedLayout: 'table-fixed',
      stripes: 'table-striped',
      align: {
        left: 'text-start',
        center: 'text-center',
        right: 'text-end',
      },
      // Additional classes for table elements
      head: 'table-light',
      cell: '',
      caption: 'caption-top',
    },
  },
}; 