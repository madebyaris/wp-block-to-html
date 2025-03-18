import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';
import { convertBlocks } from '../core/converter';

/**
 * Handler for the 'core/media-text' block
 */
export const mediaTextBlockHandler: BlockHandler = {
  /**
   * Transform a media-text block to HTML
   * @param block Media-text block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);

    // Process inner blocks if any (text content)
    let textContent = '';
    if (block.innerBlocks && block.innerBlocks.length > 0) {
      // Convert inner blocks using the converter
      textContent = convertBlocks(block.innerBlocks, options) as string;
    } else {
      // If there's innerHTML, use that
      if (block.innerHTML) {
        textContent = block.innerHTML;
      }
      // Otherwise join innerContent
      else if (block.innerContent.length > 0) {
        textContent = block.innerContent.join('');
      }
    }

    // Extract media-text attributes
    const mediaPosition = block.attrs?.mediaPosition || 'left';
    const mediaId = block.attrs?.mediaId;
    const mediaUrl = block.attrs?.mediaUrl || '';
    const mediaType = block.attrs?.mediaType || 'image';
    const mediaWidth = block.attrs?.mediaWidth || 50;
    const isStackedOnMobile = block.attrs?.isStackedOnMobile !== false;
    const verticalAlignment = block.attrs?.verticalAlignment || 'center';
    const backgroundColor = block.attrs?.backgroundColor || '';
    const customBackgroundColor = block.attrs?.customBackgroundColor || '';

    // If we already have a div with the media-text structure, we'll modify its attributes
    if (textContent.trim().startsWith('<div') && textContent.trim().endsWith('</div>')) {
      // Extract existing classes if any
      const existingClassMatch = textContent.match(/class="([^"]*)"/);
      const existingClass = existingClassMatch ? existingClassMatch[1] : '';

      // Add color classes if specified
      let colorClasses = '';
      if (backgroundColor) {
        colorClasses += ` has-${backgroundColor}-background-color`;
      }

      // Combine existing classes with our framework classes and color classes
      const combinedClasses = existingClass
        ? `${existingClass} ${classes}${colorClasses}`
        : `${classes}${colorClasses}`;

      // Replace or add the class attribute
      if (existingClassMatch) {
        textContent = textContent.replace(/class="([^"]*)"/, `class="${combinedClasses}"`);
      } else {
        textContent = textContent.replace(/^<div/, `<div class="${combinedClasses}"`);
      }

      // Add style attribute if custom background color is specified
      if (customBackgroundColor) {
        const styleMatch = textContent.match(/style="([^"]*)"/);
        if (styleMatch) {
          textContent = textContent.replace(
            /style="([^"]*)"/,
            `style="${styleMatch[1]}; background-color: ${customBackgroundColor};"`,
          );
        } else {
          textContent = textContent.replace(
            /^<div([^>]*)/,
            `<div$1 style="background-color: ${customBackgroundColor};"`,
          );
        }
      }

      return textContent;
    }

    // If no media-text structure, create one
    // Create attributes for the container
    const containerAttributes: Record<string, string> = {
      class: classes,
    };

    // Add color classes if specified
    if (backgroundColor) {
      containerAttributes.class += ` has-${backgroundColor}-background-color`;
    }

    // Add custom background color if specified
    if (customBackgroundColor) {
      containerAttributes.style = `background-color: ${customBackgroundColor};`;
    }

    // Create media element
    let mediaElement = '';
    if (mediaUrl) {
      if (mediaType === 'image') {
        // Create image element
        mediaElement = createElement('img', {
          src: mediaUrl,
          class: getMediaClass(options.cssFramework),
          alt: '',
        });
      } else if (mediaType === 'video') {
        // Create video element
        mediaElement = createElement('video', {
          src: mediaUrl,
          class: getMediaClass(options.cssFramework),
          controls: 'true',
        });
      }
    }

    // Wrap media in a container
    const mediaContainerClasses = getMediaContainerClass(options.cssFramework, mediaWidth);
    const mediaContainer = createElement('div', { class: mediaContainerClasses }, mediaElement);

    // Create text container
    const textContainerClasses = getTextContainerClass(
      options.cssFramework,
      mediaWidth,
      verticalAlignment,
    );
    const textContainer = createElement('div', { class: textContainerClasses }, textContent);

    // Determine the order of media and text based on mediaPosition
    let content = '';
    if (mediaPosition === 'left') {
      content = `${mediaContainer}${textContainer}`;
    } else {
      content = `${textContainer}${mediaContainer}`;
    }

    // Create the container with the content
    return createElement('div', containerAttributes, content);
  },

  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'flex flex-wrap my-4',
      mediaPosition: {
        left: 'flex-row',
        right: 'flex-row-reverse',
      },
      isStackedOnMobile: 'md:flex-row flex-col',
      verticalAlignment: {
        top: 'items-start',
        center: 'items-center',
        bottom: 'items-end',
      },
      align: {
        left: 'mr-auto',
        center: 'mx-auto',
        right: 'ml-auto',
        wide: 'max-w-screen-xl mx-auto',
        full: 'w-full',
      },
    },

    // Bootstrap mappings
    bootstrap: {
      block: 'row my-3',
      mediaPosition: {
        left: 'flex-row',
        right: 'flex-row-reverse',
      },
      isStackedOnMobile: 'row',
      verticalAlignment: {
        top: 'align-items-start',
        center: 'align-items-center',
        bottom: 'align-items-end',
      },
      align: {
        left: 'float-start',
        center: 'd-block mx-auto',
        right: 'float-end',
        wide: 'container-lg',
        full: 'container-fluid',
      },
    },
  },
};

/**
 * Helper function to get the media container class
 */
function getMediaContainerClass(cssFramework?: string, mediaWidth: number = 50): string {
  switch (cssFramework) {
    case 'tailwind': {
      // Convert mediaWidth to tailwind width classes
      let widthClass = 'w-full md:w-1/2'; // Default is 50%

      if (mediaWidth <= 25) {
        widthClass = 'w-full md:w-1/4';
      } else if (mediaWidth <= 33) {
        widthClass = 'w-full md:w-1/3';
      } else if (mediaWidth <= 50) {
        widthClass = 'w-full md:w-1/2';
      } else if (mediaWidth <= 66) {
        widthClass = 'w-full md:w-2/3';
      } else if (mediaWidth <= 75) {
        widthClass = 'w-full md:w-3/4';
      }

      return `${widthClass} p-4 flex items-center justify-center`;
    }

    case 'bootstrap': {
      // Convert mediaWidth to bootstrap column classes
      let colClass = 'col-12 col-md-6'; // Default is 50%

      if (mediaWidth <= 25) {
        colClass = 'col-12 col-md-3';
      } else if (mediaWidth <= 33) {
        colClass = 'col-12 col-md-4';
      } else if (mediaWidth <= 50) {
        colClass = 'col-12 col-md-6';
      } else if (mediaWidth <= 66) {
        colClass = 'col-12 col-md-8';
      } else if (mediaWidth <= 75) {
        colClass = 'col-12 col-md-9';
      }

      return `${colClass} p-3 d-flex align-items-center justify-content-center`;
    }

    default:
      return 'wp-block-media-text__media';
  }
}

/**
 * Helper function to get the text container class
 */
function getTextContainerClass(
  cssFramework?: string,
  mediaWidth: number = 50,
  verticalAlignment: string = 'center',
): string {
  switch (cssFramework) {
    case 'tailwind': {
      // Convert mediaWidth to tailwind width classes for text (inverse of media width)
      let widthClass = 'w-full md:w-1/2'; // Default is 50%

      if (mediaWidth <= 25) {
        widthClass = 'w-full md:w-3/4';
      } else if (mediaWidth <= 33) {
        widthClass = 'w-full md:w-2/3';
      } else if (mediaWidth <= 50) {
        widthClass = 'w-full md:w-1/2';
      } else if (mediaWidth <= 66) {
        widthClass = 'w-full md:w-1/3';
      } else if (mediaWidth <= 75) {
        widthClass = 'w-full md:w-1/4';
      }

      // Add vertical alignment
      let alignClass = 'flex items-center'; // Default is center

      if (verticalAlignment === 'top') {
        alignClass = 'flex items-start';
      } else if (verticalAlignment === 'bottom') {
        alignClass = 'flex items-end';
      }

      return `${widthClass} p-4 ${alignClass}`;
    }

    case 'bootstrap': {
      // Convert mediaWidth to bootstrap column classes for text (inverse of media width)
      let colClass = 'col-12 col-md-6'; // Default is 50%

      if (mediaWidth <= 25) {
        colClass = 'col-12 col-md-9';
      } else if (mediaWidth <= 33) {
        colClass = 'col-12 col-md-8';
      } else if (mediaWidth <= 50) {
        colClass = 'col-12 col-md-6';
      } else if (mediaWidth <= 66) {
        colClass = 'col-12 col-md-4';
      } else if (mediaWidth <= 75) {
        colClass = 'col-12 col-md-3';
      }

      // Add vertical alignment
      let alignClass = 'd-flex align-items-center'; // Default is center

      if (verticalAlignment === 'top') {
        alignClass = 'd-flex align-items-start';
      } else if (verticalAlignment === 'bottom') {
        alignClass = 'd-flex align-items-end';
      }

      return `${colClass} p-3 ${alignClass}`;
    }

    default:
      return 'wp-block-media-text__content';
  }
}

/**
 * Helper function to get the media class
 */
function getMediaClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'w-full h-auto';
    case 'bootstrap':
      return 'img-fluid';
    default:
      return '';
  }
}
