import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';
import { convertBlocks } from '../core/converter';

/**
 * Handler for the 'core/cover' block
 */
export const coverBlockHandler: BlockHandler = {
  /**
   * Transform a cover block to HTML
   * @param block Cover block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);

    // Process inner blocks if any
    let innerContent = '';
    if (block.innerBlocks && block.innerBlocks.length > 0) {
      // Convert inner blocks using the converter
      innerContent = convertBlocks(block.innerBlocks, options) as string;
    } else {
      // If there's innerHTML, use that
      if (block.innerHTML) {
        innerContent = block.innerHTML;
      }
      // Otherwise join innerContent
      else if (block.innerContent.length > 0) {
        innerContent = block.innerContent.join('');
      }
    }

    // Extract cover attributes
    const url = block.attrs?.url || '';
    const id = block.attrs?.id;
    const hasParallax = block.attrs?.hasParallax;
    const dimRatio = block.attrs?.dimRatio !== undefined ? block.attrs.dimRatio : 50;
    const overlayColor = block.attrs?.overlayColor || '';
    const customOverlayColor = block.attrs?.customOverlayColor || '';
    const minHeight = block.attrs?.minHeight;
    const minHeightUnit = block.attrs?.minHeightUnit || 'px';
    const contentPosition = block.attrs?.contentPosition || 'center center';

    // Build inline style
    let style = '';

    // Add background image if URL is provided
    if (url) {
      style += `background-image: url(${url});`;
    }

    // Add min-height if specified
    if (minHeight) {
      style += `min-height: ${minHeight}${minHeightUnit};`;
    } else {
      // Default min-height
      style += 'min-height: 300px;';
    }

    // If we already have a div with the cover structure, we'll modify its attributes
    if (innerContent.trim().startsWith('<div') && innerContent.trim().endsWith('</div>')) {
      // Extract existing classes if any
      const existingClassMatch = innerContent.match(/class="([^"]*)"/);
      const existingClass = existingClassMatch ? existingClassMatch[1] : '';

      // Combine existing classes with our framework classes
      const combinedClasses = existingClass ? `${existingClass} ${classes}` : classes;

      // Replace or add the class attribute
      if (existingClassMatch) {
        innerContent = innerContent.replace(/class="([^"]*)"/, `class="${combinedClasses}"`);
      } else {
        innerContent = innerContent.replace(/^<div/, `<div class="${classes}"`);
      }

      // Add or update style attribute
      const styleMatch = innerContent.match(/style="([^"]*)"/);
      if (styleMatch) {
        innerContent = innerContent.replace(
          /style="([^"]*)"/,
          `style="${styleMatch[1]}; ${style}"`,
        );
      } else {
        innerContent = innerContent.replace(/^<div([^>]*)/, `<div$1 style="${style}"`);
      }

      return innerContent;
    }

    // If no cover structure, create one
    // Create attributes for the cover element
    const attributes: Record<string, string> = {
      class: classes,
      style: style,
    };

    // Create overlay element
    let overlayStyle = '';
    if (customOverlayColor) {
      overlayStyle = `background-color: ${customOverlayColor}; opacity: ${dimRatio / 100};`;
    } else if (overlayColor) {
      // Use the overlay color class instead of inline style
      overlayStyle = `opacity: ${dimRatio / 100};`;
    } else {
      // Default overlay
      overlayStyle = `background-color: #000000; opacity: ${dimRatio / 100};`;
    }

    const overlayClasses = getOverlayClass(options.cssFramework);
    const overlayColorClass = overlayColor ? ` has-${overlayColor}-background-color` : '';

    const overlay = createElement('div', {
      class: `${overlayClasses}${overlayColorClass}`,
      style: overlayStyle,
      'aria-hidden': 'true',
    });

    // Create content container
    const contentClasses = getContentClass(options.cssFramework, contentPosition);
    const contentContainer = createElement('div', { class: contentClasses }, innerContent);

    // Combine overlay and content
    return createElement('div', attributes, `${overlay}${contentContainer}`);
  },

  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'relative bg-cover bg-center my-4',
      hasParallax: 'bg-fixed',
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
      block: 'position-relative bg-cover bg-center my-3',
      hasParallax: 'bg-fixed',
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
 * Helper function to get the overlay class
 */
function getOverlayClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'absolute inset-0';
    case 'bootstrap':
      return 'position-absolute top-0 start-0 end-0 bottom-0';
    default:
      return 'wp-block-cover__overlay';
  }
}

/**
 * Helper function to get the content class based on position
 */
function getContentClass(cssFramework?: string, position: string = 'center center'): string {
  const [vertical, horizontal] = position.split(' ');

  switch (cssFramework) {
    case 'tailwind': {
      let classes = 'relative z-10 flex flex-col p-4 text-white';

      // Add horizontal alignment
      if (horizontal === 'left') {
        classes += ' items-start';
      } else if (horizontal === 'right') {
        classes += ' items-end';
      } else {
        classes += ' items-center';
      }

      // Add vertical alignment
      if (vertical === 'top') {
        classes += ' justify-start';
      } else if (vertical === 'bottom') {
        classes += ' justify-end';
      } else {
        classes += ' justify-center';
      }

      // Add height
      classes += ' h-full';

      return classes;
    }

    case 'bootstrap': {
      let classes = 'position-relative z-1 d-flex flex-column p-3 text-white';

      // Add horizontal alignment
      if (horizontal === 'left') {
        classes += ' align-items-start';
      } else if (horizontal === 'right') {
        classes += ' align-items-end';
      } else {
        classes += ' align-items-center';
      }

      // Add vertical alignment
      if (vertical === 'top') {
        classes += ' justify-content-start';
      } else if (vertical === 'bottom') {
        classes += ' justify-content-end';
      } else {
        classes += ' justify-content-center';
      }

      // Add height
      classes += ' h-100';

      return classes;
    }

    default:
      return 'wp-block-cover__inner-container';
  }
}
