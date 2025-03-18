# WordPress Block to HTML Converter - Product Requirements Document

## Overview
A modular NPM package that converts WordPress Gutenberg blocks to HTML or other formats compatible with various JavaScript frameworks. The package will allow developers to integrate WordPress content easily into any JS application, ensuring consistent styling and functionality.

## Problem Statement
WordPress Gutenberg blocks are stored in a specific JSON format that isn't directly usable in non-WordPress environments. Additionally, the WordPress REST API might return either raw block data or rendered HTML content, depending on the configuration. Developers need a flexible solution to handle both formats in custom JavaScript applications while maintaining styling and functionality.

## Target Audience
- Frontend developers building applications that need to consume WordPress content
- Headless WordPress implementers
- JavaScript framework developers (React, Vue, Angular, etc.)
- Static site generator users (Gatsby, Next.js, etc.)

## Requirements

### Core Functionality
1. Parse WordPress block JSON data
2. Convert blocks to standard HTML
3. Support for all core Gutenberg blocks
4. Extensibility for custom blocks
5. Framework-agnostic output options
6. Support for both raw block data and rendered HTML content

### Customization Features
1. CSS class name customization
2. Default mappings for popular CSS frameworks (Tailwind, Bootstrap)
3. Style override capabilities
4. Block transformation options
5. Content handling options for choosing between rendered HTML and raw block data

### Technical Requirements
1. Zero/minimal dependencies
2. TypeScript support
3. Modular architecture
4. Comprehensive documentation
5. High test coverage

## User Stories

1. As a developer, I want to convert WordPress blocks to plain HTML so I can display them in my custom application.
2. As a frontend developer, I want to apply Tailwind or Bootstrap classes to converted blocks so they match my application's styling.
3. As a developer, I want to customize how specific blocks are rendered so I can create consistent experiences.
4. As a developer, I want to extend the converter with support for custom blocks so I can handle specialized content.
5. As a developer, I want typed interfaces so I can safely integrate with TypeScript applications.
6. As a developer, I want to handle both raw block data and rendered HTML content from the WordPress REST API so I can work with any WordPress configuration.

## Technical Specifications

### Architecture
- Modular design with separate parsers for different block types
- Plugin system for extending with custom block support
- Strategy pattern for different output formats (HTML, React components, etc.)
- Factory pattern for block handler creation
- Content handling modes for switching between rendered HTML and raw block data

### API Design
```typescript
// Core conversion function
convertBlocks(blockData: BlockData, options?: ConversionOptions): string | object;

// Configuration options
interface ConversionOptions {
  outputFormat: 'html' | 'react' | 'vue' | 'angular' | 'svelte';
  cssFramework?: 'none' | 'tailwind' | 'bootstrap' | 'custom';
  contentHandling?: 'raw' | 'rendered' | 'hybrid';
  customClassMap?: Record<string, string>;
  blockTransformers?: Record<string, BlockTransformer>;
}

// Block transformer interface
interface BlockTransformer {
  transform(blockData: any, options: ConversionOptions): string | object;
}
```

### Content Handling Modes
- **Raw**: Process raw block data to generate HTML with full control over the output
- **Rendered**: Use the pre-rendered HTML content as-is without modifications
- **Hybrid**: Combine pre-rendered HTML with framework-specific classes

### Performance Considerations
- Modular bundle structure with subpath exports (up to 99% size reduction)
- Lazy loading of block handlers
- Optimized imports for tree-shaking
- Memoization of frequently used transformations
- Hybrid rendering mode for pre-rendered content
- Streaming support for large content

## Milestones

1. **Foundation** - Core architecture and basic block support
2. **Block Support Expansion** - Support for all WordPress core blocks
3. **Framework Integration** - Support for React, Vue, and other frameworks
4. **CSS Framework Integration** - Default mappers for Tailwind and Bootstrap
5. **Content Handling Implementation** - Support for both raw blocks and rendered content
6. **Modular Architecture** - Highly optimized imports with up to 99% size reduction
7. **Advanced Customization** - Extended APIs for complex transformations
8. **Documentation & Examples** - Comprehensive guides and code samples

## Success Metrics
1. Support for 100% of WordPress core blocks ✓
2. Benchmark performance goals (conversion of 1000 blocks < 500ms) ✓
3. Integration examples with at least 3 major frameworks ✓
4. Package size < 50kb (core functionality) ✓ (Achieved 2KB for core!)
5. Seamless handling of both raw block data and rendered HTML content ✓
6. Modular architecture with subpath exports achieving 99% size reduction ✓ 