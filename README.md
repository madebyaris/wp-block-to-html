# wp-block-to-html

**🎉 v1.0.0 Stable Release - Production Ready with Client-Side Hydration**

Convert WordPress Gutenberg blocks to HTML or framework-specific components with customizable styling and progressive hydration capabilities.

[![npm version](https://img.shields.io/npm/v/wp-block-to-html.svg)](https://www.npmjs.com/package/wp-block-to-html)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/madebyaris/wp-block-to-html)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

> **v1.0.0 Milestone**: The first and only WordPress block converter with production-ready client-side hydration. Perfect for headless WordPress, SSR applications, and modern web development.

## Features

### 🚀 **New in v1.0.0: Client-Side Hydration**
- **Progressive Hydration**: Viewport-based, interaction-based, and idle hydration strategies
- **Performance Monitoring**: Built-in statistics and performance tracking
- **Framework Ready**: Plugin architecture for React, Vue, Angular, and Svelte integration
- **Production Quality**: Comprehensive error handling and browser compatibility

### 🏗️ **Core Capabilities**
- Convert WordPress Gutenberg blocks to clean HTML
- **100% WordPress core block support** - All blocks handled
- Handle both raw block data and rendered HTML content
- Multiple content handling modes for switching between raw and rendered content
- Customizable CSS class mapping
- Built-in support for Tailwind CSS and Bootstrap
- Framework-specific output options (React, Vue, Angular, Svelte)
- Extensible plugin system for custom blocks
- Full TypeScript support with advanced type features
- Minimal dependencies with modular architecture

### ⚡ **Performance Excellence**
- **Industry-leading speed**: Process up to 947 blocks per millisecond
- **99% bundle size reduction**: Import only what you need
- **Memory efficient**: Linear scaling with optimized memory usage
- **SSR optimized**: Core Web Vitals improvements included

## Installation

```bash
# Install the stable v1.0.0 release
npm install wp-block-to-html
# or
yarn add wp-block-to-html
# or
pnpm add wp-block-to-html
```

**v1.0.0 Stable**: Production-ready with comprehensive testing, full TypeScript support, and zero breaking changes from v0.x.

## Basic Usage

### Block Conversion
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

### 🆕 Client-Side Hydration (v1.0.0)
```javascript
import { HydrationManager } from 'wp-block-to-html/hydration';

// Initialize hydration with viewport strategy
const hydrationManager = new HydrationManager({
  strategy: 'viewport',
  concurrencyLimit: 3,
  performanceMonitoring: true
});

// Hydrate components progressively
await hydrationManager.hydrateComponent('my-component', {
  strategy: 'viewport',
  priority: 'high',
  threshold: 0.1  // Trigger when 10% visible
});

// Monitor hydration performance
const stats = hydrationManager.getStatistics();
console.log(`Hydrated ${stats.totalHydrated} components in ${stats.averageTime}ms`);
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
| 10,000      | 15.245            | 655.9        |
| 50,000      | 52.785            | 947.1        |

Real-world content (complex post with mixed block types) is processed at over 230 blocks per millisecond.

## Benchmarking and Testing

### Performance Benchmarks

This library includes a comprehensive benchmarking suite to measure the performance impact of SSR optimizations:

```bash
# Run the SSR optimization benchmarks
node benchmarks/ssr-optimization-benchmarks.js
```

The benchmarks test various optimization configurations on small, medium, and large posts, measuring:
- Processing time in milliseconds
- Output size in kilobytes
- Throughput in kilobytes per second

Results are saved as both JSON and CSV files in the `benchmarks/results` directory for easy analysis.

See the [Benchmarking README](./benchmarks/README.md) for details on the benchmark configurations and how to interpret results.

### Automated Tests

Extensive tests ensure all features work correctly:

```bash
# Run all tests
npm test

# Run only SSR optimization tests
npm test -- tests/ssr-optimizations.test.js
```

The test suite covers all SSR optimization features, including:
- Lazy loading of media
- Prioritization of above-the-fold content
- Critical path rendering
- Style deduplication
- HTML minification

See the [Testing README](./tests/README.md) for details on the test structure and how to add new tests.

## Server-Side Rendering Optimizations

This library includes specialized optimizations for server-side rendering (SSR) environments to improve performance metrics like Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and Total Blocking Time (TBT).

```javascript
import { processBlocksForSSR } from 'wp-block-to-html';

// WordPress block data
const blockData = {
  blocks: [/* blocks */]
};

// Basic usage with default optimizations
const optimizedHtml = processBlocksForSSR(blockData, {
  ssrOptions: {
    enabled: true,
    // Uses 'balanced' optimization level by default
  }
});

// Advanced usage with maximum optimizations
const fullyOptimizedHtml = processBlocksForSSR(blockData, {
  cssFramework: 'tailwind',
  ssrOptions: {
    enabled: true,
    level: 'maximum',
    optimizeImages: true,
    stripClientScripts: true,
    inlineCriticalCSS: true
  }
});
```

### SSR Optimization Levels

The library supports three optimization levels:

1. **Minimal** (`level: 'minimal'`): Basic optimizations with minimal processing
   - Whitespace reduction
   - HTML comment removal (configurable)
   - Typically results in 5-15% size reduction

2. **Balanced** (`level: 'balanced'`, default): Good performance/features balance
   - All minimal optimizations
   - Client-side script removal (configurable)
   - Image optimization with lazy loading (except first image for LCP)
   - Inline event handler removal
   - Typically results in 20-30% size reduction

3. **Maximum** (`level: 'maximum'`): All optimizations enabled
   - All balanced optimizations
   - Critical CSS inlining (when enabled)
   - Preload hints for above-the-fold images
   - Maximum HTML size reduction
   - Typically results in 25-35% size reduction

### Performance Impact

Our benchmarks on real-world WordPress content show significant improvements:

| Metric                    | Without SSR Opt. | With Balanced Opt. | Improvement |
|---------------------------|-----------------|-------------------|-------------|
| HTML Size (typical post)  | 4,888 bytes     | 3,449 bytes       | 29% smaller |
| Scripts Count             | 2               | 0                 | 100% removed |
| Inline Event Handlers     | 3               | 0                 | 100% removed |
| Lazy-loaded Images        | 0               | 1                 | Added automatically |
| Processing Speed (500 blocks) | 0.8 blocks/ms | 0.7 blocks/ms    | Minimal overhead |

### Real-World Example

For a typical WordPress blog post containing text content, images, embeds, and interactive elements:

```javascript
// Real-world example with a full blog post
const blogPost = processBlocksForSSR(wordpressPost, {
  ssrOptions: {
    enabled: true,
    level: 'balanced',
    // Default settings work well for most cases
  }
});
```

This optimization results in:
- Removal of client-side scripts that shouldn't execute during SSR
- Elimination of inline event handlers (onclick, onmouseover, etc.)
- Addition of lazy loading for non-critical images
- Preservation of structured data and JSON-LD scripts
- No impact on SEO-critical content

### Custom Processing

You can extend the SSR optimizations with custom pre- and post-processing functions:

```javascript
const optimizedHtml = processBlocksForSSR(blockData, {
  ssrOptions: {
    enabled: true,
    preProcessHTML: (html, options) => {
      // Custom processing before standard optimizations
      return html.replace(/specific-pattern/g, 'replacement');
    },
    postProcessHTML: (html, options) => {
      // Custom processing after standard optimizations
      return html + '<!-- Server rendered at ' + new Date().toISOString() + ' -->';
    }
  }
});
```

### Framework-Specific Integration

The SSR optimization module works seamlessly with any framework that supports server-side rendering:

#### Next.js Integration

```javascript
// pages/[slug].js
export async function getServerSideProps({ params }) {
  const post = await fetchPostBySlug(params.slug);
  
  const optimizedHtml = processBlocksForSSR(post.blocks, {
    cssFramework: 'tailwind', // If using Tailwind in your Next.js project
    ssrOptions: {
      enabled: true,
      level: 'balanced'
    }
  });
  
  return {
    props: {
      postData: post,
      optimizedContent: optimizedHtml
    }
  };
}
```

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

## SEO Module

The SEO module provides tools for extracting SEO-relevant metadata from WordPress blocks and generating HTML head content.

### Installation

```bash
npm install wp-block-to-html
```

### Basic Usage

```javascript
import { extractMetadata, generateSEOHead } from 'wp-block-to-html/seo';

// Fetch blocks from WordPress API
const response = await fetch('https://example.com/wp-json/wp/v2/posts/1?_fields=id,title,content,blocks');
const post = await response.json();

// Extract SEO metadata from blocks
const metadata = extractMetadata(post.blocks);

// Generate HTML head content
const headContent = generateSEOHead(metadata, {
  baseUrl: 'https://example.com',
  siteName: 'My WordPress Site',
  twitter: {
    handle: '@mytwitter',
    cardType: 'summary_large_image'
  },
  facebook: {
    appId: '123456789'
  }
});

// Insert into document head
document.head.insertAdjacentHTML('beforeend', headContent);
```

### SEO Metadata Extracted

The `extractMetadata` function analyzes WordPress blocks to extract:

- Title (from the first heading)
- Description (from the first substantial paragraph)
- Images with alt text
- Headings structure
- Links (internal and external)
- Word count and content statistics
- Schema markup information
- SEO analysis score

### SEO Analysis

The metadata includes an `seoAnalysis` object with:

- SEO score (0-100)
- Content improvement suggestions
- Indexing recommendations (`shouldIndex` property)

## Streaming Module for Large Content

The streaming module provides Node.js streams support for processing very large WordPress content sets efficiently with minimal memory usage.

### Installation

```bash
npm install wp-block-to-html
```

### Basic Usage

```javascript
const fs = require('fs');
const { createBlockStream } = require('wp-block-to-html/streaming');

// Create a readable stream of WordPress blocks from a file or API
const blockDataStream = fs.createReadStream('large-block-data.json');

// Create an output file stream
const outputStream = fs.createWriteStream('output.html');

// Create a block transformer stream with Bootstrap styling
const blockStream = createBlockStream({
  cssFramework: 'bootstrap',
  streamingOptions: {
    chunkSize: 50, // Process 50 blocks at a time
    highWaterMark: 16 // Keep 16 objects in the buffer
  }
});

// Pipe everything together
blockDataStream
  .pipe(JSON.parse()) // You'll need to implement a JSON parser stream
  .pipe(blockStream)
  .pipe(outputStream);
```

### Using with API Data

```javascript
const { Readable } = require('stream');
const fs = require('fs');
const { createBlockStream } = require('wp-block-to-html/streaming');

// Custom readable stream that fetches blocks in chunks from WordPress API
class WordPressAPIStream extends Readable {
  constructor(options) {
    super({ objectMode: true });
    this.baseUrl = options.baseUrl;
    this.perPage = options.perPage || 10;
    this.page = 1;
    this.hasMore = true;
  }

  async _read() {
    if (!this.hasMore) {
      this.push(null); // End of stream
      return;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/wp-json/wp/v2/posts?page=${this.page}&per_page=${this.perPage}&_fields=id,title,content,blocks`
      );
      
      const posts = await response.json();
      
      if (posts.length === 0) {
        this.hasMore = false;
        this.push(null);
        return;
      }

      // Push each post's blocks to the stream
      posts.forEach(post => {
        if (post.blocks) {
          this.push(post.blocks);
        }
      });

      this.page++;
    } catch (error) {
      console.error('Error fetching posts:', error);
      this.hasMore = false;
      this.push(null);
    }
  }
}

// Create streams
const apiStream = new WordPressAPIStream({
  baseUrl: 'https://example.com',
  perPage: 5
});

const blockStream = createBlockStream({
  cssFramework: 'tailwind',
  streamingOptions: { chunkSize: 20 }
});

const outputStream = fs.createWriteStream('wp-content.html');

// Add stream monitoring
blockStream.on('data', chunk => {
  console.log(`Processed chunk, size: ${chunk.length} bytes`);
});

blockStream.on('end', () => {
  console.log('All content processed');
});

// Pipe everything together
apiStream
  .pipe(blockStream)
  .pipe(outputStream);
```

### Memory Efficiency

The streaming API is highly efficient for large content sets:

- Process millions of blocks with minimal memory footprint
- Automatic backpressure handling
- Configurable chunk sizes for optimal performance
- Works with Node.js file/network streams

### Configuration Options

The streaming module supports all the standard options plus:

```javascript
const options = {
  // Standard options
  cssFramework: 'bootstrap',
  contentHandling: 'raw',
  
  // Streaming-specific options
  streamingOptions: {
    // Number of blocks to process in a single chunk
    chunkSize: 50,
    
    // Stream buffer high water mark
    highWaterMark: 16,
    
    // Whether to handle backpressure automatically
    handleBackpressure: true
  }
};

const blockStream = createBlockStream(options);
```

## Incremental Rendering

For client-side applications dealing with large content sets, the library provides incremental rendering to improve user experience and prevent UI blocking.

### Basic Usage

```javascript
import { convertBlocks } from 'wp-block-to-html';

// Get blocks from WordPress API
const response = await fetch('https://example.com/wp-json/wp/v2/posts/1?_fields=blocks');
const post = await response.json();

// Convert with incremental rendering enabled
const html = convertBlocks(post.blocks, {
  cssFramework: 'bootstrap',
  incrementalOptions: {
    enabled: true,
    initialRenderCount: 10,  // Render first 10 blocks immediately
    batchSize: 5,            // Process remaining blocks in batches of 5
    batchDelay: 50           // Wait 50ms between batches
  }
});

// Inject the HTML into the page
document.getElementById('content').innerHTML = html;

// The content will render progressively:
// 1. Initial blocks appear immediately
// 2. Remaining blocks render in batches with minimal UI blocking
// 3. Special markers in the HTML handle the incremental loading
```

### Configuration Options

The incremental rendering module supports these options:

```javascript
const options = {
  // Standard options
  cssFramework: 'bootstrap',
  
  // Incremental rendering options
  incrementalOptions: {
    // Enable incremental rendering (default: false)
    enabled: true,
    
    // Number of blocks to render in the initial pass (default: 10)
    initialRenderCount: 10,
    
    // Number of blocks to render in each subsequent batch (default: 5)
    batchSize: 5,
    
    // Delay in milliseconds between batch rendering (default: 50)
    batchDelay: 50,
    
    // Use IntersectionObserver for lazy loading blocks when they come into view
    useIntersectionObserver: true,
    
    // DOM element selector where content should be rendered incrementally
    containerSelector: '#content',
    
    // Custom callback for rendering incremental content
    renderCallback: (content, options) => {
      // Custom rendering logic
    }
  }
};
```

### Examples

Check out a complete example with progressive rendering in [examples/incremental-rendering.html](./examples/incremental-rendering.html).

### Performance Benefits

Incremental rendering significantly improves perceived performance:

- Initial content appears immediately
- UI remains responsive during rendering
- Large content sets don't block the main thread
- Users can interact with content while the rest loads
- Optional lazy loading via IntersectionObserver 