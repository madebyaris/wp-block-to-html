import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses } from '../core/utils';

/**
 * Handler for the 'core/html' block
 */
export const customHtmlBlockHandler: BlockHandler = {
  /**
   * Transform a custom HTML block to HTML
   * @param block Custom HTML block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);

    // Extract HTML content
    let htmlContent = '';

    // If there's content in the block, use that
    if (block.attrs?.content) {
      htmlContent = block.attrs.content;
    }
    // Otherwise check innerHTML
    else if (block.innerHTML) {
      htmlContent = block.innerHTML;
    }
    // Otherwise join innerContent
    else if (block.innerContent.length > 0) {
      htmlContent = block.innerContent.join('');
    }

    // Check if we should sanitize the HTML
    if (options.sanitizeHtml && typeof options.sanitizeHtml === 'function') {
      try {
        htmlContent = options.sanitizeHtml(htmlContent);
      } catch (error) {
        console.error('Error sanitizing HTML:', error);
      }
    }

    // If we're outputting a component, wrap the HTML in a container
    if (options.outputFormat === 'component') {
      // For component output, we need to use the componentFactory
      // The actual handling of dangerouslySetInnerHTML will be done by the framework adapter
      if (options.componentFactory) {
        return options.componentFactory(
          'div',
          {
            class: classes,
            'data-custom-html': 'true',
            dangerouslySetInnerHTML: htmlContent,
          },
          null,
        );
      }

      // If no componentFactory, fall back to HTML
      return `<div class="${classes}" data-custom-html="true">${htmlContent}</div>`;
    }

    // For HTML output, just return the HTML content
    // If classes are provided, wrap in a div
    if (classes) {
      return `<div class="${classes}" data-custom-html="true">${htmlContent}</div>`;
    }

    return htmlContent;
  },

  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'my-4',
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
      block: 'my-3',
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
