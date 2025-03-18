import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';

/**
 * Handler for the 'core/audio' block
 */
export const audioBlockHandler: BlockHandler = {
  /**
   * Transform an audio block to HTML
   * @param block Audio block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);

    // Extract the audio content from innerContent
    let content = '';

    // If there's innerHTML, use that
    if (block.innerHTML) {
      content = block.innerHTML;
    }
    // Otherwise join innerContent
    else if (block.innerContent.length > 0) {
      content = block.innerContent.join('');
    }

    // Extract audio attributes
    const src = block.attrs?.src || '';
    const caption = block.attrs?.caption || '';
    const id = block.attrs?.id;
    const loop = block.attrs?.loop;
    const autoplay = block.attrs?.autoplay;
    const preload = block.attrs?.preload || 'none';

    // If we already have an audio tag, we'll modify its attributes
    if (content.trim().startsWith('<audio') && content.trim().endsWith('</audio>')) {
      // Extract existing classes if any
      const existingClassMatch = content.match(/class="([^"]*)"/);
      const existingClass = existingClassMatch ? existingClassMatch[1] : '';

      // Combine existing classes with our framework classes
      const combinedClasses = existingClass ? `${existingClass} ${classes}` : classes;

      // Replace or add the class attribute
      if (existingClassMatch) {
        content = content.replace(/class="([^"]*)"/, `class="${combinedClasses}"`);
      } else {
        content = content.replace(/^<audio/, `<audio class="${classes}"`);
      }

      // If there's a caption, wrap the audio in a figure
      if (caption) {
        content = `<figure class="${getAudioWrapperClass(options.cssFramework)}">
          ${content}
          <figcaption>${caption}</figcaption>
        </figure>`;
      }

      return content;
    }

    // If no audio tag, create one
    // Create attributes for the audio element
    const attributes: Record<string, string | boolean> = {
      class: classes,
      controls: true,
    };

    if (src) {
      attributes.src = src;
    }

    if (preload) {
      attributes.preload = preload;
    }

    if (loop) {
      attributes.loop = true;
    }

    if (autoplay) {
      attributes.autoplay = true;
    }

    // Create audio element
    let audioElement = createElement('audio', attributes);

    // If there's a caption, wrap the audio in a figure
    if (caption) {
      const figureAttributes = {
        class: getAudioWrapperClass(options.cssFramework),
      };

      const figcaptionElement = createElement('figcaption', {}, caption);

      audioElement = createElement(
        'figure',
        figureAttributes,
        `${audioElement}${figcaptionElement}`,
      );
    }

    return audioElement;
  },

  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'w-full my-4',
      align: {
        left: 'mr-auto',
        center: 'mx-auto',
        right: 'ml-auto',
      },
    },

    // Bootstrap mappings
    bootstrap: {
      block: 'w-100 my-3',
      align: {
        left: 'float-start',
        center: 'd-block mx-auto',
        right: 'float-end',
      },
    },
  },
};

/**
 * Helper function to get the wrapper class for audio blocks
 */
function getAudioWrapperClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'w-full my-4';
    case 'bootstrap':
      return 'figure my-3';
    default:
      return 'wp-block-audio';
  }
}
