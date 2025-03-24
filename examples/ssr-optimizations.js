/**
 * Server-Side Rendering Optimizations Example
 * 
 * This example demonstrates how to use the SSR optimization features
 * of the wp-block-to-html library in a server environment.
 */

// In a real environment, you would import from the package
// const { processBlocksForSSR } = require('wp-block-to-html');
// For local development:
const { processBlocksForSSR } = require('../dist');

// Sample WordPress block data with content
const sampleContent = {
  blocks: [
    {
      blockName: 'core/heading',
      attrs: { level: 1 },
      innerContent: ['<h1>Server-Side Rendering Example</h1>']
    },
    {
      blockName: 'core/paragraph',
      attrs: {},
      innerContent: ['<p>This content has been optimized for server rendering.</p>']
    },
    {
      blockName: 'core/image',
      attrs: {
        url: 'https://example.com/image.jpg',
        alt: 'Example image'
      },
      innerContent: ['<figure class="wp-block-image"><img src="https://example.com/image.jpg" alt="Example image"/></figure>']
    },
    {
      blockName: 'core/heading',
      attrs: { level: 2 },
      innerContent: ['<h2>Client-side Interactive Elements</h2>']
    },
    {
      blockName: 'core/html',
      attrs: {},
      innerContent: ['<div class="interactive-widget"><button onclick="alert(\'This should be removed in SSR\')">Click me</button><script class="client-only">console.log("This script should be removed in SSR mode");</script></div>']
    }
  ]
};

// Helper function to compare different optimization levels
function compareOptimizationLevels() {
  console.log('=== SSR Optimization Examples ===\n');
  
  // 1. No optimization (standard conversion)
  const standardHtml = processBlocksForSSR(sampleContent);
  console.log('Standard HTML (No SSR optimization):');
  console.log(`Size: ${standardHtml.length} bytes`);
  console.log('----------------------------\n');
  
  // 2. Minimal optimization
  const minimalHtml = processBlocksForSSR(sampleContent, {
    ssrOptions: {
      enabled: true,
      level: 'minimal'
    }
  });
  console.log('Minimal Optimization:');
  console.log(`Size: ${minimalHtml.length} bytes (${Math.round((1 - minimalHtml.length / standardHtml.length) * 100)}% reduction)`);
  console.log('----------------------------\n');
  
  // 3. Balanced optimization (default)
  const balancedHtml = processBlocksForSSR(sampleContent, {
    ssrOptions: {
      enabled: true,
      level: 'balanced'
    }
  });
  console.log('Balanced Optimization (Default):');
  console.log(`Size: ${balancedHtml.length} bytes (${Math.round((1 - balancedHtml.length / standardHtml.length) * 100)}% reduction)`);
  console.log('----------------------------\n');
  
  // 4. Maximum optimization
  const maximumHtml = processBlocksForSSR(sampleContent, {
    ssrOptions: {
      enabled: true,
      level: 'maximum',
      inlineCriticalCSS: true
    }
  });
  console.log('Maximum Optimization:');
  console.log(`Size: ${maximumHtml.length} bytes (${Math.round((1 - maximumHtml.length / standardHtml.length) * 100)}% reduction)`);
  console.log('----------------------------\n');
  
  // 5. Custom pre/post processing
  const customHtml = processBlocksForSSR(sampleContent, {
    ssrOptions: {
      enabled: true,
      level: 'balanced',
      preProcessHTML: (html) => {
        return html.replace(/<img/g, '<img fetchpriority="high"');
      },
      postProcessHTML: (html) => {
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SSR Optimized Page</title>
</head>
<body>
  <div id="root">${html}</div>
</body>
</html>`;
      }
    }
  });
  console.log('Custom Processing:');
  console.log('(Added full HTML structure and fetchpriority attribute)');
  console.log(`Size: ${customHtml.length} bytes`);
}

// Compare the different optimization levels
compareOptimizationLevels();

// Example with Next.js-specific optimizations
function nextJsExample() {
  console.log('\n=== Framework-Specific Example (Next.js) ===\n');
  
  const nextJsOptimizedHtml = processBlocksForSSR(sampleContent, {
    cssFramework: 'tailwind',
    ssrOptions: {
      enabled: true,
      level: 'maximum',
      // Custom processor to make HTML compatible with Next.js JSX
      preProcessHTML: (html) => {
        return html
          .replace(/class="/g, 'className="')
          .replace(/<script/g, '{/* <script')
          .replace(/<\/script>/g, '</script> */}');
      },
      // Add Next.js Image component placeholders
      postProcessHTML: (html) => {
        return html.replace(
          /<img([^>]*)src="([^"]+)"([^>]*)>/g,
          '<Image$1src="$2"$3 layout="responsive" width={1200} height={800} />'
        );
      }
    }
  });
  
  console.log('Next.js Optimized HTML:');
  console.log('(Converted class to className, made script tags into comments, converted img to Next.js Image)');
  console.log(`Size: ${nextJsOptimizedHtml.length} bytes`);
}

// Run Next.js example
nextJsExample();

// In a real server environment (Express.js example)
function expressServerExample() {
  console.log('\n=== Express.js Server Implementation ===');
  console.log(`
const express = require('express');
const { processBlocksForSSR } = require('wp-block-to-html');
const app = express();

app.get('/post/:id', async (req, res) => {
  try {
    // Fetch WordPress post data
    const postData = await fetchWordPressPost(req.params.id);
    
    // Process with SSR optimizations
    const optimizedHtml = processBlocksForSSR(postData.blocks, {
      cssFramework: 'tailwind',
      ssrOptions: {
        enabled: true,
        level: 'maximum',
        // Add any custom pre/post processing if needed
      }
    });
    
    // Send optimized HTML
    res.send(\`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>\${postData.title}</title>
      </head>
      <body>
        <div id="root">\${optimizedHtml}</div>
      </body>
      </html>
    \`);
  } catch (error) {
    res.status(500).send('Error processing content');
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
  `);
}

// Show Express.js implementation example
expressServerExample(); 