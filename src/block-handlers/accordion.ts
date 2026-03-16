import { Block, BlockHandler, ConversionOptions } from '../types';
import { appendClassName, createElement, getBlockClasses } from '../core/utils';
import { convertBlocks } from '../core/converter';

/**
 * Handler for the `core/accordion` block.
 */
export const accordionBlockHandler: BlockHandler = {
  transform(block: Block, options: ConversionOptions): string | unknown {
    const classes = getBlockClasses(block, this, options);
    const content = getAccordionContent(block, options);

    if (content.trim().startsWith('<div') || content.trim().startsWith('<details')) {
      return appendClassName(content, classes);
    }

    return createElement('div', { class: classes }, content);
  },

  cssMapping: {
    tailwind: {
      block: 'my-4 divide-y divide-gray-200 rounded border border-gray-200',
    },
    bootstrap: {
      block: 'accordion my-4',
    },
  },
};

function getAccordionContent(block: Block, options: ConversionOptions): string {
  if (block.innerBlocks && block.innerBlocks.length > 0) {
    return convertBlocks(block.innerBlocks, options) as string;
  }

  if (block.innerHTML) {
    return block.innerHTML;
  }

  return block.innerContent.join('');
}
