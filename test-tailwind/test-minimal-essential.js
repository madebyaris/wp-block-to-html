// Import only core convertBlocks
const { convertBlocks } = require('../dist/core.js');
// Import only tailwind mapping
const { tailwindMapping } = require('../dist/frameworks/tailwind.js');

// Sample block data with pre-rendered HTML
const block = {
  blockName: 'core/paragraph',
  attrs: { content: 'Hello, world!', align: 'center' },
  innerBlocks: [],
  innerContent: ['<p class="has-text-align-center">Hello, world!</p>'],
  rendered: '<p class="has-text-align-center">Hello, world!</p>'
};

// Convert with Tailwind CSS in hybrid mode (works without registering block handlers)
const html = convertBlocks(block, { 
  cssFramework: 'tailwind',
  contentHandling: 'hybrid',
  customClassMap: { tailwind: tailwindMapping }
});

console.log('Converted HTML with Tailwind (hybrid mode):', html); 