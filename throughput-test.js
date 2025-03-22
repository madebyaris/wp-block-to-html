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

// Extreme throughput test
console.log('\n===== EXTREME THROUGHPUT TEST =====');

// Test with increasingly large numbers of blocks
const extremeBlockCounts = [20000, 50000, 100000];

extremeBlockCounts.forEach(count => {
  console.log(`\nCreating ${count} blocks...`);
  const blocks = createBlocks(count);
  
  console.log(`Converting ${count} blocks...`);
  const start = performance.now();
  const html = convertBlocks(blocks, { contentHandling: 'rendered' }); // Use fastest mode
  const end = performance.now();
  const time = end - start;
  
  const throughput = count / time;
  const outputSize = html.length / 1024 / 1024; // Size in MB
  
  console.log(`Time: ${time.toFixed(2)}ms`);
  console.log(`Throughput: ${Math.round(throughput)} blocks per millisecond`);
  console.log(`Output size: ${outputSize.toFixed(2)} MB`);
  console.log(`Memory usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`);
});

// Test with a real-world mix of complex blocks
console.log('\n===== COMPLEX CONTENT TEST =====');

// Create a more realistic post with mixed content
function createComplexPost(paragraphCount = 100) {
  const blocks = [];
  
  // Add a header
  blocks.push({
    blockName: 'core/heading',
    attrs: { level: 1 },
    innerBlocks: [],
    innerHTML: '<h1>Complex Post Title with Many Blocks</h1>',
    innerContent: ['<h1>Complex Post Title with Many Blocks</h1>']
  });
  
  // Add an image
  blocks.push({
    blockName: 'core/image',
    attrs: { url: 'https://example.com/featured.jpg', alt: 'Featured image', className: 'is-style-large' },
    innerBlocks: [],
    innerHTML: '<figure class="wp-block-image is-style-large"><img src="https://example.com/featured.jpg" alt="Featured image"/><figcaption>Featured image caption</figcaption></figure>',
    innerContent: ['<figure class="wp-block-image is-style-large"><img src="https://example.com/featured.jpg" alt="Featured image"/><figcaption>Featured image caption</figcaption></figure>']
  });
  
  // Add paragraphs interspersed with other elements
  for (let i = 0; i < paragraphCount; i++) {
    // Add a paragraph
    blocks.push({
      blockName: 'core/paragraph',
      attrs: {},
      innerBlocks: [],
      innerHTML: `<p>This is paragraph ${i + 1} of the complex post. It contains some text that would be found in a typical blog post or article. The purpose is to simulate a real-world WordPress post with plenty of content.</p>`,
      innerContent: [`<p>This is paragraph ${i + 1} of the complex post. It contains some text that would be found in a typical blog post or article. The purpose is to simulate a real-world WordPress post with plenty of content.</p>`]
    });
    
    // Add a heading every 5 paragraphs
    if (i % 5 === 4) {
      blocks.push({
        blockName: 'core/heading',
        attrs: { level: 2 },
        innerBlocks: [],
        innerHTML: `<h2>Section Heading ${(i + 1) / 5}</h2>`,
        innerContent: [`<h2>Section Heading ${(i + 1) / 5}</h2>`]
      });
    }
    
    // Add a list every 7 paragraphs
    if (i % 7 === 6) {
      blocks.push({
        blockName: 'core/list',
        attrs: {},
        innerBlocks: [],
        innerHTML: `<ul><li>List item 1 for section ${Math.floor(i / 7) + 1}</li><li>List item 2 for section ${Math.floor(i / 7) + 1}</li><li>List item 3 for section ${Math.floor(i / 7) + 1}</li></ul>`,
        innerContent: [`<ul><li>List item 1 for section ${Math.floor(i / 7) + 1}</li><li>List item 2 for section ${Math.floor(i / 7) + 1}</li><li>List item 3 for section ${Math.floor(i / 7) + 1}</li></ul>`]
      });
    }
    
    // Add a quote every 11 paragraphs
    if (i % 11 === 10) {
      blocks.push({
        blockName: 'core/quote',
        attrs: {},
        innerBlocks: [],
        innerHTML: `<blockquote class="wp-block-quote"><p>This is an important quote for section ${Math.floor(i / 11) + 1}. It demonstrates how the block converter handles quote blocks.</p><cite>WordPress Expert</cite></blockquote>`,
        innerContent: [`<blockquote class="wp-block-quote"><p>This is an important quote for section ${Math.floor(i / 11) + 1}. It demonstrates how the block converter handles quote blocks.</p><cite>WordPress Expert</cite></blockquote>`]
      });
    }
    
    // Add an image every 13 paragraphs
    if (i % 13 === 12) {
      blocks.push({
        blockName: 'core/image',
        attrs: { url: `https://example.com/image-${Math.floor(i / 13) + 1}.jpg`, alt: `Image ${Math.floor(i / 13) + 1}` },
        innerBlocks: [],
        innerHTML: `<figure class="wp-block-image"><img src="https://example.com/image-${Math.floor(i / 13) + 1}.jpg" alt="Image ${Math.floor(i / 13) + 1}"/></figure>`,
        innerContent: [`<figure class="wp-block-image"><img src="https://example.com/image-${Math.floor(i / 13) + 1}.jpg" alt="Image ${Math.floor(i / 13) + 1}"/></figure>`]
      });
    }
  }
  
  return blocks;
}

// Run the complex content test with a post containing approximately 200+ blocks
const complexPost = createComplexPost(150);
console.log(`\nTesting conversion of a complex post with ${complexPost.length} blocks...`);

const complexStart = performance.now();
const complexHtml = convertBlocks(complexPost);
const complexEnd = performance.now();
const complexTime = complexEnd - complexStart;

console.log(`Time: ${complexTime.toFixed(2)}ms`);
console.log(`Throughput: ${Math.round(complexPost.length / complexTime)} blocks per millisecond`);
console.log(`Output size: ${(complexHtml.length / 1024).toFixed(2)} KB`);
console.log(`Blocks count: ${complexPost.length}`);

// Restore console.log
console.log = originalConsoleLog; 