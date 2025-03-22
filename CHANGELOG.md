# Changelog

All notable changes to the WordPress Block to HTML Converter will be documented in this file.

## [0.4.0] - 2025-04-20

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

## [0.3.0] - 2025-03-15

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

## [0.2.0] - 2025-02-10

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

## [0.1.0] - 2025-01-05

### Added
- Initial release with core functionality
- Basic block handlers for common WordPress blocks
- CSS framework integration (Default, Tailwind, Bootstrap)
- Configuration system
- Plugin system for extensibility
- React component output support 