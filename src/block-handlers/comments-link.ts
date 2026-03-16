import { Block, BlockHandler, ConversionOptions } from '../types';
import { appendClassName, createElement, getBlockClasses } from '../core/utils';

/**
 * Handler for the `core/comments-link` block.
 */
export const commentsLinkBlockHandler: BlockHandler = {
  transform(block: Block, options: ConversionOptions): string | unknown {
    const classes = getBlockClasses(block, this, options);
    const content = block.innerHTML || block.innerContent.join('');

    if (content.trim().startsWith('<a')) {
      return appendClassName(content, classes);
    }

    const label =
      block.attrs?.text || block.attrs?.commentsText || block.attrs?.label || 'View comments';

    return createElement(
      'a',
      {
        class: classes,
        href: block.attrs?.url || '#comments',
      },
      label,
    );
  },

  cssMapping: {
    tailwind: {
      block: 'inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700',
    },
    bootstrap: {
      block: 'link-primary text-decoration-none',
    },
  },
};
