import { CSSClassMapping, ConversionOptions, BlockHandler, Block } from '../types';

/**
 * Merge default options with user-provided options
 * @param defaults Default options
 * @param userOptions User-provided options
 * @returns Merged options object
 */
export function mergeOptions<T extends Record<string, any>>(
  defaults: T,
  userOptions: Partial<T>,
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
  options: ConversionOptions,
): string {
  const { cssFramework = 'none', customClassMap = {} } = options;

  // Start with empty set of classes
  const classes: string[] = [];

  // Debug log
  console.log(`Applying classes for block: ${block.blockName}, framework: ${cssFramework}`);

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
      console.log('Using custom mapping:', cssMapping);
    }
    // Then fallback to built-in mapping for the framework
    else if (blockHandler.cssMapping?.[cssFramework]) {
      cssMapping = blockHandler.cssMapping[cssFramework];
      console.log('Using built-in mapping:', cssMapping);
    }

    if (cssMapping) {
      // Add base block class if defined
      if (cssMapping.block) {
        classes.push(cssMapping.block);
        console.log(`Added base class: ${cssMapping.block}`);
      }

      // Add attribute-specific classes
      if (block.attrs) {
        console.log('Block attributes:', block.attrs);
        for (const [attr, value] of Object.entries(block.attrs)) {
          const attrMapping = cssMapping[attr];
          if (typeof attrMapping === 'string') {
            classes.push(attrMapping);
            console.log(`Added attribute class for ${attr}: ${attrMapping}`);
          } else if (typeof attrMapping === 'object' && attrMapping !== null) {
            const mappedValue = attrMapping[value as string];
            if (mappedValue) {
              classes.push(mappedValue);
              console.log(`Added mapped class for ${attr}=${value}: ${mappedValue}`);
            }
          }
        }
      }
    } else {
      console.log(`No CSS mapping found for ${block.blockName} with framework ${cssFramework}`);
    }
  }

  const result = classes.join(' ');
  console.log(`Final classes for ${block.blockName}: "${result}"`);
  return result;
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
  content: string = '',
): string {
  // Ensure class attribute is a non-empty string
  if ('class' in attrs && typeof attrs.class === 'string') {
    attrs.class = attrs.class.trim();
    if (attrs.class === '') {
      delete attrs.class;
    }
  }

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
  if (selfClosingTags.indexOf(tag) !== -1 && !content) {
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
    .map((innerBlock) => {
      // This will require importing convertBlock from converter.ts
      // We'll use a placeholder function to avoid circular dependency
      return processBlock(innerBlock, options);
    })
    .join('');
}

// Placeholder for now - will be implemented to avoid circular dependencies
function processBlock(block: Block, _options: ConversionOptions): string {
  // This will be properly implemented to avoid circular import
  return block.innerContent.join('') || '';
}

/**
 * Process content based on rendering mode
 * @param content Original content which may contain HTML tags
 * @param tag HTML tag to use if rebuilding (e.g., 'p', 'div', 'h2')
 * @param attributes Attributes to apply to the element
 * @param renderMode Rendering mode ('respect', 'rebuild', or 'preserve-attrs')
 * @returns Processed HTML content
 */
export function processContentWithRenderMode(
  content: string,
  tag: string,
  attributes: Record<string, string | boolean | number> = {},
  renderMode: 'respect' | 'rebuild' | 'preserve-attrs' = 'rebuild',
): string {
  // Check if content already has the specified tag
  const tagRegex = new RegExp(`^<${tag}[^>]*>(.*)</${tag}>$`, 's');
  const hasTag = tagRegex.test(content.trim());

  // If content doesn't have the tag, just wrap it
  if (!hasTag) {
    return createElement(tag, attributes, content);
  }

  // Handle based on rendering mode
  if (renderMode === 'respect') {
    // Return the original HTML as provided
    return content;
  }

  if (renderMode === 'preserve-attrs') {
    // Keep the original tag but add our attributes
    let processedContent = content;

    // Process each attribute
    Object.entries(attributes).forEach(([key, value]) => {
      if (!value) return; // Skip false, null, undefined, empty string

      const attrRegex = new RegExp(`${key}="([^"]*)"`, 'i');
      const hasAttr = attrRegex.test(processedContent);

      if (hasAttr) {
        // If the attribute already exists, merge values for class, or replace others
        if (key === 'class') {
          processedContent = processedContent.replace(attrRegex, (match, existingClass) => {
            const combinedClass = `${existingClass} ${value}`.trim();
            return `class="${combinedClass}"`;
          });
        } else {
          // Replace other attributes
          processedContent = processedContent.replace(attrRegex, `${key}="${value}"`);
        }
      } else {
        // Add attribute if it doesn't exist
        processedContent = processedContent.replace(
          new RegExp(`<${tag}([^>]*)>`, 'i'),
          `<${tag}$1 ${key}="${value}">`,
        );
      }
    });

    return processedContent;
  }

  // Default case (rebuild)
  // Extract content and rebuild with our attributes
  const contentMatch = content.match(tagRegex);
  const innerContent = contentMatch ? contentMatch[1] : content;
  return createElement(tag, attributes, innerContent);
}

/**
 * Enhances rendered HTML content from WordPress with framework-specific styling
 * This is especially useful for the 'hybrid' content handling mode
 * @param content The rendered HTML content from WordPress
 * @param options Conversion options containing cssFramework and other settings
 * @returns Enhanced HTML with framework-specific styling
 */
export function enhanceRenderedHTML(content: string, options: ConversionOptions): string {
  const { cssFramework = 'none' } = options;

  if (cssFramework === 'none') {
    return content; // No enhancement needed if not using a CSS framework
  }

  try {
    let enhancedContent = content;

    // Framework-specific class mappings
    const frameworkClasses: Record<string, Record<string, Record<string, string>>> = {
      // Tailwind CSS classes
      tailwind: {
        headings: {
          h1: 'text-4xl mb-6 mt-10 font-extrabold',
          h2: 'text-3xl mb-5 mt-8 font-bold',
          h3: 'text-2xl mb-4 mt-6 font-bold',
          h4: 'text-xl mb-4 mt-4 font-semibold',
          h5: 'text-lg mb-3 mt-4 font-semibold',
          h6: 'text-base mb-3 mt-2 font-medium',
        },
        paragraph: {
          p: 'mb-4',
        },
        list: {
          ul: 'list-disc pl-6 mb-4',
          ol: 'list-decimal pl-6 mb-4',
          li: 'mb-1',
        },
        image: {
          img: 'rounded-lg my-8 w-full h-auto max-w-full object-cover',
          figure: 'my-8',
          figcaption: 'text-sm text-gray-600 mt-2',
        },
        blockquote: {
          blockquote: 'pl-4 border-l-4 border-gray-300 italic my-6',
        },
        table: {
          table: 'min-w-full border-collapse mb-6',
          th: 'border border-gray-300 px-4 py-2 bg-gray-100',
          td: 'border border-gray-300 px-4 py-2',
        },
        code: {
          pre: 'bg-gray-100 p-4 rounded-lg overflow-x-auto mb-6',
          code: 'font-mono text-sm',
        },
        alignments: {
          alignleft: 'float-left mr-6 mb-4 max-w-[50%]',
          alignright: 'float-right ml-6 mb-4 max-w-[50%]',
          aligncenter: 'mx-auto block',
          alignnone: 'block',
        },
      },
      // Bootstrap classes
      bootstrap: {
        headings: {
          h1: 'display-4 mb-4 mt-5',
          h2: 'display-5 mb-3 mt-4',
          h3: 'h3 mb-3 mt-4',
          h4: 'h4 mb-3 mt-3',
          h5: 'h5 mb-2 mt-3',
          h6: 'h6 mb-2 mt-2',
        },
        paragraph: {
          p: 'mb-3',
        },
        list: {
          ul: 'list-unstyled ps-4 mb-3',
          ol: 'ps-4 mb-3',
          li: 'mb-2',
        },
        image: {
          img: 'img-fluid my-4',
          figure: 'figure my-4',
          figcaption: 'figure-caption text-center',
        },
        blockquote: {
          blockquote: 'blockquote border-start border-secondary border-3 ps-3 my-4',
        },
        table: {
          table: 'table table-bordered mb-4',
          th: 'table-light',
          td: '',
        },
        code: {
          pre: 'bg-light p-3 rounded mb-4',
          code: 'font-monospace',
        },
        alignments: {
          alignleft: 'float-start me-3 mb-3',
          alignright: 'float-end ms-3 mb-3',
          aligncenter: 'mx-auto d-block',
          alignnone: 'd-block',
        },
      },
      // Add more frameworks as needed
    };

    // Get classes for the selected framework
    const classes = frameworkClasses[cssFramework] || {};

    // Transform headings
    for (const [tag, classList] of Object.entries(classes.headings || {})) {
      enhancedContent = enhancedContent.replace(
        new RegExp(`<${tag}([^>]*)>([\\s\\S]*?)<\\/${tag}>`, 'g'),
        (match, attrs, content) => {
          // Preserve existing ID and classes
          const idMatch = attrs.match(/id=["']([^"']*)["']/);
          const idAttr = idMatch ? ` id="${idMatch[1]}"` : '';

          const classMatch = attrs.match(/class=["']([^"']*)["']/);
          const existingClasses = classMatch ? classMatch[1] + ' ' : '';

          // Clean attributes by removing existing id/class
          const cleanAttrs = attrs
            .replace(/id=["'][^"']*["']/g, '')
            .replace(/class=["'][^"']*["']/g, '');

          return `<${tag}${idAttr}${cleanAttrs} class="${existingClasses}${classList}">${content}</${tag}>`;
        },
      );
    }

    // Transform paragraphs
    if (classes.paragraph?.p) {
      enhancedContent = enhancedContent.replace(
        /<p([^>]*)>([\s\S]*?)<\/p>/g,
        (match, attrs, content) => {
          const classMatch = attrs.match(/class=["']([^"']*)["']/);
          const existingClasses = classMatch ? classMatch[1] + ' ' : '';

          // Clean attributes
          const cleanAttrs = attrs.replace(/class=["'][^"']*["']/g, '');

          return `<p${cleanAttrs} class="${existingClasses}${classes.paragraph.p}">${content}</p>`;
        },
      );
    }

    // Transform lists
    if (classes.list) {
      for (const [tag, classList] of Object.entries(classes.list)) {
        enhancedContent = enhancedContent.replace(
          new RegExp(`<${tag}([^>]*)>([\\s\\S]*?)<\\/${tag}>`, 'g'),
          (match, attrs, content) => {
            const classMatch = attrs.match(/class=["']([^"']*)["']/);
            const existingClasses = classMatch ? classMatch[1] + ' ' : '';

            // Clean attributes
            const cleanAttrs = attrs.replace(/class=["'][^"']*["']/g, '');

            return `<${tag}${cleanAttrs} class="${existingClasses}${classList}">${content}</${tag}>`;
          },
        );
      }
    }

    // Transform images
    if (classes.image?.img) {
      enhancedContent = enhancedContent.replace(/<img([^>]*)>/g, (match, attrs) => {
        const classMatch = attrs.match(/class=["']([^"']*)["']/);
        const existingClasses = classMatch ? classMatch[1] + ' ' : '';

        // Clean attributes
        const cleanAttrs = attrs.replace(/class=["'][^"']*["']/g, '');

        return `<img${cleanAttrs} class="${existingClasses}${classes.image.img}" loading="lazy">`;
      });
    }

    // Transform figures
    if (classes.image?.figure) {
      enhancedContent = enhancedContent.replace(
        /<figure([^>]*)>([\s\S]*?)<\/figure>/g,
        (match, attrs, content) => {
          const classMatch = attrs.match(/class=["']([^"']*)["']/);
          const existingClasses = classMatch ? classMatch[1] + ' ' : '';

          // Clean attributes
          const cleanAttrs = attrs.replace(/class=["'][^"']*["']/g, '');

          return `<figure${cleanAttrs} class="${existingClasses}${classes.image.figure}">${content}</figure>`;
        },
      );
    }

    // Transform figcaptions
    if (classes.image?.figcaption) {
      enhancedContent = enhancedContent.replace(
        /<figcaption([^>]*)>([\s\S]*?)<\/figcaption>/g,
        (match, attrs, content) => {
          const classMatch = attrs.match(/class=["']([^"']*)["']/);
          const existingClasses = classMatch ? classMatch[1] + ' ' : '';

          // Clean attributes
          const cleanAttrs = attrs.replace(/class=["'][^"']*["']/g, '');

          return `<figcaption${cleanAttrs} class="${existingClasses}${classes.image.figcaption}">${content}</figcaption>`;
        },
      );
    }

    // Transform blockquotes
    if (classes.blockquote?.blockquote) {
      enhancedContent = enhancedContent.replace(
        /<blockquote([^>]*)>([\s\S]*?)<\/blockquote>/g,
        (match, attrs, content) => {
          const classMatch = attrs.match(/class=["']([^"']*)["']/);
          const existingClasses = classMatch ? classMatch[1] + ' ' : '';

          // Clean attributes
          const cleanAttrs = attrs.replace(/class=["'][^"']*["']/g, '');

          return `<blockquote${cleanAttrs} class="${existingClasses}${classes.blockquote.blockquote}">${content}</blockquote>`;
        },
      );
    }

    // Transform tables
    if (classes.table?.table) {
      enhancedContent = enhancedContent.replace(
        /<table([^>]*)>([\s\S]*?)<\/table>/g,
        (match, attrs, content) => {
          const classMatch = attrs.match(/class=["']([^"']*)["']/);
          const existingClasses = classMatch ? classMatch[1] + ' ' : '';

          // Clean attributes
          const cleanAttrs = attrs.replace(/class=["'][^"']*["']/g, '');

          let processedContent = content;

          // Process table headers
          if (classes.table.th) {
            processedContent = processedContent.replace(
              /<th([^>]*)>([\s\S]*?)<\/th>/g,
              (match, attrs, content) => {
                const classMatch = attrs.match(/class=["']([^"']*)["']/);
                const existingClasses = classMatch ? classMatch[1] + ' ' : '';

                // Clean attributes
                const cleanAttrs = attrs.replace(/class=["'][^"']*["']/g, '');

                return `<th${cleanAttrs} class="${existingClasses}${classes.table.th}">${content}</th>`;
              },
            );
          }

          // Process table cells
          if (classes.table.td) {
            processedContent = processedContent.replace(
              /<td([^>]*)>([\s\S]*?)<\/td>/g,
              (match, attrs, content) => {
                const classMatch = attrs.match(/class=["']([^"']*)["']/);
                const existingClasses = classMatch ? classMatch[1] + ' ' : '';

                // Clean attributes
                const cleanAttrs = attrs.replace(/class=["'][^"']*["']/g, '');

                return `<td${cleanAttrs} class="${existingClasses}${classes.table.td}">${content}</td>`;
              },
            );
          }

          return `<table${cleanAttrs} class="${existingClasses}${classes.table.table}">${processedContent}</table>`;
        },
      );
    }

    // Transform code blocks
    if (classes.code?.pre) {
      enhancedContent = enhancedContent.replace(
        /<pre([^>]*)>([\s\S]*?)<\/pre>/g,
        (match, attrs, content) => {
          const classMatch = attrs.match(/class=["']([^"']*)["']/);
          const existingClasses = classMatch ? classMatch[1] + ' ' : '';

          // Clean attributes
          const cleanAttrs = attrs.replace(/class=["'][^"']*["']/g, '');

          return `<pre${cleanAttrs} class="${existingClasses}${classes.code.pre}">${content}</pre>`;
        },
      );
    }

    if (classes.code?.code) {
      enhancedContent = enhancedContent.replace(
        /<code([^>]*)>([\s\S]*?)<\/code>/g,
        (match, attrs, content) => {
          const classMatch = attrs.match(/class=["']([^"']*)["']/);
          const existingClasses = classMatch ? classMatch[1] + ' ' : '';

          // Clean attributes
          const cleanAttrs = attrs.replace(/class=["'][^"']*["']/g, '');

          return `<code${cleanAttrs} class="${existingClasses}${classes.code.code}">${content}</code>`;
        },
      );
    }

    // Transform WordPress alignment classes
    if (classes.alignments) {
      for (const [alignClass, classList] of Object.entries(classes.alignments)) {
        enhancedContent = enhancedContent.replace(
          new RegExp(`class=["']([^"']*\\b${alignClass}\\b[^"']*)["']`, 'g'),
          (match, existingClasses) => {
            // Replace the alignment class with framework-specific class
            return `class="${existingClasses.replace(alignClass, classList)}"`;
          },
        );
      }
    }

    return enhancedContent;
  } catch (error) {
    console.error('Error enhancing rendered HTML:', error);
    return content; // Return original content if there's an error
  }
}
