import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';

/**
 * Handler for the 'core/pullquote' block
 */
export const pullquoteBlockHandler: BlockHandler = {
  /**
   * Transform a pullquote block to HTML
   * @param block Pullquote block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);
    
    // Extract the pullquote content from innerContent
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
    const citation = block.attrs?.citation || '';
    const value = block.attrs?.value || '';
    
    // Extract text color and background color if present
    const textColor = block.attrs?.textColor || '';
    const backgroundColor = block.attrs?.backgroundColor || '';
    const customTextColor = block.attrs?.customTextColor || '';
    const customBackgroundColor = block.attrs?.customBackgroundColor || '';
    
    // Build inline style if custom colors are specified
    let style = '';
    if (customTextColor) {
      style += `color: ${customTextColor};`;
    }
    if (customBackgroundColor) {
      style += `background-color: ${customBackgroundColor};`;
    }
    
    // If we already have a blockquote tag, we'll modify its attributes
    if (content.trim().startsWith('<blockquote') && content.trim().endsWith('</blockquote>')) {
      // Extract existing classes if any
      const existingClassMatch = content.match(/class="([^"]*)"/);
      const existingClass = existingClassMatch ? existingClassMatch[1] : '';
      
      // Add color classes if specified
      let colorClasses = '';
      if (textColor) {
        colorClasses += ` has-${textColor}-color`;
      }
      if (backgroundColor) {
        colorClasses += ` has-${backgroundColor}-background-color`;
      }
      
      // Combine existing classes with our framework classes and color classes
      const combinedClasses = existingClass
        ? `${existingClass} ${classes}${colorClasses}`
        : `${classes}${colorClasses}`;
      
      // Replace or add the class attribute
      if (existingClassMatch) {
        content = content.replace(
          /class="([^"]*)"/,
          `class="${combinedClasses}"`
        );
      } else {
        content = content.replace(
          /^<blockquote/,
          `<blockquote class="${combinedClasses}"`
        );
      }
      
      // Add style attribute if custom colors are specified
      if (style) {
        const styleMatch = content.match(/style="([^"]*)"/);
        if (styleMatch) {
          content = content.replace(
            /style="([^"]*)"/,
            `style="${styleMatch[1]}; ${style}"`
          );
        } else {
          content = content.replace(
            /^<blockquote([^>]*)/,
            `<blockquote$1 style="${style}"`
          );
        }
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
    let quoteContent = value || content;
    
    // Add citation if present
    if (citation) {
      quoteContent += `<cite>${citation}</cite>`;
    }
    
    // Create attributes for the blockquote
    const attributes: Record<string, string> = { class: classes };
    
    // Add color classes if specified
    if (textColor) {
      attributes.class += ` has-${textColor}-color`;
    }
    if (backgroundColor) {
      attributes.class += ` has-${backgroundColor}-background-color`;
    }
    
    // Add style attribute if custom colors are specified
    if (style) {
      attributes.style = style;
    }
    
    // Wrap in blockquote
    return createElement('blockquote', attributes, quoteContent);
  },
  
  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'text-xl italic font-medium border-l-0 border-r-0 border-t-4 border-b-4 border-gray-300 py-6 my-8 text-center',
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
      citation: 'block mt-4 text-base font-normal text-gray-600 not-italic',
    },
    
    // Bootstrap mappings
    bootstrap: {
      block: 'blockquote border-top border-bottom border-4 py-4 my-5 text-center',
      align: {
        left: 'text-start',
        center: 'text-center',
        right: 'text-end',
      },
      citation: 'd-block mt-3 fs-6 fw-normal text-muted fst-normal',
    },
  },
}; 