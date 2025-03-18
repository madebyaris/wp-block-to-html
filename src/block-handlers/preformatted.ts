import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';

/**
 * Handler for the 'core/preformatted' block
 */
export const preformattedBlockHandler: BlockHandler = {
  /**
   * Transform a preformatted block to HTML
   * @param block Preformatted block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);

    // Extract the preformatted content from innerContent
    let content = '';

    // If there's innerHTML, use that
    if (block.innerHTML) {
      content = block.innerHTML;
    }
    // Otherwise join innerContent
    else if (block.innerContent.length > 0) {
      content = block.innerContent.join('');
    }

    // If we already have a pre tag, we'll modify its attributes
    if (content.trim().startsWith('<pre') && content.trim().endsWith('</pre>')) {
      // Extract existing classes if any
      const existingClassMatch = content.match(/class="([^"]*)"/);
      const existingClass = existingClassMatch ? existingClassMatch[1] : '';

      // Combine existing classes with our framework classes
      const combinedClasses = existingClass ? `${existingClass} ${classes}` : classes;

      // Replace or add the class attribute
      if (existingClassMatch) {
        content = content.replace(/class="([^"]*)"/, `class="${combinedClasses}"`);
      } else {
        content = content.replace(/^<pre/, `<pre class="${classes}"`);
      }

      return content;
    }

    // If no pre tag, wrap the content
    return createElement('pre', { class: classes }, content);
  },

  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'bg-gray-50 rounded p-4 my-4 overflow-auto whitespace-pre-wrap',
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
    },

    // Bootstrap mappings
    bootstrap: {
      block: 'bg-light rounded p-3 my-4 overflow-auto pre-wrap',
      align: {
        left: 'text-start',
        center: 'text-center',
        right: 'text-end',
      },
    },
  },
};
