import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';

/**
 * Handler for the 'core/latest-posts' block
 */
export const latestPostsBlockHandler: BlockHandler = {
  /**
   * Transform a latest posts block to HTML
   * @param block Latest posts block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);

    // Extract latest posts attributes
    const postsToShow = block.attrs?.postsToShow || 5;
    const displayPostDate = block.attrs?.displayPostDate || false;
    const displayFeaturedImage = block.attrs?.displayFeaturedImage || false;
    const displayPostContent = block.attrs?.displayPostContent || false;
    const displayPostContentRadio = block.attrs?.displayPostContentRadio || 'excerpt';
    const excerptLength = block.attrs?.excerptLength || 55;
    const postLayout = block.attrs?.postLayout || 'list';
    const columns = block.attrs?.columns || 3;
    const order = block.attrs?.order || 'desc';
    const orderBy = block.attrs?.orderBy || 'date';
    const categories = block.attrs?.categories || [];

    // Create a placeholder for the latest posts
    // In a real implementation, this would be replaced with actual posts data
    let content = '';

    // Check if we have a custom posts processor in options
    if (
      options.customLatestPostsProcessor &&
      typeof options.customLatestPostsProcessor === 'function'
    ) {
      try {
        const processedContent = options.customLatestPostsProcessor(block, options);
        if (processedContent) {
          return processedContent;
        }
      } catch (error) {
        console.error('Error processing latest posts:', error);
      }
    }

    // If no custom processor or it failed, return a placeholder
    content = `
      <div class="${getLatestPostsContainerClass(postLayout, options.cssFramework)}">
        ${Array(postsToShow)
          .fill(0)
          .map(
            (_, i) => `
          <div class="${getLatestPostItemClass(postLayout, options.cssFramework)}">
            ${
              displayFeaturedImage
                ? `
              <div class="${getLatestPostImageClass(options.cssFramework)}">
                <img src="https://via.placeholder.com/300x200" alt="Placeholder image ${i + 1}" />
              </div>
            `
                : ''
            }
            <div class="${getLatestPostContentClass(options.cssFramework)}">
              <h3 class="${getLatestPostTitleClass(options.cssFramework)}">Latest Post ${i + 1}</h3>
              ${
                displayPostDate
                  ? `
                <div class="${getLatestPostDateClass(options.cssFramework)}">
                  ${new Date().toLocaleDateString()}
                </div>
              `
                  : ''
              }
              ${
                displayPostContent
                  ? `
                <div class="${getLatestPostExcerptClass(options.cssFramework)}">
                  This is a placeholder for the ${displayPostContentRadio === 'excerpt' ? 'excerpt' : 'full content'} of the latest post ${i + 1}.
                </div>
              `
                  : ''
              }
            </div>
          </div>
        `,
          )
          .join('')}
      </div>
    `;

    // Create the latest posts container
    return createElement(
      'div',
      {
        class: classes,
        'data-posts-to-show': postsToShow,
        'data-display-post-date': displayPostDate ? 'true' : 'false',
        'data-display-featured-image': displayFeaturedImage ? 'true' : 'false',
        'data-display-post-content': displayPostContent ? 'true' : 'false',
        'data-post-layout': postLayout,
        'data-columns': columns,
        'data-order': order,
        'data-order-by': orderBy,
        'data-categories': categories.join(','),
      },
      content,
    );
  },

  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'my-6',
      postLayout: {
        list: '',
        grid: 'grid gap-6',
      },
      columns: {
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
        6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-6',
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
      block: 'my-4',
      postLayout: {
        list: '',
        grid: 'row g-4',
      },
      columns: {
        2: 'row-cols-1 row-cols-md-2',
        3: 'row-cols-1 row-cols-md-3',
        4: 'row-cols-1 row-cols-md-4',
        5: 'row-cols-1 row-cols-md-5',
        6: 'row-cols-1 row-cols-md-6',
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
 * Helper functions for CSS classes
 */
function getLatestPostsContainerClass(postLayout: string, cssFramework?: string): string {
  if (postLayout === 'grid') {
    switch (cssFramework) {
      case 'tailwind':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
      case 'bootstrap':
        return 'row row-cols-1 row-cols-md-3 g-4';
      default:
        return 'wp-block-latest-posts__grid-container';
    }
  }

  switch (cssFramework) {
    case 'tailwind':
      return 'space-y-4';
    case 'bootstrap':
      return 'list-unstyled';
    default:
      return 'wp-block-latest-posts__list';
  }
}

function getLatestPostItemClass(postLayout: string, cssFramework?: string): string {
  if (postLayout === 'grid') {
    switch (cssFramework) {
      case 'tailwind':
        return 'flex flex-col h-full';
      case 'bootstrap':
        return 'col';
      default:
        return 'wp-block-latest-posts__grid-item';
    }
  }

  switch (cssFramework) {
    case 'tailwind':
      return 'flex flex-col mb-4';
    case 'bootstrap':
      return 'mb-3';
    default:
      return 'wp-block-latest-posts__list-item';
  }
}

function getLatestPostImageClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'mb-2';
    case 'bootstrap':
      return 'mb-2';
    default:
      return 'wp-block-latest-posts__featured-image';
  }
}

function getLatestPostContentClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'flex-1';
    case 'bootstrap':
      return '';
    default:
      return 'wp-block-latest-posts__content';
  }
}

function getLatestPostTitleClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'text-lg font-bold mb-1';
    case 'bootstrap':
      return 'h5 mb-1';
    default:
      return 'wp-block-latest-posts__title';
  }
}

function getLatestPostDateClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'text-sm text-gray-500 mb-2';
    case 'bootstrap':
      return 'small text-muted mb-2';
    default:
      return 'wp-block-latest-posts__date';
  }
}

function getLatestPostExcerptClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'text-sm text-gray-700';
    case 'bootstrap':
      return 'small';
    default:
      return 'wp-block-latest-posts__excerpt';
  }
}
