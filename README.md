# wp-block-to-html

Convert WordPress Gutenberg blocks to HTML or framework-specific components with customizable styling.

[![npm version](https://img.shields.io/npm/v/wp-block-to-html.svg)](https://www.npmjs.com/package/wp-block-to-html)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- Convert WordPress Gutenberg blocks to clean HTML
- Support for all WordPress core blocks
- Handle both raw block data and rendered HTML content
- Multiple content handling modes for switching between raw and rendered content
- Customizable CSS class mapping
- Built-in support for Tailwind CSS and Bootstrap
- Framework-specific output options (React, Vue, etc.)
- Extensible plugin system for custom blocks
- TypeScript support
- Minimal dependencies
- **Blazing fast performance** - Process up to 947 blocks per millisecond

## Installation

```bash
npm install wp-block-to-html
# or
yarn add wp-block-to-html
# or
pnpm add wp-block-to-html
```

## Basic Usage

```javascript
import { convertBlocks } from 'wp-block-to-html';

// WordPress Gutenberg block data
const blockData = {
  blocks: [
    {
      blockName: 'core/paragraph',
      attrs: { align: 'center' },
      innerContent: ['<p>Hello WordPress!</p>']
    },
    // More blocks...
  ]
};

// Convert to HTML
const html = convertBlocks(blockData);
console.log(html); // <p class="wp-block-paragraph has-text-align-center">Hello WordPress!</p>

// With Tailwind CSS
const tailwindHtml = convertBlocks(blockData, { cssFramework: 'tailwind' });
console.log(tailwindHtml); // <p class="text-center">Hello WordPress!</p>
```

## WordPress REST API Integration

The WordPress REST API can return content in two forms:

1. **Raw Block Data**: Available in the `blocks` property when the WordPress site has the Gutenberg block editor enabled and is configured to expose block data
2. **Rendered HTML**: Always available in the `content.rendered` property

This library handles both formats:

```javascript
import { convertBlocks } from 'wp-block-to-html';

// Fetching a post from WordPress API
async function fetchWordPressPost() {
  const response = await fetch('https://example.com/wp-json/wp/v2/posts/1?_fields=id,title,content,blocks');
  const post = await response.json();
  
  let htmlContent;
  
  // Check if blocks data is available
  if (post.blocks) {
    // Use raw block data with your preferred content handling mode
    htmlContent = convertBlocks(post.blocks, {
      cssFramework: 'tailwind',
      contentHandling: 'raw'
    });
  } 
  // Fall back to rendered content if no blocks are available
  else if (post.content && post.content.rendered) {
    htmlContent = post.content.rendered;
  }
  
  document.getElementById('content').innerHTML = htmlContent;
}
```

## Performance

The library is optimized for speed and efficiency, with impressive performance metrics:

| Block Count | Average Time (ms) | Blocks per ms |
|------------:|------------------:|-------------:|
| 100         | 0.495             | 202.0        |
| 1,000       | 2.185             | 457.7        |
| 10,000      | 17.757            | 563.2        |
| 100,000     | 105.56            | 947.3        |

Real-world content (complex post with mixed block types) is processed at over 230 blocks per millisecond.

### Memory Efficiency

| Block Count | Memory Usage (MB) | MB per 10K blocks |
|------------:|------------------:|------------------:|
| 20,000      | 18.10             | 9.05              |
| 50,000      | 33.54             | 6.71              |
| 100,000     | 86.59             | 8.66              |

For more details, see the [performance report](performance-report.md).

## Configuration Options

```javascript
// Full configuration
const options = {
  // Output format (default: 'html')
  outputFormat: 'html', // 'html' | 'react' | 'vue' | 'angular' | 'svelte'
  
  // CSS framework (default: 'none')
  cssFramework: 'tailwind', // 'none' | 'tailwind' | 'bootstrap' | 'custom'
  
  // Content handling (default: 'raw')
  contentHandling: 'raw', // 'raw' | 'rendered' | 'hybrid'
  
  // Custom class mapping
  customClassMap: {
    'core/paragraph': {
      block: 'my-custom-paragraph',
      align: {
        center: 'my-centered-text',
        left: 'my-left-text',
        right: 'my-right-text'
      }
    }
  },
  
  // Custom block transformers
  blockTransformers: {
    'my-custom-block/special': {
      transform(blockData, options) {
        // Custom transformation logic
        return `<div class="special-block">${blockData.innerContent.join('')}</div>`;
      }
    }
  }
}

const result = convertBlocks(blockData, options);
```

## Handling Rendered WordPress Content

When working with WordPress REST API, you have options for handling the content:

```javascript
// WordPress block with rendered HTML in innerContent
const blockWithRenderedHTML = {
  blockName: "core/paragraph",
  attrs: { align: "center" },
  innerContent: ['<p class="has-text-align-center">Pre-rendered paragraph</p>']
};

// 1. Raw mode - Process raw block data for full control
const htmlRaw = convertBlocks(blockWithRenderedHTML, { 
  contentHandling: 'raw'
});
// Output: <p class="text-center">Pre-rendered paragraph</p> (with Tailwind)

// 2. Rendered mode - use the rendered HTML as-is
const htmlRendered = convertBlocks(blockWithRenderedHTML, { 
  contentHandling: 'rendered'
});
// Output: <p class="has-text-align-center">Pre-rendered paragraph</p>

// 3. Hybrid mode - keep rendered HTML but add framework classes
const htmlHybrid = convertBlocks(blockWithRenderedHTML, { 
  cssFramework: 'tailwind',
  contentHandling: 'hybrid'
});
// Output: <p class="has-text-align-center text-center">Pre-rendered paragraph</p>
```

### Using Only Rendered Content

If you're only working with rendered content from WordPress and don't need block processing, you can:

1. **Use the Content Directly** (No Library Needed):
```javascript
async function fetchPost() {
  const response = await fetch('https://your-wp-site.com/wp-json/wp/v2/posts/1');
  const post = await response.json();
  
  // Use rendered content directly
  const html = post.content.rendered;
  document.getElementById('content').innerHTML = html;
}
```

2. **Use Minimal Library** (If you need CSS framework integration):
```javascript
import { convertBlocks } from 'wp-block-to-html/core';

// Option 1: Pass the content object directly
const html = convertBlocks(post.content, {
  contentHandling: 'rendered',
  cssFramework: 'tailwind'
});

// Option 2: Create an object with rendered property
const html = convertBlocks({
  rendered: post.content.rendered
}, {
  contentHandling: 'rendered',
  cssFramework: 'tailwind'
});

// ❌ Incorrect - Don't pass rendered string directly
const html = convertBlocks(post.content.rendered, {
  contentHandling: 'rendered',
  cssFramework: 'tailwind'
}); // This will throw an error
```

This approach:
- Reduces bundle size (0KB if using content directly)
- Simplifies implementation
- Maintains compatibility with WordPress sites that don't expose block data
- Requires proper object structure when using the library

## Fallback Strategy

For WordPress sites that don't expose block data, or for specific posts without block data, you can implement a fallback strategy:

```javascript
function renderWordPressContent(post) {
  try {
    // Check if blocks data is available
    if (post.blocks) {
      console.log('Using raw block data for conversion');
      return convertBlocks(post.blocks, {
        cssFramework: 'bootstrap',
        contentHandling: 'raw'
      });
    } 
    // If no blocks but we have rendered content
    else if (post.content && post.content.rendered) {
      console.log('No blocks found, using rendered content');
      return post.content.rendered;
    } 
    // Neither blocks nor rendered content
    else {
      console.error('No content found for this post');
      return '<div class="error">No content found</div>';
    }
  } catch (error) {
    console.error('Error converting content:', error);
    return `<div class="error">Error converting content: ${error.message}</div>`;
  }
}
```

## Examples and Demos

Check out the examples and demos to see the library in action:

1. **Content Handling Modes Demo**: See how different content handling modes work
   - [View Example](./examples/content-handling-modes.html)
   
2. **CSS Framework Demo**: Compare WordPress default, Bootstrap, and Tailwind styling
   - [View Demo](./demo/index.html)
   
3. **Performance Benchmark**: View performance testing results
   - [View Report](./performance-report.md)

To run the demos locally:

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Start the demo server
npm run serve

# Run performance benchmarks
npm run benchmark
npm run extreme-benchmark
```

Then navigate to:
- `http://localhost:3000/examples/content-handling-modes.html` - To see the content handling modes demo
- `http://localhost:3000/demo/index.html` - To see the CSS framework demo

## Framework Integration

### React

```javascript
import { convertBlocks } from 'wp-block-to-html';

function WordPressContent({ post }) {
  // Handle both block data and rendered content
  let html = '';
  
  if (post.blocks) {
    html = convertBlocks(post.blocks, { 
      outputFormat: 'html', 
      cssFramework: 'tailwind',
      contentHandling: 'raw'
    });
  } else if (post.content && post.content.rendered) {
    html = post.content.rendered;
  }
  
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

// Or use the React component output
import { convertBlocksToReact } from 'wp-block-to-html/react';

function WordPressContent({ post }) {
  if (!post.blocks) {
    return <div dangerouslySetInnerHTML={{ __html: post.content?.rendered || '' }} />;
  }
  
  const components = convertBlocksToReact(post.blocks, { 
    cssFramework: 'tailwind',
    contentHandling: 'raw'
  });
  
  return <div>{components}</div>;
}
```

## Extending with Custom Blocks

```javascript
import { registerBlockHandler } from 'wp-block-to-html';

// Register a custom block handler
registerBlockHandler('my-plugin/custom-block', {
  transform(block, options) {
    const { attrs, innerContent } = block;
    // Custom transformation logic
    return `<div class="my-custom-block">${innerContent.join('')}</div>`;
  },
  
  // CSS framework mappings
  cssMapping: {
    tailwind: {
      block: 'bg-gray-100 p-4 rounded',
      // Other attribute mappings
    },
    bootstrap: {
      block: 'card p-3',
      // Other attribute mappings
    }
  }
});
```

## CSS Framework Support

The library provides built-in mappings for popular CSS frameworks:

- **Tailwind CSS**: Modern utility-first CSS framework
- **Bootstrap**: Popular UI framework
- **Custom**: Define your own class mappings

## Performance Recommendations

Based on our performance testing:

1. For maximum performance in high-volume scenarios, use the "rendered" content handling mode when applicable.
2. Framework selection should be based on design requirements rather than performance concerns, as all frameworks perform well.
3. For applications processing extremely large content, consider using the library in a batch or streaming mode.

## Documentation

For complete documentation, visit [wp-block-to-html.madebyaris.com](https://wp-block-to-html.madebyaris.com)

## License

MIT 

## Optimizing Bundle Size

The library supports tree-shaking and modular imports to dramatically reduce bundle size. Our extensive testing shows these impressive size reductions:

| Import Type | Bundle Size | Reduction |
|-------------|-------------|-----------|
| Full Bundle | 132KB | 0% |
| Core + Tailwind + Single Block Handler | 12KB | 91% |
| Minimal Essential Bundle (minified) | 7.5KB | 94% |
| Tailwind Mapping Only | 1.8KB | 99% |

You can achieve these optimizations by importing only the components and functionality you need:

### Core Functionality Only

```javascript
// Import only core functionality without block handlers
import { convertBlocks, registerBlockHandler } from 'wp-block-to-html/core';

// Register only the block handlers you need
import { paragraphBlockHandler, headingBlockHandler } from 'wp-block-to-html/blocks/text';

// Register custom block handlers
registerBlockHandler('core/paragraph', paragraphBlockHandler);
registerBlockHandler('core/heading', headingBlockHandler);
```

### Specific CSS Framework

```javascript
// Import only Tailwind CSS support
import { tailwindMapping } from 'wp-block-to-html/frameworks/tailwind';

// Import only Bootstrap support
import { bootstrapMapping } from 'wp-block-to-html/frameworks/bootstrap';
```

### Specific Block Categories

```javascript
// Import only text block handlers and a registration function
import { registerTextBlockHandlers } from 'wp-block-to-html/blocks/text';
registerTextBlockHandlers(); // Registers all text block handlers

// Or import only media block handlers
import { registerMediaBlockHandlers } from 'wp-block-to-html/blocks/media';
registerMediaBlockHandlers(); // Registers all media block handlers

// Available categories:
// - wp-block-to-html/blocks/text
// - wp-block-to-html/blocks/media
// - wp-block-to-html/blocks/layout
// - wp-block-to-html/blocks/widget
// - wp-block-to-html/blocks/dynamic
```

### Framework-Specific Imports

```javascript
// React-specific imports
import { convertBlocksToReact, createReactComponent } from 'wp-block-to-html/react';

// Vue-specific imports
import { convertBlocksToVue, createVueComponentOptions } from 'wp-block-to-html/vue';
```

### Minimum Viable Bundle Example

The most optimized approach uses the hybrid mode with just core functionality and CSS mapping:

```javascript
// Import only core convertBlocks (2KB)
import { convertBlocks } from 'wp-block-to-html/core';
// Import only tailwind mapping (1.8KB)
import { tailwindMapping } from 'wp-block-to-html/frameworks/tailwind';

// Process pre-rendered HTML content with Tailwind classes
const html = convertBlocks(wordpressContent, { 
  cssFramework: 'tailwind',
  contentHandling: 'hybrid',
  customClassMap: { tailwind: tailwindMapping }
});
```

This approach results in a bundle as small as 7.5KB minified!

## Customizing CSS Classes

The library offers several ways to customize CSS classes applied to blocks:

### 1. Using the customClassMap Option

You can provide a custom class mapping for specific blocks:

```javascript
import { convertBlocks } from 'wp-block-to-html';

const customClasses = {
  'core/paragraph': {
    block: 'my-custom-paragraph-class',
    align: {
      center: 'my-custom-center-class',
      left: 'my-custom-left-class',
      right: 'my-custom-right-class'
    },
    dropCap: 'my-custom-dropcap-class'
  },
  'core/heading': {
    block: 'my-custom-heading-class',
    level: {
      '1': 'my-h1-class',
      '2': 'my-h2-class',
      // ... other levels
    }
  }
  // ... other block types
};

const html = convertBlocks(blocks, {
  cssFramework: 'custom',
  customClassMap: { custom: customClasses }
});
```

### 2. Extending a Built-in Framework

You can extend the built-in frameworks with your own classes:

```javascript
import { convertBlocks } from 'wp-block-to-html';
import { tailwindMapping } from 'wp-block-to-html/frameworks/tailwind';

// Create a deep copy of the Tailwind mapping
const extendedTailwind = JSON.parse(JSON.stringify(tailwindMapping));

// Add or modify mappings
extendedTailwind['core/paragraph'].block = 'my-4 px-4 custom-para'; // Add to existing
extendedTailwind['core/image'].customAttribute = 'my-custom-image-class'; // Add new attribute

// Use the extended mapping
const html = convertBlocks(blocks, {
  cssFramework: 'tailwind',
  customClassMap: { tailwind: extendedTailwind }
});
```

### 3. Creating a Custom Block Handler

For complete control, register a custom block handler:

```javascript
import { registerBlockHandler } from 'wp-block-to-html/core';
import { getBlockClasses } from 'wp-block-to-html/core';

// Custom block handler for paragraphs
registerBlockHandler('core/paragraph', {
  transform(block, options) {
    const { attrs, innerContent } = block;
    const content = innerContent.join('');
    
    // Get classes using the built-in mechanism
    const classes = getBlockClasses(block, 'core/paragraph', options);
    
    // Add additional custom classes
    let customClasses = classes;
    if (attrs.customAttribute === 'special') {
      customClasses += ' my-special-class';
    }
    
    // Return the transformed HTML
    return `<p class="${customClasses}">${content}</p>`;
  },
  
  // Define CSS framework mappings for this block
  cssMapping: {
    tailwind: {
      block: 'text-base my-4',
      align: {
        center: 'text-center',
        left: 'text-left',
        right: 'text-right'
      },
      // Custom attribute mappings
      customSize: {
        small: 'text-sm',
        large: 'text-lg'
      }
    },
    bootstrap: {
      // Bootstrap specific mappings
    }
  }
});
```

### 4. Using the enhanceRenderedHTML Function for Hybrid Mode

The hybrid mode uses `enhanceRenderedHTML` internally, but you can use it directly:

```javascript
import { enhanceRenderedHTML } from 'wp-block-to-html/core';
import { tailwindMapping } from 'wp-block-to-html/frameworks/tailwind';

// WordPress rendered HTML
const renderedHTML = '<p class="has-text-align-center">Hello WordPress!</p>';

// Enhance with Tailwind classes
const enhancedHTML = enhanceRenderedHTML(renderedHTML, {
  cssFramework: 'tailwind',
  customClassMap: { tailwind: tailwindMapping }
});

console.log(enhancedHTML); // <p class="has-text-align-center text-center">Hello WordPress!</p>
```

This approach is perfect for handling pre-rendered content while still applying your CSS framework classes. 