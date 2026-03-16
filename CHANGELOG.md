# Changelog

All notable changes to the WordPress Block to HTML Converter will be documented in this file.

## [1.5.0] - Unreleased

### Added
- WordPress 6.9 compatibility handlers for `core/math`, `core/accordion`, `core/latest-comments`, `core/terms-query`, `core/comments-link`, and `core/comments-count`
- Selected WordPress 7.0 compatibility coverage for `core/breadcrumbs` and viewport-based `metadata.blockVisibility`
- New `./blocks/theme`, `./hydration`, `./angular`, and `./svelte` package exports to align shipped entrypoints with the source tree

### Changed
- Replaced blanket "all core blocks supported" messaging with audited compatibility language
- Expanded social/embed provider handling for newer official services such as `x`, `bluesky`, `videopress`, and `wordpress-tv`
- Refreshed benchmark guidance around repository-backed measurements instead of stale headline claims

### Performance
- Removed hot-path debug logging from conversion utilities
- Switched incremental rendering away from inlined raw block JSON toward server-rendered batch templates
- Consolidated SSR behavior into a single implementation shared by source and package builds

### Compatibility Matrix
- WordPress `6.8`: supported baseline
- WordPress `6.9`: supported target
- WordPress `7.0 beta/RC`: partial support for selected block and metadata changes; full navigation/query/theme parity remains deferred

## [1.0.0] - 2025-06-17

### 🎉 FIRST STABLE RELEASE - PRODUCTION READY

This major milestone release establishes wp-block-to-html as the definitive WordPress block conversion solution with industry-leading performance and comprehensive feature coverage.

### 🚀 Major Features Added
- **Client-Side Hydration Module**: Production-ready hydration system with 4 strategies (immediate, viewport, intersection, idle)
- **Progressive Hydration**: IntersectionObserver-based viewport detection with automatic polyfills
- **Hydration Manager**: Complete lifecycle management with statistics tracking and error handling
- **Performance Engine**: Initial launch benchmark headline reported 947 blocks/ms throughput
- **Modular Architecture**: 99% bundle size reduction through optimized entry points

### 🏗️ Hydration Infrastructure
- **Four Hydration Strategies**: 
  - Immediate hydration for critical components
  - Viewport-based hydration with IntersectionObserver
  - Interaction-based hydration for user-triggered elements
  - Idle hydration for non-critical components
- **Plugin-Based Design**: Extensible architecture ready for framework-specific implementations
- **Browser Compatibility**: Comprehensive polyfill support and graceful degradation
- **TypeScript Support**: Full type safety with advanced TypeScript features
- **Queue Management**: Optimized concurrency control and performance monitoring

### 💡 Framework Ecosystem Complete
- **React Integration**: Component output with hooks-ready architecture
- **Vue Integration**: Composition API compatible components
- **Angular Integration**: Service-based architecture support
- **Svelte Integration**: Action-based component system

### 📈 Performance Excellence
- **Industry-Leading Speed**: Initial launch messaging highlighted a 947 blocks/ms benchmark run
- **Bundle Optimization**: Core bundle reduced to <11KB (99% reduction)
- **Memory Efficiency**: Linear scaling with optimized memory usage
- **SSR Optimizations**: Core Web Vitals improvements for better user experience

### 🔧 Production Features
- **WordPress Block Coverage**: This launch-era claim was superseded by the audited compatibility statement in `v1.5.0`
- **Comprehensive Testing**: 77 tests covering all functionality
- **Documentation Suite**: Complete API reference and user guides
- **Browser Compatibility**: Cross-browser testing and validation
- **Content Handling**: Raw, rendered, and hybrid processing modes

### 🎯 Quality Assurance
- **Zero Breaking Changes**: Backward compatible with all v0.x releases
- **Production Tested**: Comprehensive test suite with performance benchmarks
- **Developer Experience**: TypeScript-first with excellent IDE support
- **Community Ready**: Plugin system enables community contributions

### 📊 Success Metrics Achieved
- **Core Block Support**: 100% (Target: 100%) ✅
- **Performance**: <2.2ms for 1000 blocks (Target: <500ms) ✅ 99.5% exceeded
- **Framework Coverage**: 4 frameworks (Target: 3+) ✅
- **Bundle Size**: <11KB core (Target: <50KB) ✅ 96% exceeded
- **Hydration Infrastructure**: Production-ready (Target: Basic) ✅ Exceeded

### 🌟 Strategic Impact
- **Hydration Differentiation**: The initial release positioned hydration support as a key differentiator
- **Ecosystem Foundation**: Plugin architecture enables rapid community growth
- **Performance Standard**: Sets new performance benchmarks for the ecosystem
- **Developer Adoption**: Production-ready quality encourages widespread adoption

### ⚡ Migration Guide
No breaking changes from v0.5.1. All existing implementations continue to work unchanged. New hydration features are opt-in additions that enhance existing functionality.

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