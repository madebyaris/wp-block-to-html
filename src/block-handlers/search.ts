import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';

/**
 * Handler for the 'core/search' block
 */
export const searchBlockHandler: BlockHandler = {
  /**
   * Transform a search block to HTML
   * @param block Search block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);
    
    // Extract search attributes
    const buttonText = block.attrs?.buttonText || 'Search';
    const buttonPosition = block.attrs?.buttonPosition || 'button-outside';
    const placeholder = block.attrs?.placeholder || 'Search...';
    const buttonUseIcon = block.attrs?.buttonUseIcon || false;
    
    // Create a placeholder for the search form
    let content = '';
    
    // Check if we have a custom search processor in options
    if (options.customSearchProcessor && typeof options.customSearchProcessor === 'function') {
      try {
        const processedContent = options.customSearchProcessor(block, options);
        if (processedContent) {
          return processedContent;
        }
      } catch (error) {
        console.error('Error processing search block:', error);
      }
    }
    
    // If no custom processor or it failed, return a default search form
    const inputClass = getSearchInputClass(options.cssFramework);
    const buttonClass = getSearchButtonClass(options.cssFramework);
    const formClass = getSearchFormClass(buttonPosition, options.cssFramework);
    
    // Create the search form based on button position
    if (buttonPosition === 'button-inside') {
      content = `
        <form role="search" method="get" action="#" class="${formClass}">
          <div class="${getSearchInputWrapperClass(options.cssFramework)}">
            <input type="search" class="${inputClass}" placeholder="${placeholder}" value="" name="s" />
            <button type="submit" class="${buttonClass}">
              ${buttonUseIcon ? getSearchIcon() : buttonText}
            </button>
          </div>
        </form>
      `;
    } else if (buttonPosition === 'no-button') {
      content = `
        <form role="search" method="get" action="#" class="${formClass}">
          <input type="search" class="${inputClass}" placeholder="${placeholder}" value="" name="s" />
        </form>
      `;
    } else {
      // button-outside (default)
      content = `
        <form role="search" method="get" action="#" class="${formClass}">
          <input type="search" class="${inputClass}" placeholder="${placeholder}" value="" name="s" />
          <button type="submit" class="${buttonClass}">
            ${buttonUseIcon ? getSearchIcon() : buttonText}
          </button>
        </form>
      `;
    }
    
    // Create the search container
    return createElement('div', { 
      class: classes,
      'data-button-position': buttonPosition,
      'data-button-use-icon': buttonUseIcon ? 'true' : 'false'
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
function getSearchFormClass(buttonPosition: string, cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return buttonPosition === 'button-outside' 
        ? 'flex flex-row gap-2' 
        : 'w-full';
    case 'bootstrap':
      return buttonPosition === 'button-outside'
        ? 'd-flex'
        : 'w-100';
    default:
      return 'wp-block-search__form';
  }
}

function getSearchInputWrapperClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'relative w-full';
    case 'bootstrap':
      return 'position-relative w-100';
    default:
      return 'wp-block-search__input-wrapper';
  }
}

function getSearchInputClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'block w-full p-2 border border-gray-300 rounded';
    case 'bootstrap':
      return 'form-control';
    default:
      return 'wp-block-search__input';
  }
}

function getSearchButtonClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600';
    case 'bootstrap':
      return 'btn btn-primary';
    default:
      return 'wp-block-search__button';
  }
}

/**
 * Get a simple search icon SVG
 */
function getSearchIcon(): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
    </svg>
  `;
} 