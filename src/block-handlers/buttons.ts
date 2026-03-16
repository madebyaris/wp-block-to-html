import { Block, BlockHandler, ConversionOptions } from '../types';
import { appendClassName, createElement, getBlockClasses } from '../core/utils';
import { convertBlocks } from '../core/converter';

/**
 * Handler for the `core/buttons` container block.
 */
export const buttonsBlockHandler: BlockHandler = {
  transform(block: Block, options: ConversionOptions): string | unknown {
    const classes = [
      normalizeDefaultClasses(getBlockClasses(block, this, options), block),
      getButtonsAlignmentClass(block, options.cssFramework),
      getButtonsOrientationClass(block, options.cssFramework),
    ]
      .filter(Boolean)
      .join(' ');

    let content = '';

    if (block.innerBlocks && block.innerBlocks.length > 0) {
      content = convertBlocks(block.innerBlocks, options) as string;
    } else if (block.innerHTML) {
      content = block.innerHTML;
    } else if (block.innerContent.length > 0) {
      content = block.innerContent.join('');
    }

    if (content.trim().startsWith('<div')) {
      return appendClassName(content, classes);
    }

    return createElement('div', { class: classes }, content);
  },

  cssMapping: {
    tailwind: {
      block: 'flex flex-wrap gap-4 my-4',
    },
    bootstrap: {
      block: 'd-flex flex-wrap gap-2 my-3',
    },
  },
};

function normalizeDefaultClasses(classes: string, block: Block): string {
  if (!classes) {
    return classes;
  }

  if (!block.attrs?.align) {
    return classes;
  }

  return classes.replace(new RegExp(`\\s*has-text-align-${block.attrs.align}\\b`, 'g'), '').trim();
}

function getButtonsAlignmentClass(block: Block, cssFramework?: string): string {
  const align = block.attrs?.align;
  if (!align) {
    return '';
  }

  switch (cssFramework) {
    case 'tailwind':
      return (
        {
          left: 'justify-start',
          center: 'justify-center',
          right: 'justify-end',
          spaceBetween: 'justify-between',
        }[align] || ''
      );
    case 'bootstrap':
      return (
        {
          left: 'justify-content-start',
          center: 'justify-content-center',
          right: 'justify-content-end',
          spaceBetween: 'justify-content-between',
        }[align] || ''
      );
    default:
      return `is-content-justification-${align}`;
  }
}

function getButtonsOrientationClass(block: Block, cssFramework?: string): string {
  if (block.attrs?.orientation !== 'vertical') {
    return '';
  }

  switch (cssFramework) {
    case 'tailwind':
      return 'flex-col items-start';
    case 'bootstrap':
      return 'flex-column align-items-start';
    default:
      return 'is-vertical';
  }
}
