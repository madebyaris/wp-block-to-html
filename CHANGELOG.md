# Changelog

All notable changes to the WordPress Block to HTML Converter will be documented in this file.

## [0.5.1] - 2025-05-20

### Added
- Comprehensive documentation in RELEASE_NOTES.md
- Additional usage examples for SSR optimization features
- Performance insights based on benchmark results

### Fixed
- Documentation sync issues between CHANGELOG.md and RELEASE_NOTES.md

## [0.5.0] - 2025-03-24

### Added
- Server-Side Rendering (SSR) optimization suite
- Lazy loading for images and iframes with LCP (Largest Contentful Paint) protection
- Prioritization of above-the-fold content
- Critical path CSS identification
- Preconnect link generation for external resources
- HTML minification for reduced payload sizes
- Optimization depth control for nested content
- Complete benchmark suite for SSR optimizations

### Improved
- Significant performance gains for large content
- Core SSR module integration with main converter
- HTML processing for better Core Web Vitals scores
- Minification output quality
- Style deduplication for reduced CSS payload

### Fixed
- Issues with malformed image tags
- URL handling in SSR processed content
- Iframe processing for improved performance
- Benchmark results reporting

## [0.4.0] - 2025-03-20

### Added
- Comprehensive performance benchmarking suite
- Extreme throughput testing capability
- Memory usage analysis and optimization
- New benchmark scripts: `npm run benchmark` and `npm run extreme-benchmark`
- Detailed performance metrics in documentation

### Improved
- Processing speed optimization for large content sets
- Memory efficiency for high-volume conversions
- Better-than-linear scaling with batch size increases
- Framework integration performance
- Content handling mode performance

### Fixed
- Various memory optimization issues
- Batch processing efficiency

## [0.3.0] - 2025-03-18

### Added
- Modular bundle structure with subpath exports
- Separate entry points for block categories
- Optimized framework adapters
- Bundle size optimization documentation

### Improved
- Overall bundle size reduction
- Tree-shaking capabilities
- Import optimization options
- TypeScript typings for modular imports

### Fixed
- Circular dependency issues
- Import path resolution

## [0.2.0] - 2025-03-17

### Added
- Content handling modes: 'raw', 'rendered', and 'hybrid'
- Support for processing WordPress API responses
- Fallback for posts without block data
- Demo pages showcasing content handling options

### Improved
- Block handler rendering pipeline
- Framework adapter flexibility
- Configuration options

### Fixed
- Handling of nested blocks in complex structures
- Empty block content processing
- WordPress API integration issues

## [0.1.0] - 2025-03-17

### Added
- Initial release with core functionality
- Basic block handlers for common WordPress blocks
- CSS framework integration (Default, Tailwind, Bootstrap)
- Configuration system
- Plugin system for extensibility
- React component output support 