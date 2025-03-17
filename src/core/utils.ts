import { CSSClassMapping, ConversionOptions, BlockHandler, Block } from '../types';

/**
 * Merge default options with user-provided options
 * @param defaults Default options
 * @param userOptions User-provided options
 * @returns Merged options object
 */
export function mergeOptions<T extends Record<string, any>>(
  defaults: T,
  userOptions: Partial<T>
): T {
  return { ...defaults, ...userOptions };
}

/**
 * Get CSS classes for a block based on the specified CSS framework
 * @param block WordPress block data
 * @param blockHandler Block handler with CSS mappings
 * @param options Conversion options
 * @returns CSS class string
 */
export function getBlockClasses(
  block: Block,
  blockHandler: BlockHandler,
  options: ConversionOptions
): string {
  const { cssFramework = 'none', customClassMap = {} } = options;
  
  // Start with empty set of classes
  const classes: string[] = [];
  
  // Add default WordPress classes if not using a CSS framework
  if (cssFramework === 'none') {
    if (block.blockName) {
      // Convert core/paragraph to wp-block-paragraph
      const blockClass = `wp-block-${block.blockName.replace('core/', '')}`;
      classes.push(blockClass);
    }
    
    // Add alignment classes if present
    if (block.attrs?.align) {
      classes.push(`has-text-align-${block.attrs.align}`);
    }
  } else {
    // Get the appropriate CSS framework mappings
    let cssMapping: CSSClassMapping | undefined;
    
    // Check for custom mapping first
    if (customClassMap[block.blockName]) {
      cssMapping = customClassMap[block.blockName];
    } 
    // Then fallback to built-in mapping for the framework
    else if (blockHandler.cssMapping?.[cssFramework]) {
      cssMapping = blockHandler.cssMapping[cssFramework];
    }
    
    if (cssMapping) {
      // Add base block class if defined
      if (cssMapping.block) {
        classes.push(cssMapping.block);
      }
      
      // Add attribute-specific classes
      if (block.attrs) {
        for (const [attr, value] of Object.entries(block.attrs)) {
          const attrMapping = cssMapping[attr];
          if (typeof attrMapping === 'string') {
            classes.push(attrMapping);
          } else if (typeof attrMapping === 'object' && attrMapping !== null) {
            const mappedValue = attrMapping[value as string];
            if (mappedValue) {
              classes.push(mappedValue);
            }
          }
        }
      }
    }
  }
  
  return classes.join(' ');
}

/**
 * Create an HTML element with the given tag, attributes, and content
 * @param tag HTML tag name
 * @param attrs HTML attributes
 * @param content Inner content
 * @returns HTML string
 */
export function createElement(
  tag: string,
  attrs: Record<string, string | boolean | number> = {},
  content: string = ''
): string {
  const attributeStr = Object.entries(attrs)
    .map(([key, value]) => {
      // Handle boolean attributes
      if (typeof value === 'boolean') {
        return value ? key : '';
      }
      // Handle regular attributes
      return `${key}="${String(value).replace(/"/g, '&quot;')}"`;
    })
    .filter(Boolean)
    .join(' ');
  
  const openTag = attributeStr ? `<${tag} ${attributeStr}>` : `<${tag}>`;
  
  // Handle self-closing tags
  const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link'];
  if (selfClosingTags.includes(tag) && !content) {
    return openTag.replace(/>$/, ' />');
  }
  
  return `${openTag}${content}</${tag}>`;
}

/**
 * Process inner blocks recursively
 * @param block Block with inner blocks
 * @param options Conversion options
 * @returns Processed inner blocks HTML
 */
export function processInnerBlocks(block: Block, options: ConversionOptions): string {
  if (!block.innerBlocks || block.innerBlocks.length === 0) {
    return '';
  }
  
  return block.innerBlocks
    .map(innerBlock => {
      // This will require importing convertBlock from converter.ts
      // We'll use a placeholder function to avoid circular dependency
      return processBlock(innerBlock, options);
    })
    .join('');
}

// Placeholder for now - will be implemented to avoid circular dependencies
function processBlock(block: Block, options: ConversionOptions): string {
  // This will be properly implemented to avoid circular import
  return block.innerContent.join('') || '';
} 