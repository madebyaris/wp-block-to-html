import { Block, BlockHandler, ConversionOptions } from '../types';
import { appendClassName, createElement, getBlockClasses } from '../core/utils';
import { convertBlocks } from '../core/converter';

/**
 * Handler for the `core/terms-query` block.
 */
export const termsQueryBlockHandler: BlockHandler = {
  transform(block: Block, options: ConversionOptions): string | unknown {
    const classes = getBlockClasses(block, this, options);

    let content = '';
    if (block.innerBlocks && block.innerBlocks.length > 0) {
      content = convertBlocks(block.innerBlocks, options) as string;
    } else if (block.innerHTML) {
      content = block.innerHTML;
    } else if (block.innerContent.length > 0) {
      content = block.innerContent.join('');
    } else {
      content = buildPlaceholderTerms(options.cssFramework);
    }

    if (content.trim().startsWith('<div') || content.trim().startsWith('<ul')) {
      return appendClassName(content, classes);
    }

    return createElement(
      'div',
      {
        class: classes,
        'data-taxonomy': block.attrs?.query?.taxonomy || block.attrs?.taxonomy || 'category',
      },
      content,
    );
  },

  cssMapping: {
    tailwind: {
      block: 'my-6',
    },
    bootstrap: {
      block: 'my-4',
    },
  },
};

function buildPlaceholderTerms(cssFramework?: string): string {
  const listClass =
    cssFramework === 'tailwind'
      ? 'space-y-2 list-none pl-0'
      : cssFramework === 'bootstrap'
        ? 'list-unstyled'
        : 'wp-block-terms-query';

  return `
    <ul class="${listClass}">
      <li><a href="#">Category One</a></li>
      <li><a href="#">Category Two</a></li>
      <li><a href="#">Category Three</a></li>
    </ul>
  `;
}
