import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';

/**
 * Handler for the 'core/rss' block
 */
export const rssBlockHandler: BlockHandler = {
  /**
   * Transform an RSS block to HTML
   * @param block RSS block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);

    // Extract RSS attributes
    const feedURL = block.attrs?.feedURL || '';
    const itemsToShow = block.attrs?.itemsToShow || 5;
    const displayExcerpt = block.attrs?.displayExcerpt || false;
    const displayAuthor = block.attrs?.displayAuthor || false;
    const displayDate = block.attrs?.displayDate || false;
    const excerptLength = block.attrs?.excerptLength || 55;

    // Create a placeholder for the RSS feed
    // In a real implementation, this would be replaced with actual RSS data
    let content = '';

    // Check if we have a custom RSS processor in options
    if (options.customRssProcessor && typeof options.customRssProcessor === 'function') {
      try {
        const processedContent = options.customRssProcessor(block, options);
        if (processedContent) {
          return processedContent;
        }
      } catch (error) {
        console.error('Error processing RSS feed:', error);
      }
    }

    // If no custom processor or it failed, return a placeholder
    content = `
      <ul class="${getRssListClass(options.cssFramework)}">
        ${generateRssItemPlaceholders(itemsToShow, displayExcerpt, displayAuthor, displayDate, options.cssFramework)}
      </ul>
    `;

    // Create the RSS container
    return createElement(
      'div',
      {
        class: classes,
        'data-feed-url': feedURL,
        'data-items-to-show': itemsToShow,
        'data-display-excerpt': displayExcerpt ? 'true' : 'false',
        'data-display-author': displayAuthor ? 'true' : 'false',
        'data-display-date': displayDate ? 'true' : 'false',
        'data-excerpt-length': excerptLength,
      },
      content,
    );
  },

  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'my-6',
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
      block: 'my-4',
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
 * Helper functions for CSS classes
 */
function getRssListClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'list-none p-0 space-y-4';
    case 'bootstrap':
      return 'list-unstyled';
    default:
      return 'wp-block-rss';
  }
}

function getRssTitleClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'text-lg font-bold mb-1';
    case 'bootstrap':
      return 'h5 mb-1';
    default:
      return 'wp-block-rss__item-title';
  }
}

function getRssMetaClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'text-sm text-gray-500 mb-2';
    case 'bootstrap':
      return 'small text-muted mb-2';
    default:
      return 'wp-block-rss__item-meta';
  }
}

function getRssExcerptClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'text-sm text-gray-700';
    case 'bootstrap':
      return 'small';
    default:
      return 'wp-block-rss__item-excerpt';
  }
}

/**
 * Generate placeholder RSS items
 */
function generateRssItemPlaceholders(
  count: number,
  displayExcerpt: boolean,
  displayAuthor: boolean,
  displayDate: boolean,
  cssFramework?: string,
): string {
  return Array(count)
    .fill(0)
    .map((_, i) => {
      const title = `RSS Item ${i + 1}`;
      const author = `Author ${i + 1}`;
      const date = new Date().toLocaleDateString();
      const excerpt =
        'This is a placeholder excerpt for the RSS item. In a real implementation, this would be replaced with actual content from the RSS feed.';

      let meta = '';
      if (displayAuthor || displayDate) {
        meta = `
        <div class="${getRssMetaClass(cssFramework)}">
          ${displayAuthor ? `By ${author}` : ''}
          ${displayAuthor && displayDate ? ' on ' : ''}
          ${displayDate ? date : ''}
        </div>
      `;
      }

      return `
      <li>
        <div>
          <a class="${getRssTitleClass(cssFramework)}" href="#">${title}</a>
          ${meta}
          ${displayExcerpt ? `<div class="${getRssExcerptClass(cssFramework)}">${excerpt}</div>` : ''}
        </div>
      </li>
    `;
    })
    .join('');
}
