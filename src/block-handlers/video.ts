import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';

/**
 * Handler for the 'core/video' block
 */
export const videoBlockHandler: BlockHandler = {
  /**
   * Transform a video block to HTML
   * @param block Video block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);
    
    // Extract the video content from innerContent
    let content = '';
    
    // If there's innerHTML, use that
    if (block.innerHTML) {
      content = block.innerHTML;
    } 
    // Otherwise join innerContent
    else if (block.innerContent.length > 0) {
      content = block.innerContent.join('');
    }
    
    // Extract video attributes
    const src = block.attrs?.src || '';
    const caption = block.attrs?.caption || '';
    const poster = block.attrs?.poster || '';
    const loop = block.attrs?.loop;
    const autoplay = block.attrs?.autoplay;
    const muted = block.attrs?.muted;
    const playsInline = block.attrs?.playsInline;
    const preload = block.attrs?.preload || 'metadata';
    
    // If we already have a video tag, we'll modify its attributes
    if (content.trim().startsWith('<video') && content.trim().endsWith('</video>')) {
      // Extract existing classes if any
      const existingClassMatch = content.match(/class="([^"]*)"/);
      const existingClass = existingClassMatch ? existingClassMatch[1] : '';
      
      // Combine existing classes with our framework classes
      const combinedClasses = existingClass
        ? `${existingClass} ${classes}`
        : classes;
      
      // Replace or add the class attribute
      if (existingClassMatch) {
        content = content.replace(
          /class="([^"]*)"/,
          `class="${combinedClasses}"`
        );
      } else {
        content = content.replace(
          /^<video/,
          `<video class="${classes}"`
        );
      }
      
      // If there's a caption, wrap the video in a figure
      if (caption) {
        content = `<figure class="${getVideoWrapperClass(options.cssFramework)}">
          ${content}
          <figcaption>${caption}</figcaption>
        </figure>`;
      }
      
      return content;
    }
    
    // If no video tag, create one
    // Create attributes for the video element
    const attributes: Record<string, string | boolean> = {
      class: classes,
      controls: true,
    };
    
    if (src) {
      attributes.src = src;
    }
    
    if (poster) {
      attributes.poster = poster;
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
    
    if (muted) {
      attributes.muted = true;
    }
    
    if (playsInline) {
      attributes.playsinline = true;
    }
    
    // Create video element
    let videoElement = createElement('video', attributes);
    
    // If there's a caption, wrap the video in a figure
    if (caption) {
      const figureAttributes = {
        class: getVideoWrapperClass(options.cssFramework)
      };
      
      const figcaptionElement = createElement('figcaption', {}, caption);
      
      videoElement = createElement('figure', figureAttributes, `${videoElement}${figcaptionElement}`);
    }
    
    return videoElement;
  },
  
  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'w-full aspect-video my-4',
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
      block: 'w-100 my-3',
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
 * Helper function to get the wrapper class for video blocks
 */
function getVideoWrapperClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'w-full my-4';
    case 'bootstrap':
      return 'figure my-3';
    default:
      return 'wp-block-video';
  }
} 