/**
 * SSR Optimization Benchmarks
 * 
 * This file contains benchmark tests for measuring the performance of
 * various SSR optimization features and levels.
 */

const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');
const { convertBlocks } = require('../dist/index.js');

// Load test data
const smallPost = require('./data/small-post.json');
const mediumPost = require('./data/medium-post.json');
const largePost = require('./data/large-post.json');

// Define benchmark configurations
const configurations = [
  {
    name: 'No Optimization',
    options: {
      ssr: false
    }
  },
  {
    name: 'Minimal Optimization',
    options: {
      ssr: true,
      ssrOptions: {
        optimizationDepth: 1
      }
    }
  },
  {
    name: 'Balanced Optimization',
    options: {
      ssr: true,
      ssrOptions: {
        optimizationDepth: 2,
        prioritizeAboveTheFold: true
      }
    }
  },
  {
    name: 'Maximum Optimization',
    options: {
      ssr: true,
      ssrOptions: {
        optimizationDepth: 3,
        prioritizeAboveTheFold: true,
        criticalPathOnly: true,
        deferNonCritical: true
      }
    }
  },
  {
    name: 'Balanced with Lazy Loading',
    options: {
      ssr: true,
      ssrOptions: {
        optimizationDepth: 2,
        prioritizeAboveTheFold: true,
        lazyLoadMedia: true,
        preserveFirstImage: true
      }
    }
  },
  {
    name: 'Balanced with Preconnect',
    options: {
      ssr: true,
      ssrOptions: {
        optimizationDepth: 2,
        prioritizeAboveTheFold: true,
        preconnect: true
      }
    }
  },
  {
    name: 'Balanced with Remove Duplicate Styles',
    options: {
      ssr: true,
      ssrOptions: {
        optimizationDepth: 2,
        prioritizeAboveTheFold: true,
        removeDuplicateStyles: true
      }
    }
  },
  {
    name: 'Balanced with Minify Output',
    options: {
      ssr: true,
      ssrOptions: {
        optimizationDepth: 2,
        prioritizeAboveTheFold: true,
        minifyOutput: true
      }
    }
  },
  {
    name: 'Maximum with All Features',
    options: {
      ssr: true,
      ssrOptions: {
        optimizationDepth: 3,
        prioritizeAboveTheFold: true,
        lazyLoadMedia: true,
        preserveFirstImage: true,
        criticalPathOnly: true,
        deferNonCritical: true,
        preconnect: true,
        removeDuplicateStyles: true,
        minifyOutput: true
      }
    }
  }
];

/**
 * Run a single benchmark
 * @param {Object} content - The WordPress post blocks
 * @param {Object} config - Benchmark configuration
 * @param {number} iterations - Number of iterations to run
 * @returns {Object} Benchmark results
 */
function runBenchmark(content, config, iterations = 10) {
  const times = [];
  let output = '';
  let outputSize = 0;
  
  // Warm up
  convertBlocks(content.blocks, config.options);
  
  // Run benchmark
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    output = convertBlocks(content.blocks, config.options);
    const end = performance.now();
    times.push(end - start);
  }
  
  outputSize = Buffer.byteLength(output, 'utf8');
  
  // Calculate statistics
  const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
  const throughput = (outputSize / 1024) / (avgTime / 1000); // KB/s
  
  return {
    name: config.name,
    avgTime: avgTime.toFixed(2),
    outputSize: (outputSize / 1024).toFixed(2),
    throughput: throughput.toFixed(2),
    output: output.substring(0, 100) + '...' // Just a preview
  };
}

/**
 * Run all benchmarks
 */
function runBenchmarks() {
  const results = {
    small: [],
    medium: [],
    large: []
  };
  
  console.log('Running SSR optimization benchmarks...');
  
  // Small post benchmarks
  console.log('\nSmall Post Benchmarks:');
  console.log('======================');
  configurations.forEach(config => {
    console.log(`Running ${config.name}...`);
    const result = runBenchmark(smallPost, config);
    results.small.push(result);
    console.log(`- Avg Time: ${result.avgTime}ms, Size: ${result.outputSize}KB, Throughput: ${result.throughput}KB/s`);
  });
  
  // Medium post benchmarks
  console.log('\nMedium Post Benchmarks:');
  console.log('======================');
  configurations.forEach(config => {
    console.log(`Running ${config.name}...`);
    const result = runBenchmark(mediumPost, config);
    results.medium.push(result);
    console.log(`- Avg Time: ${result.avgTime}ms, Size: ${result.outputSize}KB, Throughput: ${result.throughput}KB/s`);
  });
  
  // Large post benchmarks
  console.log('\nLarge Post Benchmarks:');
  console.log('======================');
  configurations.forEach(config => {
    console.log(`Running ${config.name}...`);
    const result = runBenchmark(largePost, config);
    results.large.push(result);
    console.log(`- Avg Time: ${result.avgTime}ms, Size: ${result.outputSize}KB, Throughput: ${result.throughput}KB/s`);
  });
  
  // Print summary tables
  printSummaryTable('Small Post', results.small);
  printSummaryTable('Medium Post', results.medium);
  printSummaryTable('Large Post', results.large);
  
  // Save results to file
  const outputDir = path.join(__dirname, 'results');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  
  fs.writeFileSync(
    path.join(outputDir, 'benchmark-results.json'),
    JSON.stringify(results, null, 2)
  );
  
  // Save as CSV as well
  saveResultsAsCSV(results, path.join(outputDir, 'benchmark-results.csv'));
  
  console.log(`\nBenchmark results saved to ${path.join(outputDir, 'benchmark-results.json')} and ${path.join(outputDir, 'benchmark-results.csv')}`);
}

/**
 * Print a summary table of results
 * @param {string} title - Table title
 * @param {Array} results - Benchmark results
 */
function printSummaryTable(title, results) {
  console.log(`\n${title} Summary:`);
  console.log('='.repeat(80));
  console.log('Configuration'.padEnd(40) + 'Avg Time (ms)'.padEnd(15) + 'Size (KB)'.padEnd(15) + 'Throughput (KB/s)');
  console.log('-'.repeat(80));
  
  results.forEach(result => {
    console.log(
      result.name.padEnd(40) + 
      result.avgTime.padEnd(15) + 
      result.outputSize.padEnd(15) + 
      result.throughput
    );
  });
  
  console.log('='.repeat(80));
}

/**
 * Save results as CSV
 * @param {Object} results - All benchmark results
 * @param {string} filepath - Output file path
 */
function saveResultsAsCSV(results, filepath) {
  const headers = 'Post Size,Configuration,Avg Time (ms),Size (KB),Throughput (KB/s)\n';
  let csvContent = headers;
  
  ['small', 'medium', 'large'].forEach(size => {
    results[size].forEach(result => {
      csvContent += `${size},${result.name},${result.avgTime},${result.outputSize},${result.throughput}\n`;
    });
  });
  
  fs.writeFileSync(filepath, csvContent);
}

// Run benchmarks if this file is executed directly
if (require.main === module) {
  runBenchmarks();
}

module.exports = {
  runBenchmark,
  runBenchmarks
}; 