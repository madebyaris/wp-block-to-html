// Disable debug logs
process.env.DEBUG = '';

const { convertBlocks } = require('./dist/index.js');

// Create sample blocks of different types
function createBlocks(count) {
  const blocks = [];
  
  for (let i = 0; i < count; i++) {
    const blockType = i % 4;
    
    if (blockType === 0) {
      blocks.push({
        blockName: 'core/paragraph',
        attrs: {},
        innerBlocks: [],
        innerHTML: '<p>This is a test paragraph with some content.</p>',
        innerContent: ['<p>This is a test paragraph with some content.</p>']
      });
    } else if (blockType === 1) {
      blocks.push({
        blockName: 'core/heading',
        attrs: { level: 2 },
        innerBlocks: [],
        innerHTML: '<h2>This is a heading</h2>',
        innerContent: ['<h2>This is a heading</h2>']
      });
    } else if (blockType === 2) {
      blocks.push({
        blockName: 'core/image',
        attrs: { url: 'https://example.com/image.jpg', alt: 'Test image' },
        innerBlocks: [],
        innerHTML: '<figure class="wp-block-image"><img src="https://example.com/image.jpg" alt="Test image"/></figure>',
        innerContent: ['<figure class="wp-block-image"><img src="https://example.com/image.jpg" alt="Test image"/></figure>']
      });
    } else {
      blocks.push({
        blockName: 'core/list',
        attrs: {},
        innerBlocks: [],
        innerHTML: '<ul><li>Item 1</li><li>Item 2</li></ul>',
        innerContent: ['<ul><li>Item 1</li><li>Item 2</li></ul>']
      });
    }
  }
  
  return blocks;
}

// Create nested blocks structure to simulate real-world scenarios
function createNestedBlocks(count) {
  const mainBlocks = [];
  const groupsCount = Math.floor(count / 10);
  
  for (let i = 0; i < groupsCount; i++) {
    const innerBlocks = createBlocks(10);
    mainBlocks.push({
      blockName: 'core/group',
      attrs: {},
      innerBlocks: innerBlocks,
      innerHTML: '<div class="wp-block-group"></div>',
      innerContent: ['<div class="wp-block-group">', null, '</div>']
    });
  }
  
  return mainBlocks;
}

// Disable console.log to suppress framework class debug messages
const originalConsoleLog = console.log;
console.log = function() {
  // Suppress logs that contain "Applying classes for block" or "Final classes for"
  const str = arguments[0];
  if (typeof str === 'string' && 
     (str.includes('Applying classes for block') || 
      str.includes('Final classes for'))) {
    return;
  }
  originalConsoleLog.apply(console, arguments);
};

// Run performance tests for various block counts
console.log('\n===== PERFORMANCE BENCHMARK =====');
console.log('Testing conversion speed for different block counts:');

const blockCounts = [10, 100, 1000, 5000, 10000];

blockCounts.forEach(count => {
  const blocks = createBlocks(count);
  
  console.log(`\n----- ${count} Blocks -----`);
  
  // Run multiple times to get more accurate result
  const runs = 3;
  let totalTime = 0;
  
  for (let i = 0; i < runs; i++) {
    const start = performance.now();
    const html = convertBlocks(blocks);
    const end = performance.now();
    const time = end - start;
    totalTime += time;
    
    if (i === 0) {
      console.log(`Run ${i+1}: ${time.toFixed(3)}ms (Output: ${html.length} characters)`);
    } else {
      console.log(`Run ${i+1}: ${time.toFixed(3)}ms`);
    }
  }
  
  console.log(`Average: ${(totalTime / runs).toFixed(3)}ms`);
});

// Test nested blocks performance
console.log('\n===== NESTED BLOCKS PERFORMANCE =====');
console.log('Testing conversion speed for nested blocks:');

const nestedBlockCounts = [100, 500, 1000];

nestedBlockCounts.forEach(count => {
  const blocks = createNestedBlocks(count);
  
  console.log(`\n----- ${count} Blocks (in groups of 10) -----`);
  
  const start = performance.now();
  const html = convertBlocks(blocks);
  const end = performance.now();
  const time = end - start;
  
  console.log(`Time: ${time.toFixed(3)}ms (Output: ${html.length} characters)`);
});

// Framework comparison tests
console.log('\n===== FRAMEWORK COMPARISON =====');
console.log('Testing 1000 blocks with different CSS frameworks:');

const blocks1000 = createBlocks(1000);
const frameworks = ['none', 'tailwind', 'bootstrap'];

frameworks.forEach(framework => {
  console.log(`\n----- Framework: ${framework} -----`);
  
  const runs = 3;
  let totalTime = 0;
  
  for (let i = 0; i < runs; i++) {
    const start = performance.now();
    convertBlocks(blocks1000, { framework: framework === 'none' ? undefined : framework });
    const end = performance.now();
    const time = end - start;
    totalTime += time;
    
    console.log(`Run ${i+1}: ${time.toFixed(3)}ms`);
  }
  
  console.log(`Average: ${(totalTime / runs).toFixed(3)}ms`);
});

// Content handling mode comparison
console.log('\n===== CONTENT HANDLING MODE COMPARISON =====');
console.log('Testing 1000 blocks with different content handling modes:');

const contentModes = ['raw', 'rendered', 'hybrid'];

contentModes.forEach(mode => {
  console.log(`\n----- Mode: ${mode} -----`);
  
  const runs = 3;
  let totalTime = 0;
  
  for (let i = 0; i < runs; i++) {
    const start = performance.now();
    convertBlocks(blocks1000, { contentHandling: mode });
    const end = performance.now();
    const time = end - start;
    totalTime += time;
    
    console.log(`Run ${i+1}: ${time.toFixed(3)}ms`);
  }
  
  console.log(`Average: ${(totalTime / runs).toFixed(3)}ms`);
});

// Restore console.log
console.log = originalConsoleLog; 