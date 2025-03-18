// Import core functionality 
const { convertBlocks, registerBlockHandler } = require('../dist/core.js');
// Import only tailwind mapping
const { tailwindMapping } = require('../dist/frameworks/tailwind.js');
// Import only paragraph handler
const { paragraphBlockHandler } = require('../dist/blocks/text.js');

// Register only the block handlers we need
registerBlockHandler('core/paragraph', paragraphBlockHandler);

// Sample block data
const blocks = [
  {
    blockName: 'core/paragraph',
    attrs: { content: 'Hello, world!', align: 'center' },
    innerBlocks: [],
    innerContent: ['<p class="has-text-align-center">Hello, world!</p>']
  }
];

// Convert with Tailwind CSS
const html = convertBlocks(blocks, { 
  cssFramework: 'tailwind',
  customClassMap: { tailwind: tailwindMapping }
});

console.log('Converted HTML with Tailwind:', html); 