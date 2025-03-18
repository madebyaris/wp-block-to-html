import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, processContentWithRenderMode } from '../core/utils';

/**
 * Handler for the 'core/heading' block
 */
export const headingBlockHandler: BlockHandler = {
  /**
   * Transform a heading block to HTML
   * @param block Heading block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);

    // Determine heading level (h1-h6), default to h2
    const level = block.attrs?.level || 2;
    const tag = `h${level}`;

    // Extract the heading content from innerContent
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

    // Process content based on the rendering mode
    return processContentWithRenderMode(content, tag, { class: classes }, renderMode);
  },

  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: '',
      level: {
        1: 'text-4xl font-bold',
        2: 'text-3xl font-bold',
        3: 'text-2xl font-bold',
        4: 'text-xl font-bold',
        5: 'text-lg font-bold',
        6: 'text-base font-bold',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
    },

    // Bootstrap mappings
    bootstrap: {
      block: '',
      level: {
        1: 'h1',
        2: 'h2',
        3: 'h3',
        4: 'h4',
        5: 'h5',
        6: 'h6',
      },
      align: {
        left: 'text-start',
        center: 'text-center',
        right: 'text-end',
      },
    },
  },
};
