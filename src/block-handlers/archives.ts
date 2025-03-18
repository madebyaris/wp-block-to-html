import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';

/**
 * Handler for the 'core/archives' block
 */
export const archivesBlockHandler: BlockHandler = {
  /**
   * Transform an archives block to HTML
   * @param block Archives block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);

    // Extract archives attributes
    const displayAsDropdown = block.attrs?.displayAsDropdown || false;
    const showPostCounts = block.attrs?.showPostCounts || false;
    const type = block.attrs?.type || 'monthly';

    // Create a placeholder for the archives
    // In a real implementation, this would be replaced with actual archives data
    let content = '';

    // Check if we have a custom archives processor in options
    if (options.customArchivesProcessor && typeof options.customArchivesProcessor === 'function') {
      try {
        const processedContent = options.customArchivesProcessor(block, options);
        if (processedContent) {
          return processedContent;
        }
      } catch (error) {
        console.error('Error processing archives:', error);
      }
    }

    // If no custom processor or it failed, return a placeholder
    if (displayAsDropdown) {
      content = `
        <select class="${getArchivesSelectClass(options.cssFramework)}">
          <option>Select an archive</option>
          ${generateArchivePlaceholders(5, type, showPostCounts)}
        </select>
      `;
    } else {
      content = `
        <ul class="${getArchivesListClass(options.cssFramework)}">
          ${generateArchivePlaceholders(5, type, showPostCounts)}
        </ul>
      `;
    }

    // Create the archives container
    return createElement(
      'div',
      {
        class: classes,
        'data-display-as-dropdown': displayAsDropdown ? 'true' : 'false',
        'data-show-post-counts': showPostCounts ? 'true' : 'false',
        'data-type': type,
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
function getArchivesSelectClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'block w-full p-2 border border-gray-300 rounded';
    case 'bootstrap':
      return 'form-select';
    default:
      return 'wp-block-archives-dropdown';
  }
}

function getArchivesListClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'list-disc pl-5 space-y-2';
    case 'bootstrap':
      return 'list-unstyled';
    default:
      return 'wp-block-archives-list';
  }
}

/**
 * Generate placeholder archive items
 */
function generateArchivePlaceholders(count: number, type: string, showPostCounts: boolean): string {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  if (type === 'monthly') {
    return Array(count)
      .fill(0)
      .map((_, i) => {
        const monthIndex = (currentMonth - i + 12) % 12;
        const year = currentYear - Math.floor((i + currentMonth) / 12);
        const month = months[monthIndex];
        const postCount = Math.floor(Math.random() * 10) + 1;

        if (showPostCounts) {
          return `<option value="${year}/${monthIndex + 1}">${month} ${year} (${postCount})</option>`;
        }
        return `<option value="${year}/${monthIndex + 1}">${month} ${year}</option>`;
      })
      .join('');
  } else {
    return Array(count)
      .fill(0)
      .map((_, i) => {
        const year = currentYear - i;
        const postCount = Math.floor(Math.random() * 30) + 5;

        if (showPostCounts) {
          return `<option value="${year}">${year} (${postCount})</option>`;
        }
        return `<option value="${year}">${year}</option>`;
      })
      .join('');
  }
}
