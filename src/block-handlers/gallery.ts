import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses } from '../core/utils';

/**
 * Interface for gallery image
 */
interface GalleryImage {
  url: string;
  id?: number;
  alt?: string;
  caption?: string;
  link?: string;
  linkTarget?: string;
  rel?: string;
  width?: number;
  height?: number;
}

/**
 * Handler for the 'core/gallery' block
 * Enhanced with improved caption formatting
 */
export const galleryBlockHandler: BlockHandler = {
  /**
   * Transform a gallery block to HTML
   * @param block Gallery block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);

    // Extract the gallery content from innerContent
    let content = '';

    // If there's innerHTML, use that
    if (block.innerHTML) {
      content = block.innerHTML;
    }
    // Otherwise join innerContent
    else if (block.innerContent.length > 0) {
      content = block.innerContent.join('');
    }

    // Process captions immediately, ensuring they have proper classes
    if (content && content.includes('<figcaption')) {
      const captionClass = getFigcaptionClass(options.cssFramework);

      // Add class to figcaption elements without a class attribute
      content = content.replace(
        /<figcaption>([^<]*)<\/figcaption>/g,
        `<figcaption class="${captionClass}">$1</figcaption>`,
      );

      // Also ensure figcaptions with classes get our framework-specific class
      content = content.replace(
        /<figcaption class="([^"]*)">([^<]*)<\/figcaption>/g,
        (match, existingClass, captionText) => {
          if (!existingClass.includes(captionClass)) {
            return `<figcaption class="${existingClass} ${captionClass}">${captionText}</figcaption>`;
          }
          return match;
        },
      );
    }

    // Get rendering mode from options
    const renderMode = options.renderedContentHandling || 'rebuild';

    // For 'respect' mode, just return the enhanced content
    if (renderMode === 'respect' && content) {
      return content;
    }

    // For 'preserve-attrs' mode, enhance the figure wrapper classes too
    if (renderMode === 'preserve-attrs' && content) {
      // Apply classes to the main figure element while preserving existing classes
      if (content.trim().startsWith('<figure') && content.includes('class=')) {
        content = content.replace(/<figure class="([^"]*)"/g, (match, existingClass) => {
          return `<figure class="${existingClass} ${classes}"`;
        });
      } else if (content.trim().startsWith('<figure') && !content.includes('class=')) {
        content = content.replace(/<figure/g, `<figure class="${classes}"`);
      }

      return content;
    }

    // Extract gallery attributes
    const images = block.attrs?.images || [];
    const columns = block.attrs?.columns || 3;
    const linkTo = block.attrs?.linkTo || 'none';
    const caption = block.attrs?.caption || '';

    // If we already have a gallery structure and we're in 'rebuild' mode, we'll process it fully
    if (
      renderMode === 'rebuild' &&
      content.trim().startsWith('<figure') &&
      content.trim().endsWith('</figure>')
    ) {
      // Extract existing classes if any
      const existingClassMatch = content.match(/class="([^"]*)"/);
      const existingClass = existingClassMatch ? existingClassMatch[1] : '';

      // Combine existing classes with our framework classes
      const combinedClasses = existingClass ? `${existingClass} ${classes}` : classes;

      // Replace or add the class attribute
      if (existingClassMatch) {
        content = content.replace(/class="([^"]*)"/, `class="${combinedClasses}"`);
      } else {
        content = content.replace(/^<figure/, `<figure class="${classes}"`);
      }

      return content;
    }

    // If no gallery structure, create one
    let galleryContent = '';

    // Process images if available
    if (images.length > 0) {
      const imageElements = images.map((image: GalleryImage) => {
        const { url, alt = '', caption: imgCaption, link, linkTarget, rel, width, height } = image;

        // Create image attributes
        const imgAttributes = [
          `src="${url}"`,
          `alt="${alt}"`,
          `class="${getImageClass(options.cssFramework)}"`,
        ];

        // Add dimensions if available
        if (width) {
          imgAttributes.push(`width="${width}"`);
        }

        if (height) {
          imgAttributes.push(`height="${height}"`);
        }

        // Create image element
        let imgElement = `<img ${imgAttributes.join(' ')} />`;

        // Add link if specified
        if (linkTo === 'media') {
          const linkAttributes = [`href="${url}"`, `class="${getLinkClass(options.cssFramework)}"`];

          // Add target and rel if available
          if (linkTarget) {
            linkAttributes.push(`target="${linkTarget}"`);
          }

          if (rel) {
            linkAttributes.push(`rel="${rel}"`);
          }

          imgElement = `<a ${linkAttributes.join(' ')}>${imgElement}</a>`;
        } else if (linkTo === 'attachment' && link) {
          const linkAttributes = [
            `href="${link}"`,
            `class="${getLinkClass(options.cssFramework)}"`,
          ];

          // Add target and rel if available
          if (linkTarget) {
            linkAttributes.push(`target="${linkTarget}"`);
          }

          if (rel) {
            linkAttributes.push(`rel="${rel}"`);
          }

          imgElement = `<a ${linkAttributes.join(' ')}>${imgElement}</a>`;
        }

        // Add caption if available
        if (imgCaption) {
          imgElement = `
            <figure class="${getFigureClass(options.cssFramework)}">
              ${imgElement}
              <figcaption class="${getFigcaptionClass(options.cssFramework)}">${imgCaption}</figcaption>
            </figure>
          `;
        } else {
          // Wrap in figure anyway for consistency, but without caption
          imgElement = `
            <figure class="${getFigureClass(options.cssFramework)}">
              ${imgElement}
            </figure>
          `;
        }

        // Wrap in column div
        return `<div class="${getColumnClass(options.cssFramework)}">${imgElement}</div>`;
      });

      // Join image elements
      galleryContent = imageElements.join('');
    } else {
      // If no images array but we have content, use that
      galleryContent = content;
    }

    // Create gallery wrapper
    let galleryHtml = `
      <div class="${getGalleryWrapperClass(options.cssFramework, columns)}">
        ${galleryContent}
      </div>
    `;

    // Add caption if available
    if (caption) {
      galleryHtml = `
        <figure class="${classes}">
          ${galleryHtml}
          <figcaption class="${getFigcaptionClass(options.cssFramework)}">${caption}</figcaption>
        </figure>
      `;
    } else {
      galleryHtml = `<figure class="${classes}">${galleryHtml}</figure>`;
    }

    return galleryHtml;
  },

  // CSS framework mappings
  cssMapping: {
    // Default WordPress mappings
    default: {
      block: 'wp-block-gallery',
      columns: {
        '1': 'columns-1',
        '2': 'columns-2',
        '3': 'columns-3',
        '4': 'columns-4',
        '5': 'columns-5',
        '6': 'columns-6',
      },
      align: {
        left: 'alignleft',
        center: 'aligncenter',
        right: 'alignright',
        wide: 'alignwide',
        full: 'alignfull',
      },
    },

    // Tailwind CSS mappings
    tailwind: {
      block: 'my-4',
      columns: {
        '1': 'grid-cols-1',
        '2': 'grid-cols-1 sm:grid-cols-2',
        '3': 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
        '4': 'grid-cols-2 md:grid-cols-4',
        '5': 'grid-cols-2 md:grid-cols-5',
        '6': 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
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
      block: 'my-3',
      columns: {
        '1': 'row-cols-1',
        '2': 'row-cols-1 row-cols-sm-2',
        '3': 'row-cols-1 row-cols-sm-2 row-cols-md-3',
        '4': 'row-cols-2 row-cols-md-4',
        '5': 'row-cols-2 row-cols-md-5',
        '6': 'row-cols-2 row-cols-md-3 row-cols-lg-6',
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
 * Helper function to get the gallery wrapper class
 */
function getGalleryWrapperClass(cssFramework?: string, columns: number = 3): string {
  switch (cssFramework) {
    case 'tailwind':
      return `grid gap-4 grid-cols-1 sm:grid-cols-${Math.min(columns, 2)} md:grid-cols-${columns}`;
    case 'bootstrap':
      return `row row-cols-1 row-cols-sm-${Math.min(columns, 2)} row-cols-md-${columns} g-3`;
    default:
      return `wp-block-gallery columns-${columns}`;
  }
}

/**
 * Helper function to get the column class
 */
function getColumnClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'p-1';
    case 'bootstrap':
      return 'col mb-4';
    default:
      return 'wp-block-gallery-item';
  }
}

/**
 * Helper function to get the image class
 */
function getImageClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'w-full h-auto rounded object-cover';
    case 'bootstrap':
      return 'img-fluid rounded';
    default:
      return '';
  }
}

/**
 * Helper function to get the figure class
 */
function getFigureClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'relative mb-4';
    case 'bootstrap':
      return 'figure';
    default:
      return 'wp-block-image';
  }
}

/**
 * Helper function to get the figcaption class
 */
function getFigcaptionClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'text-sm text-gray-600 mt-1 text-center';
    case 'bootstrap':
      return 'figure-caption text-center';
    default:
      return 'wp-element-caption';
  }
}

/**
 * Helper function to get the link class
 */
function getLinkClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'block hover:opacity-80 transition-opacity';
    case 'bootstrap':
      return 'd-block';
    default:
      return '';
  }
}
