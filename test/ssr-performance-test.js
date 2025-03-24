/**
 * Performance benchmark for SSR optimization module
 */

const { processBlocksForSSR } = require('../dist');

// Helper function to generate test blocks
function generateTestBlocks(count) {
  const blocks = [];
  
  for (let i = 0; i < count; i++) {
    // Add different block types to make it more realistic
    if (i % 4 === 0) {
      blocks.push({
        blockName: 'core/paragraph',
        attrs: {},
        innerContent: [`<p>This is paragraph ${i}. It contains some text content that will be processed by the SSR optimization module.</p>`]
      });
    } else if (i % 4 === 1) {
      blocks.push({
        blockName: 'core/heading',
        attrs: { level: 2 },
        innerContent: [`<h2>Heading ${i}</h2>`]
      });
    } else if (i % 4 === 2) {
      blocks.push({
        blockName: 'core/image',
        attrs: {
          url: `https://example.com/image${i}.jpg`,
          alt: `Image ${i}`
        },
        innerContent: [`<figure class="wp-block-image"><img src="https://example.com/image${i}.jpg" alt="Image ${i}"/></figure>`]
      });
    } else {
      blocks.push({
        blockName: 'core/html',
        attrs: {},
        innerContent: [`<div class="custom-html-block">
          <span>Custom HTML Block ${i}</span>
          <button onclick="alert('Click event ${i}')">Click me</button>
          <script>console.log('Script in block ${i}')</script>
        </div>`]
      });
    }
  }
  
  return { blocks };
}

// Function to benchmark SSR optimizations with different settings
function benchmarkSSR(blockCounts) {
  console.log('\n=== SSR Optimization Performance Benchmark ===\n');
  
  for (const count of blockCounts) {
    console.log(`\nTesting with ${count} blocks:`);
    console.log('-------------------------------------------');
    
    const blocks = generateTestBlocks(count);
    
    // Standard conversion (no SSR)
    const startStandard = performance.now();
    const standardResult = processBlocksForSSR(blocks);
    const endStandard = performance.now();
    const standardTime = endStandard - startStandard;
    console.log(`Standard conversion: ${standardTime.toFixed(3)}ms (${(count / standardTime).toFixed(1)} blocks/ms)`);
    
    // Minimal optimization
    const startMinimal = performance.now();
    const minimalResult = processBlocksForSSR(blocks, {
      ssrOptions: {
        enabled: true,
        level: 'minimal'
      }
    });
    const endMinimal = performance.now();
    const minimalTime = endMinimal - startMinimal;
    console.log(`Minimal optimization: ${minimalTime.toFixed(3)}ms (${(count / minimalTime).toFixed(1)} blocks/ms)`);
    
    // Balanced optimization (default)
    const startBalanced = performance.now();
    const balancedResult = processBlocksForSSR(blocks, {
      ssrOptions: {
        enabled: true,
        level: 'balanced'
      }
    });
    const endBalanced = performance.now();
    const balancedTime = endBalanced - startBalanced;
    console.log(`Balanced optimization: ${balancedTime.toFixed(3)}ms (${(count / balancedTime).toFixed(1)} blocks/ms)`);
    
    // Maximum optimization
    const startMaximum = performance.now();
    const maximumResult = processBlocksForSSR(blocks, {
      ssrOptions: {
        enabled: true,
        level: 'maximum',
        inlineCriticalCSS: true
      }
    });
    const endMaximum = performance.now();
    const maximumTime = endMaximum - startMaximum;
    console.log(`Maximum optimization: ${maximumTime.toFixed(3)}ms (${(count / maximumTime).toFixed(1)} blocks/ms)`);
    
    // Size reduction statistics
    const standardSize = standardResult.length;
    const minimalSize = minimalResult.length;
    const balancedSize = balancedResult.length;
    const maximumSize = maximumResult.length;
    
    console.log('\nSize comparison:');
    console.log(`Standard size: ${standardSize} bytes`);
    console.log(`Minimal optimization: ${minimalSize} bytes (${Math.round((1 - minimalSize / standardSize) * 100)}% reduction)`);
    console.log(`Balanced optimization: ${balancedSize} bytes (${Math.round((1 - balancedSize / standardSize) * 100)}% reduction)`);
    console.log(`Maximum optimization: ${maximumSize} bytes (${Math.round((1 - maximumSize / standardSize) * 100)}% reduction)`);
  }
}

// Test with different block counts
const blockCounts = [10, 100, 500];
benchmarkSSR(blockCounts);

// For extreme performance test, uncomment this:
// benchmarkSSR([1000, 5000]); 