import { Block, BlockHandler, ConversionOptions } from '../types';
import { createElement, getBlockClasses } from '../core/utils';

/**
 * Handler for the `core/latest-comments` block.
 */
export const latestCommentsBlockHandler: BlockHandler = {
  transform(block: Block, options: ConversionOptions): string | unknown {
    const classes = getBlockClasses(block, this, options);
    const renderedContent = block.innerHTML || block.innerContent.join('');

    if (renderedContent.includes('<li') || renderedContent.includes('wp-block-latest-comments')) {
      return createElement('div', { class: classes }, renderedContent);
    }

    const commentsToShow = block.attrs?.commentsToShow || 5;
    const displayAvatar = block.attrs?.displayAvatar ?? true;
    const displayDate = block.attrs?.displayDate ?? true;
    const displayExcerpt = block.attrs?.displayExcerpt ?? false;

    const placeholderItems = Array.from({ length: commentsToShow }, (_, index) => {
      return `
        <li class="${getLatestCommentsItemClass(options.cssFramework)}">
          ${
            displayAvatar
              ? `<span class="${getLatestCommentsAvatarClass(options.cssFramework)}" aria-hidden="true"></span>`
              : ''
          }
          <div class="${getLatestCommentsBodyClass(options.cssFramework)}">
            <strong>Commenter ${index + 1}</strong>
            ${displayDate ? `<time datetime="2026-03-16">March 16, 2026</time>` : ''}
            ${
              displayExcerpt
                ? '<p>This is placeholder latest comment text used when no rendered comments are available.</p>'
                : ''
            }
          </div>
        </li>
      `;
    }).join('');

    return createElement(
      'div',
      {
        class: classes,
        'data-comments-to-show': commentsToShow,
      },
      `<ol class="${getLatestCommentsListClass(options.cssFramework)}">${placeholderItems}</ol>`,
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

function getLatestCommentsListClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'space-y-4 list-none pl-0';
    case 'bootstrap':
      return 'list-unstyled';
    default:
      return 'wp-block-latest-comments';
  }
}

function getLatestCommentsItemClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'flex gap-3 items-start';
    case 'bootstrap':
      return 'd-flex gap-3 align-items-start';
    default:
      return 'wp-block-latest-comments__comment';
  }
}

function getLatestCommentsAvatarClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'inline-block h-10 w-10 rounded-full bg-gray-200';
    case 'bootstrap':
      return 'rounded-circle bg-light d-inline-block';
    default:
      return 'wp-block-latest-comments__comment-avatar';
  }
}

function getLatestCommentsBodyClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'flex-1 space-y-1';
    case 'bootstrap':
      return 'flex-grow-1';
    default:
      return 'wp-block-latest-comments__comment-body';
  }
}
