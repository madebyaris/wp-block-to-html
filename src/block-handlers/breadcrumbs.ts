import { Block, BlockHandler, ConversionOptions } from '../types';
import { appendClassName, createElement, getBlockClasses } from '../core/utils';

/**
 * Handler for the `core/breadcrumbs` block.
 */
export const breadcrumbsBlockHandler: BlockHandler = {
  transform(block: Block, options: ConversionOptions): string | unknown {
    const classes = getBlockClasses(block, this, options);
    const content = block.innerHTML || block.innerContent.join('');

    if (content.trim().startsWith('<nav')) {
      return appendClassName(content, classes);
    }

    const separator = block.attrs?.separator || '/';
    const items = ['Home', 'Section', 'Current Page']
      .map((label, index, all) => {
        const isCurrent = index === all.length - 1;
        if (isCurrent) {
          return `<li aria-current="page">${label}</li>`;
        }

        return `<li><a href="#">${label}</a> <span aria-hidden="true">${separator}</span></li>`;
      })
      .join('');

    return createElement(
      'nav',
      {
        class: classes,
        'aria-label': 'Breadcrumb',
      },
      `<ol>${items}</ol>`,
    );
  },

  cssMapping: {
    tailwind: {
      block: 'my-4 text-sm text-gray-600',
    },
    bootstrap: {
      block: 'my-3 small text-body-secondary',
    },
  },
};
