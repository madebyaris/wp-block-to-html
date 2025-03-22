import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';
import { socialLinkBlockHandler } from './social-link';
import { convertBlocks } from '../core/converter';

/**
 * Handler for the social links container block
 * This block contains individual social link blocks
 */
export const socialLinksBlockHandler: BlockHandler = {
  /**
   * Transform a social links block to HTML
   * @param block Social links block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);

    // Extract attributes
    const iconColor = block.attrs?.iconColor || '';
    const iconColorValue = block.attrs?.iconColorValue || '';
    const iconBackgroundColor = block.attrs?.iconBackgroundColor || '';
    const iconBackgroundColorValue = block.attrs?.iconBackgroundColorValue || '';
    const layout = block.attrs?.layout?.type || 'flex';
    const itemsJustification = block.attrs?.layout?.justifyContent || 'center';

    // Process inner blocks (social links)
    let innerContent: string | unknown = '';

    if (block.innerBlocks && block.innerBlocks.length > 0) {
      // Process each social link block
      const processedBlocks = block.innerBlocks
        .map((innerBlock) => {
          // Handle each social link block
          return socialLinkBlockHandler.transform(innerBlock, options);
        })
        .filter(Boolean); // Remove any empty values

      if (options.outputFormat === 'html') {
        innerContent = processedBlocks.join('');
      } else {
        // For component output, process children through the converter
        innerContent = convertBlocks(block.innerBlocks, {
          ...options,
          // Override the handler for social-link blocks
          blockTransformers: {
            'core/social-link': socialLinkBlockHandler,
            ...(options.blockTransformers || {}),
          },
        });
      }
    }

    // Create style attributes if colors are specified
    const styleObj: Record<string, string> = {};

    if (iconColorValue) {
      styleObj['--wp--social-links-icon-color'] = iconColorValue;
    }

    if (iconBackgroundColorValue) {
      styleObj['--wp--social-links-icon-background'] = iconBackgroundColorValue;
    }

    // Convert style object to string
    const styleStr = Object.entries(styleObj)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');

    // Create container attributes
    const containerAttrs = {
      class: `${classes} ${iconColor ? `has-icon-color has-${iconColor}-color` : ''} ${iconBackgroundColor ? `has-icon-background has-${iconBackgroundColor}-background` : ''} has-${layout}-layout items-justified-${itemsJustification}`,
      style: styleStr,
    };

    // Create the social links container
    return createElement('ul', containerAttrs, innerContent as string);
  },

  // CSS framework class mappings
  cssMapping: {
    default: {
      block: 'wp-block-social-links',
      align: {
        left: 'alignleft',
        center: 'aligncenter',
        right: 'alignright',
      },
    },
    tailwind: {
      block: 'flex flex-wrap gap-2 my-4',
      align: {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
      },
    },
    bootstrap: {
      block: 'd-flex flex-wrap gap-2 my-3',
      align: {
        left: 'justify-content-start',
        center: 'justify-content-center',
        right: 'justify-content-end',
      },
    },
  },
};
