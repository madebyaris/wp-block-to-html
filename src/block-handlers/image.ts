import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';

/**
 * Handler for the 'core/image' block
 */
export const imageBlockHandler: BlockHandler = {
  /**
   * Transform an image block to HTML
   * @param block Image block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);

    // Extract the image content from innerContent
    let content = '';

    // If there's innerHTML, use that
    if (block.innerHTML) {
      content = block.innerHTML;
    }
    // Otherwise join innerContent
    else if (block.innerContent.length > 0) {
      content = block.innerContent.join('');
    }

    // Get the rendering mode from options
    const renderMode = options.renderedContentHandling || 'rebuild';

    // For image blocks with rendered content
    if (content.trim().startsWith('<figure') && content.includes('<img')) {
      // Image blocks are often wrapped in a figure tag, which we should preserve
      if (renderMode === 'respect') {
        return content;
      } else if (renderMode === 'preserve-attrs') {
        // Extract and process the img tag
        const imgMatch = content.match(/<img [^>]*>/);
        if (imgMatch) {
          const imgTag = imgMatch[0];

          // Extract existing classes if any
          const existingClassMatch = imgTag.match(/class="([^"]*)"/);
          const existingClass = existingClassMatch ? existingClassMatch[1] : '';

          // Combine existing classes with our framework classes
          const combinedClasses = existingClass ? `${existingClass} ${classes}` : classes;

          // Replace or add the class attribute to the img tag
          let newImgTag;
          if (existingClassMatch) {
            newImgTag = imgTag.replace(/class="([^"]*)"/, `class="${combinedClasses}"`);
          } else {
            newImgTag = imgTag.replace(/^<img/, `<img class="${classes}"`);
          }

          // Replace the img tag in the content
          return content.replace(imgTag, newImgTag);
        }
      }
    }

    // For rebuild mode or if we need to build from scratch
    // Extract attributes from the block
    const { src, alt, href, caption, width, height } = block.attrs || {};

    if (src) {
      // Create image attributes
      const imgAttrs: Record<string, string | number | boolean> = {
        class: classes,
        src,
        alt: alt || '',
      };

      // Add optional attributes
      if (width) imgAttrs.width = width;
      if (height) imgAttrs.height = height;

      // Create the image tag
      const imgHtml = createElement('img', imgAttrs);

      // If there's a caption, wrap in figure
      if (caption) {
        return createElement(
          'figure',
          {},
          `
          ${imgHtml}
          <figcaption>${caption}</figcaption>
        `,
        );
      }

      // If there's a link, wrap in anchor
      if (href) {
        return createElement('a', { href }, imgHtml);
      }

      return imgHtml;
    }

    // Fallback: return original content
    return content;
  },

  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'max-w-full h-auto',
      align: {
        left: 'float-left mr-4 mb-4',
        center: 'mx-auto',
        right: 'float-right ml-4 mb-4',
      },
      sizeSlug: {
        thumbnail: 'max-w-xs',
        medium: 'max-w-md',
        large: 'max-w-lg',
        full: 'w-full',
      },
    },

    // Bootstrap mappings
    bootstrap: {
      block: 'img-fluid',
      align: {
        left: 'float-start me-3 mb-3',
        center: 'mx-auto d-block',
        right: 'float-end ms-3 mb-3',
      },
      sizeSlug: {
        thumbnail: 'w-25',
        medium: 'w-50',
        large: 'w-75',
        full: 'w-100',
      },
    },
  },
};
