import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';

/**
 * Handler for the 'core/button' block
 */
export const buttonBlockHandler: BlockHandler = {
  /**
   * Transform a button block to HTML
   * @param block Button block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);
    
    // Extract the button content from innerContent
    let content = '';
    
    // If there's innerHTML, use that
    if (block.innerHTML) {
      content = block.innerHTML;
    } 
    // Otherwise join innerContent
    else if (block.innerContent.length > 0) {
      content = block.innerContent.join('');
    }
    
    // Extract button attributes
    const url = block.attrs?.url || '#';
    const linkTarget = block.attrs?.linkTarget || '';
    const rel = block.attrs?.rel || '';
    const text = block.attrs?.text || '';
    const buttonStyle = block.attrs?.style || {};
    
    // If we already have a button or anchor tag, we'll modify its attributes
    if ((content.trim().startsWith('<button') && content.trim().endsWith('</button>')) ||
        (content.trim().startsWith('<a') && content.trim().endsWith('</a>'))) {
      
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
        // Add class to button or anchor tag
        if (content.trim().startsWith('<button')) {
          content = content.replace(
            /^<button/,
            `<button class="${classes}"`
          );
        } else {
          content = content.replace(
            /^<a/,
            `<a class="${classes}"`
          );
        }
      }
      
      return content;
    }
    
    // If no button or anchor tag, create the structure
    // Determine button text content
    const buttonText = text || content || 'Button';
    
    // Create attributes for the anchor tag
    const attributes: Record<string, string> = {
      href: url,
      class: classes,
    };
    
    // Add optional attributes if they exist
    if (linkTarget) {
      attributes.target = linkTarget;
    }
    
    if (rel) {
      attributes.rel = rel;
    }
    
    // Create the button as an anchor tag
    return createElement('a', attributes, buttonText);
  },
  
  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'inline-block px-4 py-2 rounded font-medium text-center transition-colors',
      // Button styles
      fillDefault: 'bg-blue-600 text-white hover:bg-blue-700',
      fillOutline: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
      // Color variants
      colorDefault: 'bg-blue-600 text-white hover:bg-blue-700',
      colorPrimary: 'bg-blue-600 text-white hover:bg-blue-700',
      colorSecondary: 'bg-gray-600 text-white hover:bg-gray-700',
      colorSuccess: 'bg-green-600 text-white hover:bg-green-700',
      colorDanger: 'bg-red-600 text-white hover:bg-red-700',
      colorWarning: 'bg-yellow-500 text-white hover:bg-yellow-600',
      colorInfo: 'bg-cyan-500 text-white hover:bg-cyan-600',
      // Size variants
      sizeDefault: 'text-base',
      sizeSmall: 'text-sm px-3 py-1',
      sizeMedium: 'text-base px-4 py-2',
      sizeLarge: 'text-lg px-6 py-3',
      // Alignment
      align: {
        left: 'mr-auto',
        center: 'mx-auto',
        right: 'ml-auto',
      },
    },
    
    // Bootstrap mappings
    bootstrap: {
      block: 'btn',
      // Button styles
      fillDefault: 'btn-primary',
      fillOutline: 'btn-outline-primary',
      // Color variants
      colorDefault: 'btn-primary',
      colorPrimary: 'btn-primary',
      colorSecondary: 'btn-secondary',
      colorSuccess: 'btn-success',
      colorDanger: 'btn-danger',
      colorWarning: 'btn-warning',
      colorInfo: 'btn-info',
      // Size variants
      sizeDefault: '',
      sizeSmall: 'btn-sm',
      sizeMedium: '',
      sizeLarge: 'btn-lg',
      // Alignment
      align: {
        left: 'float-start',
        center: 'd-block mx-auto',
        right: 'float-end',
      },
    },
  },
}; 