import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';
import { convertBlocks } from '../core/converter';

/**
 * Handler for the 'core/column' block
 */
export const columnBlockHandler: BlockHandler = {
  /**
   * Transform a column block to HTML
   * @param block Column block data
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
    
    // Get width from attributes if available
    const width = block.attrs?.width;
    let styleAttr = '';
    
    if (width) {
      styleAttr = `width: ${width};`;
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
      
      // Add style attribute if width is specified
      if (width) {
        const styleMatch = innerContent.match(/style="([^"]*)"/);
        if (styleMatch) {
          innerContent = innerContent.replace(
            /style="([^"]*)"/,
            `style="${styleMatch[1]}; ${styleAttr}"`
          );
        } else {
          innerContent = innerContent.replace(
            /^<div([^>]*)/,
            `<div$1 style="${styleAttr}"`
          );
        }
      }
      
      return innerContent;
    }
    
    // If no div tag, create one
    const attributes: Record<string, string> = { class: classes };
    
    if (styleAttr) {
      attributes.style = styleAttr;
    }
    
    return createElement('div', attributes, innerContent);
  },
  
  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'px-2 mb-4',
      width: {
        '25%': 'w-full md:w-1/4',
        '33.33%': 'w-full md:w-1/3',
        '50%': 'w-full md:w-1/2',
        '66.66%': 'w-full md:w-2/3',
        '75%': 'w-full md:w-3/4',
        '100%': 'w-full',
      },
      verticalAlignment: {
        top: 'self-start',
        center: 'self-center',
        bottom: 'self-end',
      },
    },
    
    // Bootstrap mappings
    bootstrap: {
      block: 'col-12',
      width: {
        '25%': 'col-md-3',
        '33.33%': 'col-md-4',
        '50%': 'col-md-6',
        '66.66%': 'col-md-8',
        '75%': 'col-md-9',
        '100%': 'col-12',
      },
      verticalAlignment: {
        top: 'align-self-start',
        center: 'align-self-center',
        bottom: 'align-self-end',
      },
    },
  },
}; 