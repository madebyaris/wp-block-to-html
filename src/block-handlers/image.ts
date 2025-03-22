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
    // Get block attributes
    const { url, alt, caption, href, align } = block.attrs || {};
    
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);
    
    // Apply alignment classes based on framework if requested
    let enhancedClasses = classes;
    if (align === 'center') {
      if (options.cssFramework === 'tailwind') {
        enhancedClasses += ' mx-auto';
      } else if (options.cssFramework === 'bootstrap') {
        enhancedClasses += ' mx-auto d-block';
      }
    }
    
    // Create image element
    const imgAttrs: Record<string, string> = { 
      src: url || '',
      alt: alt || '',
      class: options.cssFramework ? enhancedClasses : ''
    };
    
    // For the default (no framework) case, ensure we wrap in figure with wp-block-image class
    let imageHtml = createElement('img', imgAttrs);
    
    // Handle caption
    if (caption) {
      const figcaptionHtml = createElement('figcaption', {}, caption);
      
      // Always wrap in figure with appropriate class
      if (options.cssFramework === 'none' || !options.cssFramework) {
        return createElement('figure', { class: 'wp-block-image' }, imageHtml + figcaptionHtml);
      } else {
        // If using a CSS framework and has caption, still wrap in figure
        return createElement('figure', { class: enhancedClasses }, imageHtml + figcaptionHtml);
      }
    }
    
    // Handle link wrapping
    if (href) {
      imageHtml = createElement('a', { href }, imageHtml);
    }
    
    // For default framework, wrap in figure with wp-block-image class
    if (options.cssFramework === 'none' || !options.cssFramework) {
      return createElement('figure', { class: 'wp-block-image' }, imageHtml);
    }
    
    // For CSS frameworks, use direct img tag or wrap in figure based on framework's needs
    if (options.cssFramework === 'bootstrap' || options.cssFramework === 'tailwind') {
      // When using frameworks, wrap in figure for consistent HTML structure
      return createElement('figure', { class: enhancedClasses }, imageHtml);
    }
    
    // Fallback to just the image with classes
    return imageHtml;
  },

  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'max-w-full h-auto',
      align: {
        left: 'float-left mr-4 mb-4',
        center: 'mx-auto block',
        right: 'float-right ml-4 mb-4',
      },
      sizeSlug: {
        thumbnail: 'w-32',
        medium: 'w-48',
        large: 'w-96',
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
