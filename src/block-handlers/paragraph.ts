import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, processContentWithRenderMode, enhanceRenderedHTML } from '../core/utils';

/**
 * Handler for the 'core/paragraph' block
 */
export const paragraphBlockHandler: BlockHandler = {
  /**
   * Transform a paragraph block to HTML
   * @param block Paragraph block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);

    // Extract the paragraph content from innerContent
    let content = '';

    // If there's innerHTML, use that
    if (block.innerHTML) {
      content = block.innerHTML;
    }
    // Otherwise join innerContent
    else if (block.innerContent && block.innerContent.length > 0) {
      content = block.innerContent.join('');
    }

    // If content is empty, use the content attribute if available
    if (content.trim() === '' && block.attrs?.content) {
      content = block.attrs.content;
    }

    // Handle content based on contentHandling option (new method)
    if (options.contentHandling) {
      switch (options.contentHandling) {
        case 'rendered':
          // Use the rendered HTML as-is
          return content;

        case 'hybrid':
          // Apply framework-specific styling to the rendered content
          if (options.cssFramework && options.cssFramework !== 'none') {
            return enhanceRenderedHTML(content, options);
          }
          // If no framework or 'none', fall back to the raw handling
          break;

        case 'raw':
        default:
          // Process using raw block data (default behavior)
          break;
      }
    }

    // Backward compatibility with renderedContentHandling
    const renderMode = options.renderedContentHandling || 'rebuild';

    // Process content based on the rendering mode
    return processContentWithRenderMode(content, 'p', { class: classes }, renderMode);
  },

  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'my-4 px-0',
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
      // Additional paragraph-specific mappings
      dropCap:
        'first-letter:float-left first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:mt-1',
    },

    // Bootstrap mappings
    bootstrap: {
      block: 'mb-4 px-0',
      align: {
        left: 'text-start',
        center: 'text-center',
        right: 'text-end',
      },
      // Additional paragraph-specific mappings
      dropCap:
        'first-letter:float-start first-letter:fs-1 first-letter:fw-bold first-letter:me-2 first-letter:mt-1',
    },
  },
};
