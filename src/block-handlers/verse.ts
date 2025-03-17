import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';

/**
 * Handler for the 'core/verse' block
 */
export const verseBlockHandler: BlockHandler = {
  /**
   * Transform a verse block to HTML
   * @param block Verse block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);
    
    // Extract the verse content from innerContent
    let content = '';
    
    // If there's innerHTML, use that
    if (block.innerHTML) {
      content = block.innerHTML;
    } 
    // Otherwise join innerContent
    else if (block.innerContent.length > 0) {
      content = block.innerContent.join('');
    }
    
    // Extract text color if present
    const textColor = block.attrs?.textColor || '';
    const customTextColor = block.attrs?.customTextColor || '';
    
    // Build inline style if custom colors are specified
    let style = '';
    if (customTextColor) {
      style += `color: ${customTextColor};`;
    }
    
    // If we already have a pre tag, we'll modify its attributes
    if (content.trim().startsWith('<pre') && content.trim().endsWith('</pre>')) {
      // Extract existing classes if any
      const existingClassMatch = content.match(/class="([^"]*)"/);
      const existingClass = existingClassMatch ? existingClassMatch[1] : '';
      
      // Add color classes if specified
      let colorClasses = '';
      if (textColor) {
        colorClasses += ` has-${textColor}-color`;
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
          /^<pre/,
          `<pre class="${combinedClasses}"`
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
            /^<pre([^>]*)/,
            `<pre$1 style="${style}"`
          );
        }
      }
      
      return content;
    }
    
    // If no pre tag, create the structure
    // Create attributes for the pre element
    const attributes: Record<string, string> = { class: classes };
    
    // Add color classes if specified
    if (textColor) {
      attributes.class += ` has-${textColor}-color`;
    }
    
    // Add style attribute if custom colors are specified
    if (style) {
      attributes.style = style;
    }
    
    // Wrap in pre
    return createElement('pre', attributes, content);
  },
  
  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'font-serif whitespace-pre-wrap p-4 my-4 border-l-4 border-gray-200',
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
    },
    
    // Bootstrap mappings
    bootstrap: {
      block: 'font-serif white-space-pre-wrap p-3 my-3 border-start border-3',
      align: {
        left: 'text-start',
        center: 'text-center',
        right: 'text-end',
      },
    },
  },
}; 