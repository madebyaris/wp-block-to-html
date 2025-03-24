import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement, processContentWithRenderMode } from '../core/utils';

/**
 * Handler for the 'core/list' block
 * Enhanced with support for complex nesting patterns
 */
export const listBlockHandler: BlockHandler = {
  /**
   * Transform a list block to HTML
   * @param block List block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);

    // Determine list type (ordered or unordered)
    const isOrdered = block.attrs?.ordered === true;
    const tag = isOrdered ? 'ol' : 'ul';

    // Additional classes based on list type
    const typeClass = isOrdered
      ? this.cssMapping?.[options.cssFramework || 'default']?.ordered || ''
      : this.cssMapping?.[options.cssFramework || 'default']?.unordered || '';

    const combinedClasses = classes + (typeClass ? ` ${typeClass}` : '');

    // Extract the list content from innerContent
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

    // For lists, we need special handling to maintain nesting structure
    if (renderMode === 'rebuild') {
      // Handle nested lists
      return this.processNestedList?.(content, tag, combinedClasses, block, options) || '';
    }

    // For 'respect' and 'preserve-attrs' modes, use the utility function
    return processContentWithRenderMode(content, tag, { class: combinedClasses }, renderMode);
  },

  /**
   * Process a potentially nested list structure
   */
  processNestedList(
    content: string,
    tag: string,
    classes: string,
    block: Block,
    options: ConversionOptions,
  ): string {
    // First, we need to ensure that all nested lists (ul, ol) have proper class attributes
    let processedContent = content;

    // Get the mapping for list classes
    const cssMapping = this.cssMapping?.[options.cssFramework || 'default'] || {};
    const nestedClass = cssMapping.nested || '';
    const orderedClass = cssMapping.ordered || '';
    const unorderedClass = cssMapping.unordered || '';

    // Add classes to all nested ul elements that don't already have a class
    if (processedContent.includes('<ul') && !processedContent.includes('<ul class=')) {
      processedContent = processedContent.replace(
        /<ul(?![^>]*class=)/g,
        `<ul class="${nestedClass} ${unorderedClass}"`,
      );
    }

    // Add classes to all nested ol elements that don't already have a class
    if (processedContent.includes('<ol') && !processedContent.includes('<ol class=')) {
      processedContent = processedContent.replace(
        /<ol(?![^>]*class=)/g,
        `<ol class="${nestedClass} ${orderedClass}"`,
      );
    }

    // Check if this is a standard list structure
    const listRegex = new RegExp(`^<${tag}[^>]*>(.*)</${tag}>$`, 's');
    const match = processedContent.match(listRegex);

    if (match) {
      // Get the inner content of the list
      const itemsContent = match[1];

      // Process the list items and handle nested lists
      const nestedContent = this.processListItems?.(itemsContent, block, options) || itemsContent;

      return createElement(tag, { class: classes }, nestedContent);
    }

    // If content doesn't match the expected pattern, process it differently
    return this.processUnstructuredList?.(processedContent, tag, classes, block, options) || '';
  },

  /**
   * Process list items including nested lists with proper class application
   */
  processListItems(content: string, block: Block, options: ConversionOptions): string {
    // Enhanced regex to detect list items with potential nested lists
    const itemRegex = /<li[^>]*>((?:(?!<li[^>]*>|<\/li>).|\n)*)<\/li>/gi;

    let processedContent = content;

    // Replace each list item, preserving and enhancing nested lists
    processedContent = processedContent.replace(itemRegex, (match, itemContent) => {
      // Check if item contains a nested list
      if (/<(ol|ul)[^>]*>/.test(itemContent)) {
        // Apply the appropriate classes to nested lists
        return this.processItemWithNestedList?.(match, itemContent, block, options) || match;
      }

      // Regular list item without nesting
      return match;
    });

    return processedContent;
  },

  /**
   * Process a list item that contains nested lists
   */
  processItemWithNestedList(
    match: string,
    itemContent: string,
    block: Block,
    options: ConversionOptions,
  ): string {
    // Extract list item text content and nested lists
    const nestedListRegex = /(<(ol|ul)[^>]*>(?:.|\n)*?<\/\2>)/g;

    // Split the item content by nested list tags
    const parts = itemContent.split(nestedListRegex);

    const processedParts = [];
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      // Check if this is a nested list
      if (i % 3 === 1 && part) {
        // Every 3rd element (1, 4, 7, etc.) is a matched list
        const listType = parts[i + 1]; // The capture group with the list type (ol or ul)

        // Get appropriate classes for this list type
        const isNestedOrdered = listType === 'ol';
        const nestedTypeClass = isNestedOrdered
          ? this.cssMapping?.[options.cssFramework || 'default']?.ordered || ''
          : this.cssMapping?.[options.cssFramework || 'default']?.unordered || '';

        // Get base classes for nested lists
        const nestedBaseClass = this.cssMapping?.[options.cssFramework || 'default']?.nested || '';
        const nestedClasses = nestedBaseClass + (nestedTypeClass ? ` ${nestedTypeClass}` : '');

        // Apply classes to the nested list
        let processedPart = part;

        // First, check if this list has a class attribute already
        const hasClass = /class=["'][^"']*["']/.test(part);

        if (hasClass) {
          // Combine with existing classes
          processedPart = part.replace(/class=["']([^"']*)["']/, (match, existing) => {
            return `class="${existing} ${nestedClasses}"`;
          });
        } else {
          // Add new class attribute
          processedPart = part.replace(
            new RegExp(`<(${listType})`, 'i'),
            `<$1 class="${nestedClasses}"`,
          );
        }

        // Also process any nested unordered lists that might be inside this list
        if (listType === 'ol' && processedPart.includes('<ul')) {
          processedPart = processedPart.replace(
            /<ul(?![^>]*class=["'][^"']*["'])/g,
            `<ul class="${this.cssMapping?.[options.cssFramework || 'default']?.nested || ''} ${this.cssMapping?.[options.cssFramework || 'default']?.unordered || ''}"`,
          );
        }
        // Process any nested ordered lists
        else if (listType === 'ul' && processedPart.includes('<ol')) {
          processedPart = processedPart.replace(
            /<ol(?![^>]*class=["'][^"']*["'])/g,
            `<ol class="${this.cssMapping?.[options.cssFramework || 'default']?.nested || ''} ${this.cssMapping?.[options.cssFramework || 'default']?.ordered || ''}"`,
          );
        }

        processedParts.push(processedPart);
      } else if (i % 3 !== 2) {
        // Skip the capture group with just the tag name
        processedParts.push(part);
      }
    }

    // Extract the list item tag and attributes
    const liMatch = match.match(/<li([^>]*)>/);
    const liAttrs = liMatch ? liMatch[1] : '';

    return `<li${liAttrs}>${processedParts.join('')}</li>`;
  },

  /**
   * Process unstructured list content
   */
  processUnstructuredList(
    content: string,
    tag: string,
    classes: string,
    block: Block,
    options: ConversionOptions,
  ): string {
    // First check if we have mixed list types (<ol> and <ul>) at the root level
    if ((tag === 'ol' && content.includes('<ul')) || (tag === 'ul' && content.includes('<ol'))) {
      // We have mixed list types - extract the structure
      const itemsPattern = /<li[^>]*>(?:.|\n)*?<\/li>/g;
      const items = content.match(itemsPattern) || [];

      // Process each item which might contain nested lists
      const processedItems = items.map((item) => {
        // Check for nested lists within items
        if (/<(ol|ul)[^>]*>/.test(item)) {
          return (
            this.processItemWithNestedList?.(
              item,
              item.replace(/<li[^>]*>|<\/li>/g, ''),
              block,
              options,
            ) || item
          );
        }
        return item;
      });

      return createElement(tag, { class: classes }, processedItems.join(''));
    }

    // Split by list item tags
    const items = content
      .split('<li')
      .filter(Boolean)
      .map((item) => {
        // Remove closing tags and trim
        const cleanItem = item.replace('</li>', '').trim();

        // If item starts with >, add it back (it was part of the <li> tag)
        const prefix = cleanItem.startsWith('>') ? '>' : '';
        const itemContent = prefix ? cleanItem.substring(1).trim() : cleanItem;

        // Check for nested lists
        if (/<(ol|ul)[^>]*>/.test(itemContent)) {
          // Process the nested list
          const processedContent =
            this.processItemWithNestedList?.(
              `<li${prefix}${itemContent}</li>`,
              itemContent,
              block,
              options,
            ) || `<li${prefix}${itemContent}</li>`;
          return processedContent;
        }

        return `<li${prefix}${itemContent}</li>`;
      });

    return createElement(tag, { class: classes }, items.join(''));
  },

  // CSS framework mappings
  cssMapping: {
    // Default mappings (WordPress)
    default: {
      block: '',
      ordered: 'wp-block-list is-ordered',
      unordered: 'wp-block-list',
      nested: '', // Classes specific to nested lists
      align: {
        left: 'has-text-align-left',
        center: 'has-text-align-center',
        right: 'has-text-align-right',
      },
      indent: {
        1: 'indent-1',
        2: 'indent-2',
        3: 'indent-3',
      },
    },

    // Tailwind CSS mappings
    tailwind: {
      block: 'my-4',
      ordered: 'list-decimal pl-5 space-y-1',
      unordered: 'list-disc pl-5 space-y-1',
      nested: 'mt-2 pl-4', // Classes specific to nested lists
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
      indent: {
        1: 'ml-4',
        2: 'ml-8',
        3: 'ml-12',
      },
    },

    // Bootstrap mappings
    bootstrap: {
      block: 'my-3',
      ordered: 'list-group list-group-numbered',
      unordered: 'list-group',
      nested: 'ps-4 mt-2', // Classes specific to nested lists
      align: {
        left: 'text-start',
        center: 'text-center',
        right: 'text-end',
      },
      indent: {
        1: 'ps-4',
        2: 'ps-5',
        3: 'ps-6',
      },
    },
  },
};
