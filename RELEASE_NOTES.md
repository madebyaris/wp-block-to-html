# WordPress Block to HTML Converter - Release Notes

## v1.0.0-beta (2023-07-15)

We're excited to announce the first beta release of the WordPress Block to HTML Converter library! This library allows you to convert WordPress block data into HTML or framework-specific components.

### Features

#### Core Functionality
- Convert WordPress blocks to HTML
- Support for custom block handlers
- Plugin system for extensibility
- CSS framework integration (Tailwind CSS, Bootstrap)
- Framework adapters for React and Vue

#### Block Handlers
- **Text Blocks**: Paragraph, Heading, List, Quote, Code, Preformatted, Pullquote, Verse, Details, Classic
- **Media Blocks**: Image, Gallery, Audio, Video, File, Cover, Media & Text, Embed (YouTube, Twitter, Vimeo, etc.)
- **Layout Blocks**: Group, Columns, Row, Stack, Grid
- **Widget Blocks**: Shortcode, Button, Custom HTML, Table, Archives, Calendar, Categories, Page List, RSS, Search, Social Links
- **Dynamic Blocks**: Latest Posts, More, Page Break, Separator, Spacer

### Installation

```bash
npm install wp-block-to-html
```

### Basic Usage

```javascript
import { convertBlocks } from 'wp-block-to-html';

const blocks = [
  {
    blockName: "core/paragraph",
    attrs: { content: "Hello, world!" },
    innerBlocks: [],
    innerContent: ["Hello, world!"]
  }
];

const html = convertBlocks(blocks);
console.log(html); // <p>Hello, world!</p>
```

### Framework Integration

#### React

```javascript
import { createReactComponent } from 'wp-block-to-html';
import React from 'react';
import ReactDOM from 'react-dom';

const blocks = [
  {
    blockName: "core/heading",
    attrs: { content: "React Example", level: 2 },
    innerBlocks: [],
    innerContent: ["React Example"]
  }
];

const BlocksComponent = createReactComponent(blocks);
ReactDOM.render(<BlocksComponent />, document.getElementById('root'));
```

#### Vue

```javascript
import { createVueComponentOptions } from 'wp-block-to-html';
import { createApp } from 'vue';

const blocks = [
  {
    blockName: "core/heading",
    attrs: { content: "Vue Example", level: 2 },
    innerBlocks: [],
    innerContent: ["Vue Example"]
  }
];

const app = createApp({
  template: '<div><wp-blocks-renderer /></div>',
  components: {
    'wp-blocks-renderer': createVueComponentOptions(blocks)
  }
});
app.mount('#app');
```

### CSS Framework Integration

```javascript
import { convertBlocks } from 'wp-block-to-html';

const blocks = [/* ... */];

// Use Tailwind CSS classes
const htmlWithTailwind = convertBlocks(blocks, { cssFramework: 'tailwind' });

// Use Bootstrap classes
const htmlWithBootstrap = convertBlocks(blocks, { cssFramework: 'bootstrap' });
```

### Known Issues

- Some complex block attributes may not be fully supported
- Angular and Svelte framework adapters are still in development
- Performance optimizations for large block collections are planned for future releases

### Feedback and Contributions

We welcome feedback and contributions! Please submit issues and pull requests on our [GitHub repository](https://github.com/yourusername/wp-block-to-html).

## Upcoming Features (Planned for v1.0.0)

- Angular framework adapter
- Svelte framework adapter
- Additional block handlers
- Performance optimizations
- Enhanced documentation
- More comprehensive test coverage 