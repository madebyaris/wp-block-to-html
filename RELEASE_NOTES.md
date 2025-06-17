# WordPress Block to HTML Converter - Release Notes

## v0.5.1 (2025-03-24)

This update introduces a comprehensive Server-Side Rendering (SSR) optimization suite that significantly improves page performance metrics like Core Web Vitals.

### New Features

#### SSR Optimization Suite
- **Core Web Vitals Optimization**: Substantial improvements for LCP, CLS, and TBT metrics
- **Lazy Loading**: Intelligent image and iframe lazy loading with first image preservation for LCP
- **Above-the-fold Prioritization**: Special handling for crucial content visible in the viewport
- **Critical Path Identification**: Marking and optimizing critical rendering path elements
- **External Resource Optimization**: Automatic preconnect link generation for third-party resources
- **HTML Minification**: Reduced payload sizes with whitespace removal and comment stripping
- **Optimization Depth Control**: Configurable processing depth for nested content

#### Performance Benchmarking
- **Comprehensive Benchmark Suite**: Detailed performance metrics across different post sizes
- **Optimization Strategy Comparison**: Data-driven analysis of different optimization techniques
- **Feature-specific Metrics**: Individual measurements for each optimization technique
- **Throughput Analysis**: Processing speed measurements in KB/s across configurations

### Usage Examples

```javascript
import { convertBlocks, processBlocksForSSR } from 'wp-block-to-html';

// Basic SSR optimization with default settings (balanced)
const optimizedBlocks = processBlocksForSSR(blocks);
const html = convertBlocks(optimizedBlocks);

// With specific optimization features
const optimizedBlocks = processBlocksForSSR(blocks, {
  optimizationLevel: 'maximum', // 'minimal', 'balanced', or 'maximum'
  lazyLoadMedia: true,          // Add loading="lazy" to images and iframes
  preserveFirstImage: true,     // Keep first image for LCP
  prioritizeAboveTheFold: true, // Mark content for above-the-fold rendering
  criticalPathOnly: true,       // Focus on critical rendering path elements
  preconnect: true,             // Add preconnect links for external resources
  removeDuplicateStyles: true,  // Consolidate duplicate style blocks
  minifyOutput: true            // Reduce HTML size
});
```

### Performance Insights

Our benchmark results demonstrate impressive optimization capabilities:

1. **Small Content (0.64KB)**
   - Fastest: "Balanced with Preconnect" (0.06ms, 11,472 KB/s)
   - Most efficient: "Balanced with Remove Duplicate Styles" (0.06ms, 10,636 KB/s)

2. **Medium Content (2.83KB)**
   - Fastest: "Balanced with Remove Duplicate Styles" (0.13ms, 21,071 KB/s)
   - Strong performer: "Maximum with All Features" (0.16ms, 17,643 KB/s)

3. **Large Content (4.71KB)**
   - Best overall: "Balanced with Remove Duplicate Styles" (0.24ms, 19,719 KB/s)
   - Excellent alternative: "Maximum with All Features" (0.24ms, 19,314 KB/s)

### Bug Fixes and Improvements
- Fixed issues with malformed image tags in SSR processing
- Improved URL handling in HTML content
- Enhanced iframe processing with proper lazy loading
- Optimized minification to consistently reduce output size
- Fixed benchmark results reporting and data visualization

### Breaking Changes
None - This update is fully backwards compatible while adding significant performance optimization capabilities.

## v0.4.0 (2025-03-20)

This update introduces comprehensive performance benchmarks and optimizations, demonstrating the library's exceptional speed and efficiency even with extremely large content.

### New Features

#### Performance Benchmarks
- **Exceptional Throughput**: Processing up to 947 blocks per millisecond with large content sets
- **Super-linear Scaling**: Throughput actually increases with larger batch sizes
- **Memory Efficiency**: Approximately 8-9MB per 10,000 blocks
- **Real-world Performance**: Complex mixed content processed at 230+ blocks per millisecond

#### Optimized Content Handling
- **Content Mode Performance**: Detailed benchmarks for raw, rendered, and hybrid modes
- **Framework Overhead Analysis**: Performance comparison across different CSS frameworks
- **Nested Block Optimization**: Enhanced processing for hierarchical content

#### Benchmark Tools
- **Standard Benchmark**: Comprehensive performance testing script
- **Extreme Throughput Test**: Testing with up to 100,000 blocks
- **Complex Content Test**: Real-world post simulation with mixed block types
- **Memory Usage Tracking**: Monitoring memory consumption at scale

### Usage Examples

```javascript
// Run standard benchmark
npm run benchmark

// Run extreme throughput test
npm run extreme-benchmark
```

### Performance Recommendations

1. For maximum performance in high-volume scenarios, use the "rendered" content handling mode when applicable.
2. Framework selection should be based on design requirements rather than performance concerns, as all frameworks performed well.
3. For applications processing extremely large content, consider using the library in a batch or streaming mode to maintain memory efficiency.

### Bug Fixes and Improvements
- Fixed minor memory leaks during large content processing
- Improved batch processing efficiency
- Optimized internal class mapping lookups
- Enhanced rendering pipeline for nested blocks

### Breaking Changes
None - This update is fully backwards compatible with existing code while providing significant performance improvements.

## v0.3.0 (2025-03-18)

This update introduces a revolutionary modular bundle structure that dramatically reduces bundle size for applications that only use specific features of the library. Our testing shows size reductions of up to 99% compared to the full bundle!

### New Features

#### Modular Import System
- **Highly Optimized Bundle Size**: Import only what you need, reducing your application's bundle size by up to 99%
- **Framework-Specific Modules**: Separate modules for React and Vue integrations (~250B each)
- **CSS Framework Modules**: Dedicated modules for Tailwind CSS and Bootstrap (as small as 1.8KB)
- **Block Category Modules**: Import only the block handlers you need, organized by category (300B-1.5KB per category)
- **Enhanced Tree-Shaking**: Improved code organization for better dead code elimination

#### Bundle Size Improvements
- **Full Bundle**: 132KB (complete functionality)
- **Core Only**: ~2KB (98.5% reduction)
- **Individual Block Categories**: 300B-1.5KB per category (99% reduction)
- **Framework Adapters**: ~250B per framework excluding peer dependencies (99.8% reduction)
- **Minimal Viable Setup (Hybrid Mode)**: 7.5KB minified (94% reduction)

#### Advanced Customization Options
- **Enhanced Class Customization**: Multiple ways to modify and extend CSS classes
- **Framework Extension**: Easily extend built-in framework mappings with custom classes
- **Direct HTML Enhancement**: New utility functions for hybrid rendering workflows

### Usage Examples

```javascript
// Import only core functionality
import { convertBlocks } from 'wp-block-to-html/core';

// Import specific CSS frameworks
import { tailwindMapping } from 'wp-block-to-html/frameworks/tailwind';

// Import specific block categories
import { paragraphBlockHandler } from 'wp-block-to-html/blocks/text';
import { imageBlockHandler } from 'wp-block-to-html/blocks/media';

// Import framework-specific functionality
import { convertBlocksToReact } from 'wp-block-to-html/react';
import { convertBlocksToVue } from 'wp-block-to-html/vue';

// Minimal Viable Setup (7.5KB minified)
const html = convertBlocks(wordpressContent, { 
  cssFramework: 'tailwind',
  contentHandling: 'hybrid',
  customClassMap: { tailwind: tailwindMapping }
});
```

### Practical Usage Scenarios

- **Static Site Generators**: Use the minimal essential bundle for 94% smaller imports in Gatsby, Next.js, etc.
- **SPAs with Framework Integration**: Import only the React or Vue adapters for a 99% smaller bundle
- **WordPress Theme Development**: Include only the block handlers you need for your specific theme design
- **Headless WordPress**: Optimize bundle size based on which blocks your content actually uses

### Bug Fixes and Improvements
- Fixed numerous linting issues
- Improved TypeScript type definitions
- Enhanced module tree-shaking capability
- Extensive documentation updates with bundle optimization guide
- Added detailed examples for CSS class customization

### Breaking Changes
None - This update is fully backwards compatible with existing code while enabling new optimized import paths.

## v0.2.0 (2025-03-17)

This update introduces significant enhancements to handle both WordPress block data and rendered HTML content, making the library more flexible and compatible with various WordPress configurations.

### New Features

#### Enhanced WordPress REST API Support
- **Dual Content Handling**: Seamlessly handle both raw block data and rendered HTML content
- **Fallback Mechanism**: Gracefully fall back to rendered content when block data is unavailable
- **Content Handling Options**: Three modes to control how content is processed:
  - `raw`: Process raw block data for full control (default)
  - `rendered`: Use rendered HTML as-is
  - `hybrid`: Combine rendered HTML with framework-specific classes

#### Updated Demo Pages
- New examples showing how to handle different WordPress API responses
- Interactive demos for comparing content handling modes
- Integration examples for fetching from real WordPress API endpoints

### Bug Fixes and Improvements
- Fixed issue with handling missing block data
- Improved error handling and fallback strategies
- Enhanced documentation for WordPress API integration

### Breaking Changes
None - This update is fully backwards compatible with existing code.

## v0.1.0-beta (2025-03-17)

We're excited to announce the first beta release of the WordPress Block to HTML Converter library! This library allows you to convert WordPress block data into HTML or framework-specific components.

### Features

#### Core Functionality
- Convert WordPress blocks to HTML
- Support for custom block handlers
- Plugin system for extensibility
- CSS framework integration (Tailwind CSS, Bootstrap)
- Framework adapters for React and Vue

#### Block Handlers
- **Text Blocks**: Paragraph, Heading, List, Quote, Code, Preformatted, Pullquote, Verse, Details, Classic
- **Media Blocks**: Image, Gallery, Audio, Video, File, Cover, Media & Text, Embed (YouTube, Twitter, Vimeo, etc.)
- **Layout Blocks**: Group, Columns, Row, Stack, Grid
- **Widget Blocks**: Shortcode, Button, Custom HTML, Table, Archives, Calendar, Categories, Page List, RSS, Search, Social Links
- **Dynamic Blocks**: Latest Posts, More, Page Break, Separator, Spacer

### Installation

```bash
npm install wp-block-to-html
```

### Basic Usage

```javascript
import { convertBlocks } from 'wp-block-to-html';

const blocks = [
  {
    blockName: "core/paragraph",
    attrs: { content: "Hello, world!" },
    innerBlocks: [],
    innerContent: ["Hello, world!"]
  }
];

const html = convertBlocks(blocks);
console.log(html); // <p>Hello, world!</p>
```

### Framework Integration

#### React

```javascript
import { createReactComponent } from 'wp-block-to-html';
import React from 'react';
import ReactDOM from 'react-dom';

const blocks = [
  {
    blockName: "core/heading",
    attrs: { content: "React Example", level: 2 },
    innerBlocks: [],
    innerContent: ["React Example"]
  }
];

const BlocksComponent = createReactComponent(blocks);
ReactDOM.render(<BlocksComponent />, document.getElementById('root'));
```

#### Vue

```javascript
import { createVueComponentOptions } from 'wp-block-to-html';
import { createApp } from 'vue';

const blocks = [
  {
    blockName: "core/heading",
    attrs: { content: "Vue Example", level: 2 },
    innerBlocks: [],
    innerContent: ["Vue Example"]
  }
];

const app = createApp({
  template: '<div><wp-blocks-renderer /></div>',
  components: {
    'wp-blocks-renderer': createVueComponentOptions(blocks)
  }
});
app.mount('#app');
```

### CSS Framework Integration

```javascript
import { convertBlocks } from 'wp-block-to-html';

const blocks = [/* ... */];

// Use Tailwind CSS classes
const htmlWithTailwind = convertBlocks(blocks, { cssFramework: 'tailwind' });

// Use Bootstrap classes
const htmlWithBootstrap = convertBlocks(blocks, { cssFramework: 'bootstrap' });
```

### Known Issues

- Some complex block attributes may not be fully supported
- Angular and Svelte framework adapters are still in development
- Performance optimizations for large block collections are planned for future releases

### Feedback and Contributions

We welcome feedback and contributions! Please submit issues and pull requests on our [GitHub repository](https://github.com/madebyaris/wp-block-to-html).

## Upcoming Features (Planned for v1.3.0)

- Angular framework adapter
- Svelte framework adapter
- Server-side rendering optimizations
- Incremental rendering for large block collections
- Support for theme customization options
- Performance benchmarking tools
- Block validation and sanitization utilities 