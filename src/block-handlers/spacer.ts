import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';

/**
 * Handler for the 'core/spacer' block
 */
export const spacerBlockHandler: BlockHandler = {
  /**
   * Transform a spacer block to HTML
   * @param block Spacer block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);

    // Extract the spacer content from innerContent
    let content = '';

    // If there's innerHTML, use that
    if (block.innerHTML) {
      content = block.innerHTML;
    }
    // Otherwise join innerContent
    else if (block.innerContent.length > 0) {
      content = block.innerContent.join('');
    }

    // Get height from attributes or default to 50px
    const height = block.attrs?.height || 50;

    // Create inline style for the spacer
    const style = `height: ${height}px;`;

    // If we already have a div tag, we'll modify its attributes
    if (content.trim().startsWith('<div') && content.trim().endsWith('</div>')) {
      // Extract existing classes if any
      const existingClassMatch = content.match(/class="([^"]*)"/);
      const existingClass = existingClassMatch ? existingClassMatch[1] : '';

      // Combine existing classes with our framework classes
      const combinedClasses = existingClass ? `${existingClass} ${classes}` : classes;

      // Replace or add the class attribute
      if (existingClassMatch) {
        content = content.replace(/class="([^"]*)"/, `class="${combinedClasses}"`);
      } else {
        content = content.replace(/^<div/, `<div class="${classes}"`);
      }

      // Add or replace style attribute
      const styleMatch = content.match(/style="([^"]*)"/);
      if (styleMatch) {
        content = content.replace(/style="([^"]*)"/, `style="${style}"`);
      } else {
        content = content.replace(/^<div([^>]*)/, `<div$1 style="${style}"`);
      }

      return content;
    }

    // If no div tag, create one
    return createElement('div', {
      class: classes,
      style: style,
      'aria-hidden': 'true',
    });
  },

  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'w-full',
    },

    // Bootstrap mappings
    bootstrap: {
      block: 'w-100',
    },
  },
};
