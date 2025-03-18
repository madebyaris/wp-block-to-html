import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';

/**
 * Handler for the 'core/shortcode' block
 * This provides a basic implementation that preserves the shortcode content
 * Developers can extend this or register their own handler for specific shortcodes
 */
export const shortcodeBlockHandler: BlockHandler = {
  /**
   * Transform a shortcode block to HTML
   * @param block Shortcode block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);

    // Extract shortcode content
    let shortcodeContent = '';

    // If there's content in the block, use that
    if (block.attrs?.content) {
      shortcodeContent = block.attrs.content;
    }
    // Otherwise check innerHTML
    else if (block.innerHTML) {
      shortcodeContent = block.innerHTML;
    }
    // Otherwise join innerContent
    else if (block.innerContent.length > 0) {
      shortcodeContent = block.innerContent.join('');
    }

    // Check if we have a custom shortcode processor in options
    if (
      options.customShortcodeProcessor &&
      typeof options.customShortcodeProcessor === 'function'
    ) {
      try {
        const processedContent = options.customShortcodeProcessor(shortcodeContent, block, options);
        if (processedContent) {
          return processedContent;
        }
      } catch (error) {
        console.error('Error processing shortcode:', error);
      }
    }

    // If no custom processor or it failed, return the shortcode in a container
    // This preserves the shortcode for server-side processing
    return createElement(
      'div',
      {
        class: classes,
        'data-shortcode': 'true',
      },
      shortcodeContent,
    );
  },

  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'my-4 p-2 border border-dashed border-gray-300 bg-gray-50',
      align: {
        left: 'mr-auto',
        center: 'mx-auto',
        right: 'ml-auto',
        wide: 'max-w-screen-xl mx-auto',
        full: 'w-full',
      },
    },

    // Bootstrap mappings
    bootstrap: {
      block: 'my-3 p-2 border border-secondary border-opacity-25 bg-light',
      align: {
        left: 'float-start',
        center: 'd-block mx-auto',
        right: 'float-end',
        wide: 'container-lg',
        full: 'container-fluid',
      },
    },
  },
};
