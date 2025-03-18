import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement, processContentWithRenderMode } from '../core/utils';

/**
 * Handler for the 'core/list' block
 */
export const listBlockHandler: BlockHandler = {
  /**
   * Transform a list block to HTML
   * @param block List block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);

    // Determine list type (ordered or unordered)
    const isOrdered = block.attrs.ordered === true;
    const tag = isOrdered ? 'ol' : 'ul';

    // Extract the list content from innerContent
    let content = '';

    // If there's innerHTML, use that
    if (block.innerHTML) {
      content = block.innerHTML;
    }
    // Otherwise join innerContent
    else if (block.innerContent.length > 0) {
      content = block.innerContent.join('');
    }

    // Get the rendering mode from options
    const renderMode = options.renderedContentHandling || 'rebuild';

    // For lists, we handle the items specially in 'rebuild' mode
    if (renderMode === 'rebuild') {
      const listRegex = new RegExp(`^<${tag}[^>]*>(.*)</${tag}>$`, 's');
      const match = content.match(listRegex);

      if (match) {
        // Extract the items from the existing list
        const itemsContent = match[1];
        return createElement(tag, { class: classes }, itemsContent);
      } else {
        // Process list items if we need to build from scratch
        const items = content
          .split('<li>')
          .filter(Boolean)
          .map((item) => {
            return `<li>${item.replace('</li>', '')}</li>`;
          });

        return createElement(tag, { class: classes }, items.join(''));
      }
    }

    // For 'respect' and 'preserve-attrs' modes, use the utility function
    return processContentWithRenderMode(content, tag, { class: classes }, renderMode);
  },

  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: '',
      ordered: 'list-decimal pl-5',
      unordered: 'list-disc pl-5',
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
    },

    // Bootstrap mappings
    bootstrap: {
      block: '',
      ordered: 'list-group list-group-numbered',
      unordered: 'list-group',
      align: {
        left: 'text-start',
        center: 'text-center',
        right: 'text-end',
      },
    },
  },
};
