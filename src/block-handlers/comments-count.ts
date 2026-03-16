import { Block, BlockHandler, ConversionOptions } from '../types';
import { appendClassName, createElement, getBlockClasses } from '../core/utils';

/**
 * Handler for the `core/comments-count` block.
 */
export const commentsCountBlockHandler: BlockHandler = {
  transform(block: Block, options: ConversionOptions): string | unknown {
    const classes = getBlockClasses(block, this, options);
    const content = block.innerHTML || block.innerContent.join('');

    if (content.trim().startsWith('<span') || content.trim().startsWith('<p')) {
      return appendClassName(content, classes);
    }

    const count = block.attrs?.count ?? block.attrs?.commentsCount ?? 0;
    const suffix = count === 1 ? 'comment' : 'comments';

    return createElement('span', { class: classes }, `${count} ${suffix}`);
  },

  cssMapping: {
    tailwind: {
      block: 'inline-flex items-center text-sm text-gray-600',
    },
    bootstrap: {
      block: 'text-body-secondary',
    },
  },
};
