import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';

/**
 * Handler for the 'core/separator' block
 */
export const separatorBlockHandler: BlockHandler = {
  /**
   * Transform a separator block to HTML
   * @param block Separator block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);

    // Extract the separator content from innerContent
    let content = '';

    // If there's innerHTML, use that
    if (block.innerHTML) {
      content = block.innerHTML;
    }
    // Otherwise join innerContent
    else if (block.innerContent.length > 0) {
      content = block.innerContent.join('');
    }

    // If we already have an hr tag, we'll modify its attributes
    if (content.trim().startsWith('<hr') && content.trim().endsWith('>')) {
      // Extract existing classes if any
      const existingClassMatch = content.match(/class="([^"]*)"/);
      const existingClass = existingClassMatch ? existingClassMatch[1] : '';

      // Combine existing classes with our framework classes
      const combinedClasses = existingClass ? `${existingClass} ${classes}` : classes;

      // Replace or add the class attribute
      if (existingClassMatch) {
        content = content.replace(/class="([^"]*)"/, `class="${combinedClasses}"`);
      } else {
        content = content.replace(/^<hr/, `<hr class="${classes}"`);
      }

      return content;
    }

    // If no hr tag, create one
    return createElement('hr', { class: classes });
  },

  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'my-8 border-t border-gray-300',
      style: {
        default: 'border-t border-gray-300',
        wide: 'border-t-2 border-gray-300',
        dots: 'border-t border-dotted border-gray-300',
      },
      align: {
        left: 'mr-auto ml-0 w-1/4',
        center: 'mx-auto w-1/2',
        right: 'ml-auto mr-0 w-1/4',
      },
    },

    // Bootstrap mappings
    bootstrap: {
      block: 'my-4 border-top',
      style: {
        default: 'border-top',
        wide: 'border-top border-2',
        dots: 'border-top border-dotted',
      },
      align: {
        left: 'float-start w-25',
        center: 'mx-auto w-50',
        right: 'float-end w-25',
      },
    },
  },
};
