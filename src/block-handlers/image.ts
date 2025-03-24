import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement, processContentWithRenderMode } from '../core/utils';

/**
 * Handler for the 'core/image' block
 * Enhanced with improved caption formatting
 */
export const imageBlockHandler: BlockHandler = {
  /**
   * Transform an image block to HTML
   * @param block Image block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Check if we have pre-rendered content to process
    const renderedContent =
      block.innerHTML || (block.innerContent.length > 0 ? block.innerContent.join('') : '');

    // If we have pre-rendered content with figcaption, process it
    if (renderedContent && renderedContent.includes('<figcaption>')) {
      const captionClass = this.getCaptionClass(options.cssFramework);

      // Replace figcaption without class with one that has proper class
      const processedContent = renderedContent.replace(
        /<figcaption>([^<]*)<\/figcaption>/g,
        `<figcaption class="${captionClass}">$1</figcaption>`,
      );

      // If using 'respect' or 'preserve-attrs' mode, return the processed content
      if (
        options.renderedContentHandling === 'respect' ||
        options.renderedContentHandling === 'preserve-attrs'
      ) {
        return processedContent;
      }

      // For 'rebuild' mode, continue with normal processing but use the processed content
      block = {
        ...block,
        innerHTML: processedContent,
        innerContent: [processedContent],
      };
    }

    // Get rendering mode from options
    const renderMode = options.renderedContentHandling || 'rebuild';

    // For rebuild mode or if no rendering mode specified, rebuild from scratch
    if (renderMode === 'rebuild' || !renderMode) {
      // Get block attributes
      const {
        url,
        alt,
        caption,
        href,
        align,
        sizeSlug,
        width,
        height,
        linkTarget,
        linkRel,
        linkClass,
      } = block.attrs || {};

      // Get CSS classes based on framework
      const classes = getBlockClasses(block, this, options);

      // Apply alignment classes based on framework if requested
      let enhancedClasses = classes;
      if (align) {
        // Apply alignment classes from the CSS mapping for the current framework
        const alignClass = this.cssMapping?.[options.cssFramework || 'default']?.align?.[align];
        if (alignClass) {
          enhancedClasses += ` ${alignClass}`;
        }
      }

      // Apply size classes if available
      if (sizeSlug) {
        const sizeClass =
          this.cssMapping?.[options.cssFramework || 'default']?.sizeSlug?.[sizeSlug];
        if (sizeClass) {
          enhancedClasses += ` ${sizeClass}`;
        }
      }

      // Create image element
      const imgAttrs: Record<string, string> = {
        src: url || '',
        alt: alt || '',
        class: enhancedClasses,
      };

      // Add width and height if present
      if (width) {
        imgAttrs.width = width.toString();
      }

      if (height) {
        imgAttrs.height = height.toString();
      }

      // Create the image HTML
      let imageHtml = createElement('img', imgAttrs);

      // Handle link wrapping
      if (href) {
        const linkAttrs: Record<string, string> = { href };

        // Add target, rel, and class if available
        if (linkTarget) {
          linkAttrs.target = linkTarget;
        }

        if (linkRel) {
          linkAttrs.rel = linkRel;
        }

        if (linkClass) {
          linkAttrs.class = linkClass;
        }

        imageHtml = createElement('a', linkAttrs, imageHtml);
      }

      // Get wrapper and caption classes based on framework
      const wrapperClass = this.getWrapperClass(options.cssFramework);
      const captionClass = this.getCaptionClass(options.cssFramework);

      // Handle caption
      let captionHtml = '';
      if (caption) {
        captionHtml = createElement(
          'figcaption',
          {
            class: captionClass,
          },
          caption,
        );
      } else {
        // Check if we have a caption in the rendered content
        const captionMatch = renderedContent.match(/<figcaption[^>]*>(.*?)<\/figcaption>/s);
        if (captionMatch && captionMatch[1]) {
          captionHtml = createElement(
            'figcaption',
            {
              class: captionClass,
            },
            captionMatch[1],
          );
        }
      }

      // Create figure/wrapper element
      return createElement(
        'figure',
        {
          class: wrapperClass,
        },
        imageHtml + captionHtml,
      );
    }

    // For other rendering modes, use the processContentWithRenderMode utility
    return processContentWithRenderMode(
      renderedContent,
      'figure',
      { class: this.getWrapperClass(options.cssFramework) },
      renderMode,
    );
  },

  /**
   * Get the appropriate wrapper class based on CSS framework
   */
  getWrapperClass(cssFramework?: string): string {
    switch (cssFramework) {
      case 'tailwind':
        return 'relative my-6';
      case 'bootstrap':
        return 'figure';
      default:
        return 'wp-block-image';
    }
  },

  /**
   * Get the appropriate caption class based on CSS framework
   */
  getCaptionClass(cssFramework?: string): string {
    switch (cssFramework) {
      case 'tailwind':
        return 'text-sm text-gray-600 mt-2 text-center';
      case 'bootstrap':
        return 'figure-caption text-center';
      default:
        return 'wp-element-caption';
    }
  },

  // CSS framework mappings
  cssMapping: {
    // Default (WordPress) mappings
    default: {
      block: 'wp-block-image',
      align: {
        left: 'alignleft',
        center: 'aligncenter',
        right: 'alignright',
        wide: 'alignwide',
        full: 'alignfull',
      },
      sizeSlug: {
        thumbnail: 'size-thumbnail',
        medium: 'size-medium',
        large: 'size-large',
        full: 'size-full',
      },
      captionStyle: 'wp-element-caption',
    },

    // Tailwind CSS mappings
    tailwind: {
      block: 'max-w-full h-auto',
      align: {
        left: 'float-left mr-4 mb-4',
        center: 'mx-auto block',
        right: 'float-right ml-4 mb-4',
        wide: 'w-[120%] mx-auto',
        full: 'w-full',
      },
      sizeSlug: {
        thumbnail: 'w-32',
        medium: 'w-48',
        large: 'w-96',
        full: 'w-full',
      },
      captionStyle: 'text-sm text-gray-600 mt-2 text-center',
    },

    // Bootstrap mappings
    bootstrap: {
      block: 'img-fluid',
      align: {
        left: 'float-start me-3 mb-3',
        center: 'mx-auto d-block',
        right: 'float-end ms-3 mb-3',
        wide: 'w-100',
        full: 'w-100',
      },
      sizeSlug: {
        thumbnail: 'w-25',
        medium: 'w-50',
        large: 'w-75',
        full: 'w-100',
      },
      captionStyle: 'figure-caption text-center',
    },
  },
};
