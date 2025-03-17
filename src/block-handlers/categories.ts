import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';

/**
 * Handler for the 'core/categories' block
 */
export const categoriesBlockHandler: BlockHandler = {
  /**
   * Transform a categories block to HTML
   * @param block Categories block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);
    
    // Extract categories attributes
    const displayAsDropdown = block.attrs?.displayAsDropdown || false;
    const showHierarchy = block.attrs?.showHierarchy || false;
    const showPostCounts = block.attrs?.showPostCounts || false;
    const showOnlyTopLevel = block.attrs?.showOnlyTopLevel || false;
    
    // Create a placeholder for the categories
    // In a real implementation, this would be replaced with actual categories data
    let content = '';
    
    // Check if we have a custom categories processor in options
    if (options.customCategoriesProcessor && typeof options.customCategoriesProcessor === 'function') {
      try {
        const processedContent = options.customCategoriesProcessor(block, options);
        if (processedContent) {
          return processedContent;
        }
      } catch (error) {
        console.error('Error processing categories:', error);
      }
    }
    
    // If no custom processor or it failed, return a placeholder
    if (displayAsDropdown) {
      content = `
        <select class="${getCategoriesSelectClass(options.cssFramework)}">
          <option>Select a category</option>
          ${generateCategoryPlaceholders(5, showHierarchy, showPostCounts, showOnlyTopLevel)}
        </select>
      `;
    } else {
      content = `
        <ul class="${getCategoriesListClass(options.cssFramework)}">
          ${generateCategoryPlaceholders(5, showHierarchy, showPostCounts, showOnlyTopLevel)}
        </ul>
      `;
    }
    
    // Create the categories container
    return createElement('div', { 
      class: classes,
      'data-display-as-dropdown': displayAsDropdown ? 'true' : 'false',
      'data-show-hierarchy': showHierarchy ? 'true' : 'false',
      'data-show-post-counts': showPostCounts ? 'true' : 'false',
      'data-show-only-top-level': showOnlyTopLevel ? 'true' : 'false'
    }, content);
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
function getCategoriesSelectClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'block w-full p-2 border border-gray-300 rounded';
    case 'bootstrap':
      return 'form-select';
    default:
      return 'wp-block-categories-dropdown';
  }
}

function getCategoriesListClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'list-disc pl-5 space-y-2';
    case 'bootstrap':
      return 'list-unstyled';
    default:
      return 'wp-block-categories-list';
  }
}

/**
 * Generate placeholder category items
 */
function generateCategoryPlaceholders(
  count: number, 
  showHierarchy: boolean, 
  showPostCounts: boolean,
  showOnlyTopLevel: boolean
): string {
  const categories = [
    { id: 1, name: 'Uncategorized', count: 5, parent: 0 },
    { id: 2, name: 'Technology', count: 12, parent: 0 },
    { id: 3, name: 'Programming', count: 8, parent: 2 },
    { id: 4, name: 'Web Development', count: 6, parent: 3 },
    { id: 5, name: 'Design', count: 7, parent: 0 },
    { id: 6, name: 'UI/UX', count: 4, parent: 5 },
    { id: 7, name: 'Graphic Design', count: 3, parent: 5 },
  ];
  
  // Filter categories based on showOnlyTopLevel
  const filteredCategories = showOnlyTopLevel 
    ? categories.filter(cat => cat.parent === 0)
    : categories;
  
  // Limit to the requested count
  const limitedCategories = filteredCategories.slice(0, count);
  
  if (showHierarchy && !showOnlyTopLevel) {
    // For hierarchical display, we need to build a tree
    return buildCategoryHierarchy(categories, 0, showPostCounts);
  } else {
    // For flat display, just list the categories
    return limitedCategories.map(cat => {
      const postCountText = showPostCounts ? ` (${cat.count})` : '';
      return `<li><a href="#">${cat.name}${postCountText}</a></li>`;
    }).join('');
  }
}

/**
 * Build a hierarchical category list
 */
function buildCategoryHierarchy(
  categories: Array<{id: number, name: string, count: number, parent: number}>,
  parentId: number,
  showPostCounts: boolean,
  level: number = 0
): string {
  const children = categories.filter(cat => cat.parent === parentId);
  
  if (children.length === 0) {
    return '';
  }
  
  return children.map(cat => {
    const postCountText = showPostCounts ? ` (${cat.count})` : '';
    const padding = level > 0 ? ' style="margin-left: ' + (level * 20) + 'px;"' : '';
    
    const childrenHtml = buildCategoryHierarchy(categories, cat.id, showPostCounts, level + 1);
    
    if (childrenHtml) {
      return `
        <li${padding}><a href="#">${cat.name}${postCountText}</a>
          <ul>
            ${childrenHtml}
          </ul>
        </li>
      `;
    } else {
      return `<li${padding}><a href="#">${cat.name}${postCountText}</a></li>`;
    }
  }).join('');
} 