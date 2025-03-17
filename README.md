# wp-block-to-html

Convert WordPress Gutenberg blocks to HTML or framework-specific components with customizable styling.

[![npm version](https://img.shields.io/npm/v/wp-block-to-html.svg)](https://www.npmjs.com/package/wp-block-to-html)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- Convert WordPress Gutenberg blocks to clean HTML
- Support for all WordPress core blocks
- Customizable CSS class mapping
- Built-in support for Tailwind CSS and Bootstrap
- Framework-specific output options (React, Vue, etc.)
- Extensible plugin system for custom blocks
- TypeScript support
- Minimal dependencies

## Installation

```bash
npm install wp-block-to-html
# or
yarn add wp-block-to-html
# or
pnpm add wp-block-to-html
```

## Basic Usage

```javascript
import { convertBlocks } from 'wp-block-to-html';

// WordPress Gutenberg block data
const blockData = {
  blocks: [
    {
      blockName: 'core/paragraph',
      attrs: { align: 'center' },
      innerContent: ['<p>Hello WordPress!</p>']
    },
    // More blocks...
  ]
};

// Convert to HTML
const html = convertBlocks(blockData);
console.log(html); // <p class="wp-block-paragraph has-text-align-center">Hello WordPress!</p>

// With Tailwind CSS
const tailwindHtml = convertBlocks(blockData, { cssFramework: 'tailwind' });
console.log(tailwindHtml); // <p class="text-center">Hello WordPress!</p>
```

## Configuration Options

```javascript
// Full configuration
const options = {
  // Output format (default: 'html')
  outputFormat: 'html', // 'html' | 'react' | 'vue' | 'angular' | 'svelte'
  
  // CSS framework (default: 'none')
  cssFramework: 'tailwind', // 'none' | 'tailwind' | 'bootstrap' | 'custom'
  
  // Custom class mapping
  customClassMap: {
    'core/paragraph': {
      block: 'my-custom-paragraph',
      align: {
        center: 'my-centered-text',
        left: 'my-left-text',
        right: 'my-right-text'
      }
    }
  },
  
  // Custom block transformers
  blockTransformers: {
    'my-custom-block/special': {
      transform(blockData, options) {
        // Custom transformation logic
        return `<div class="special-block">${blockData.innerContent.join('')}</div>`;
      }
    }
  }
}

const result = convertBlocks(blockData, options);
```

## Framework Integration

### React

```javascript
import { convertBlocks } from 'wp-block-to-html';

function WordPressContent({ blocks }) {
  const html = convertBlocks(blocks, { 
    outputFormat: 'html', 
    cssFramework: 'tailwind' 
  });
  
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

// Or use the React component output
import { convertBlocksToReact } from 'wp-block-to-html/react';

function WordPressContent({ blocks }) {
  const components = convertBlocksToReact(blocks, { 
    cssFramework: 'tailwind' 
  });
  
  return <div>{components}</div>;
}
```

## Extending with Custom Blocks

```javascript
import { registerBlockHandler } from 'wp-block-to-html';

// Register a custom block handler
registerBlockHandler('my-plugin/custom-block', {
  transform(block, options) {
    const { attrs, innerContent } = block;
    // Custom transformation logic
    return `<div class="my-custom-block">${innerContent.join('')}</div>`;
  },
  
  // CSS framework mappings
  cssMapping: {
    tailwind: {
      block: 'bg-gray-100 p-4 rounded',
      // Other attribute mappings
    },
    bootstrap: {
      block: 'card p-3',
      // Other attribute mappings
    }
  }
});
```

## CSS Framework Support

The library provides built-in mappings for popular CSS frameworks:

- **Tailwind CSS**: Modern utility-first CSS framework
- **Bootstrap**: Popular UI framework
- **Custom**: Define your own class mappings

## Documentation

For complete documentation, visit [wp-block-to-html.madebyaris.com](https://wp-block-to-html.madebyaris.com)

## License

MIT 