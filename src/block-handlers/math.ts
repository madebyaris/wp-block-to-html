import { Block, BlockHandler, ConversionOptions } from '../types';
import { appendClassName, createElement, getBlockClasses } from '../core/utils';

/**
 * Handler for the `core/math` block.
 */
export const mathBlockHandler: BlockHandler = {
  transform(block: Block, options: ConversionOptions): string | unknown {
    const classes = getBlockClasses(block, this, options);
    const content =
      block.innerHTML ||
      block.innerContent.join('') ||
      block.attrs?.mathML ||
      block.attrs?.content ||
      buildLatexFallback(block.attrs?.latex);

    if (!content) {
      return createElement('div', { class: classes, 'data-math-format': 'empty' }, '');
    }

    if (content.trim().startsWith('<div') || content.trim().startsWith('<figure')) {
      return appendClassName(content, classes);
    }

    const format = content.includes('<math') ? 'mathml' : 'latex';
    return createElement('div', { class: classes, 'data-math-format': format }, content);
  },

  cssMapping: {
    tailwind: {
      block: 'my-6 overflow-x-auto text-base leading-relaxed',
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
    },
    bootstrap: {
      block: 'my-4 overflow-auto',
      align: {
        left: 'text-start',
        center: 'text-center',
        right: 'text-end',
      },
    },
  },
};

function buildLatexFallback(latex?: string): string {
  if (!latex) {
    return '';
  }

  return `<code>${escapeHtml(latex)}</code>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
