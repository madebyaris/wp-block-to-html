# WP Block to HTML SSR Optimization Benchmarks

This directory contains benchmarking tools to measure the performance impact of various SSR optimization options provided by the WP Block to HTML library.

## Running the Benchmarks

To run the benchmarks, first ensure you've built the library:

```bash
npm run build
```

Then run the benchmark script:

```bash
node benchmarks/ssr-optimization-benchmarks.js
```

The benchmark will test various SSR optimization configurations on small, medium, and large posts to measure performance characteristics.

## Benchmark Configurations

The benchmarks test the following optimization configurations:

1. **No Optimization** - SSR optimizations disabled
2. **Minimal Optimization** - Basic SSR with optimizationDepth=1
3. **Balanced Optimization** - Medium-level optimizations with optimizationDepth=2 and prioritizeAboveTheFold
4. **Maximum Optimization** - Aggressive optimizations with optimizationDepth=3, prioritizeAboveTheFold, and critical path rendering
5. **Balanced with Lazy Loading** - Adds lazyLoadMedia and preserveFirstImage to balanced optimization
6. **Balanced with Preconnect** - Adds preconnect option to balanced optimization
7. **Balanced with Remove Duplicate Styles** - Adds removeDuplicateStyles to balanced optimization
8. **Balanced with Minify Output** - Adds minifyOutput to balanced optimization
9. **Maximum with All Features** - Combines all available optimization options

## Understanding Results

The benchmarks measure and report:

- **Avg Time (ms)** - Average processing time in milliseconds
- **Size (KB)** - Size of the generated HTML in kilobytes
- **Throughput (KB/s)** - Processing throughput in kilobytes per second

Results are saved to:
- `benchmarks/results/benchmark-results.json` - Full JSON results
- `benchmarks/results/benchmark-results.csv` - CSV for easy import into spreadsheets

## Test Data

The benchmarks use three sample posts with varying complexity:

- `small-post.json` - A simple post with a few blocks
- `medium-post.json` - A moderately complex post with more blocks and nesting
- `large-post.json` - A complex post with many nested blocks and various media types

These sample posts are designed to represent real-world WordPress content with a variety of block types and structures.

## Interpreting Performance Tradeoffs

When reviewing benchmark results, consider these tradeoffs:

1. **Processing Time vs. User Experience** - Some optimizations may increase server processing time but improve the end-user experience through better loading performance.

2. **Output Size vs. Functionality** - Some optimizations may increase the HTML size (e.g., by adding attributes or preconnect links) but improve loading performance.

3. **Optimization Level Choices** - The "balanced" configuration often provides the best tradeoff between processing overhead and user experience benefits.

## Customizing Benchmarks

To customize the benchmarks for your specific needs:

1. Modify the configurations in `ssr-optimization-benchmarks.js` to test different option combinations
2. Replace the test data files with your own WordPress block content
3. Adjust the number of iterations or other benchmark parameters 