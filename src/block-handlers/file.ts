import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';

/**
 * Handler for the 'core/file' block
 */
export const fileBlockHandler: BlockHandler = {
  /**
   * Transform a file block to HTML
   * @param block File block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);
    
    // Extract the file content from innerContent
    let content = '';
    
    // If there's innerHTML, use that
    if (block.innerHTML) {
      content = block.innerHTML;
    } 
    // Otherwise join innerContent
    else if (block.innerContent.length > 0) {
      content = block.innerContent.join('');
    }
    
    // Extract file attributes
    const href = block.attrs?.href || '';
    const fileName = block.attrs?.fileName || '';
    const textLinkHref = block.attrs?.textLinkHref || href;
    const showDownloadButton = block.attrs?.showDownloadButton !== false;
    const downloadButtonText = block.attrs?.downloadButtonText || 'Download';
    const displayPreview = block.attrs?.displayPreview;
    const previewHeight = block.attrs?.previewHeight;
    
    // If we already have a div with the file structure, we'll modify its attributes
    if (content.trim().startsWith('<div') && content.trim().endsWith('</div>')) {
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
          /^<div/,
          `<div class="${classes}"`
        );
      }
      
      return content;
    }
    
    // If no file structure, create one
    let fileContent = '';
    
    // Create file preview if needed
    if (displayPreview && href && href.match(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/i)) {
      const previewStyle = previewHeight ? `height: ${previewHeight}px;` : '';
      fileContent += `<div class="${getPreviewClass(options.cssFramework)}" style="${previewStyle}">
        <iframe src="${href}" frameborder="0"></iframe>
      </div>`;
    }
    
    // Create file name and download button
    fileContent += `<div class="${getFileInfoClass(options.cssFramework)}">`;
    
    // Add file name with link
    if (fileName) {
      fileContent += `<a href="${textLinkHref}" class="${getFileLinkClass(options.cssFramework)}">${fileName}</a>`;
    }
    
    // Add download button if needed
    if (showDownloadButton) {
      fileContent += `<a href="${href}" class="${getDownloadButtonClass(options.cssFramework)}" download>${downloadButtonText}</a>`;
    }
    
    fileContent += '</div>';
    
    // Wrap in a div
    return createElement('div', { class: classes }, fileContent);
  },
  
  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'my-4 p-4 border border-gray-200 rounded',
      align: {
        left: 'mr-auto',
        center: 'mx-auto',
        right: 'ml-auto',
      },
    },
    
    // Bootstrap mappings
    bootstrap: {
      block: 'my-3 p-3 border rounded',
      align: {
        left: 'float-start',
        center: 'd-block mx-auto',
        right: 'float-end',
      },
    },
  },
};

/**
 * Helper function to get the preview class
 */
function getPreviewClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'w-full mb-4 border border-gray-200 rounded overflow-hidden';
    case 'bootstrap':
      return 'w-100 mb-3 border rounded overflow-hidden';
    default:
      return 'wp-block-file__preview';
  }
}

/**
 * Helper function to get the file info class
 */
function getFileInfoClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'flex flex-wrap items-center justify-between';
    case 'bootstrap':
      return 'd-flex flex-wrap align-items-center justify-content-between';
    default:
      return 'wp-block-file__info';
  }
}

/**
 * Helper function to get the file link class
 */
function getFileLinkClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'text-blue-600 hover:underline mr-4';
    case 'bootstrap':
      return 'text-primary me-3';
    default:
      return 'wp-block-file__link';
  }
}

/**
 * Helper function to get the download button class
 */
function getDownloadButtonClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700';
    case 'bootstrap':
      return 'btn btn-primary';
    default:
      return 'wp-block-file__button';
  }
} 