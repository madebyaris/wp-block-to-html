/**
 * SSR Optimization Levels and Features Example
 * 
 * This example demonstrates the different optimization levels and features
 * available in the SSR optimization module introduced in version 0.5.0.
 */

const { processBlocksForSSR } = require('../dist/ssr');

// Sample WordPress block data for demonstration
const sampleContent = {
  blocks: [
    {
      blockName: 'core/heading',
      attrs: { level: 1, content: 'Server-Side Rendering Optimizations' },
      innerHTML: '<h1>Server-Side Rendering Optimizations</h1>'
    },
    {
      blockName: 'core/paragraph',
      attrs: {},
      innerHTML: '<p>This is a demonstration of different SSR optimization levels and features available in version 0.5.0.</p>'
    },
    {
      blockName: 'core/image',
      attrs: {
        url: 'https://example.com/hero-image.jpg',
        alt: 'Hero Image',
        width: 1200,
        height: 600
      },
      innerHTML: '<figure class="wp-block-image"><img src="https://example.com/hero-image.jpg" alt="Hero Image" width="1200" height="600" /></figure>'
    },
    {
      blockName: 'core/paragraph',
      attrs: {},
      innerHTML: '<p>The <strong>WP Block to HTML</strong> library includes various optimization techniques for server-side rendering.</p>'
    },
    {
      blockName: 'core/image',
      attrs: {
        url: 'https://example.com/content-image-1.jpg',
        alt: 'Content Image 1',
        width: 800,
        height: 400
      },
      innerHTML: '<figure class="wp-block-image"><img src="https://example.com/content-image-1.jpg" alt="Content Image 1" width="800" height="400" /></figure>'
    },
    {
      blockName: 'core/heading',
      attrs: { level: 2, content: 'Below the Fold Content' },
      innerHTML: '<h2>Below the Fold Content</h2>'
    },
    {
      blockName: 'core/paragraph',
      attrs: {},
      innerHTML: '<p>This content is likely below the fold and can be optimized differently.</p>'
    },
    {
      blockName: 'core/image',
      attrs: {
        url: 'https://example.com/content-image-2.jpg',
        alt: 'Content Image 2',
        width: 800,
        height: 400
      },
      innerHTML: '<figure class="wp-block-image"><img src="https://example.com/content-image-2.jpg" alt="Content Image 2" width="800" height="400" /></figure>'
    },
    {
      blockName: 'core/paragraph',
      attrs: {},
      innerHTML: '<p>We can apply various optimization strategies to improve load times.</p>'
    },
    {
      blockName: 'core/embed',
      attrs: {
        url: 'https://www.youtube.com/watch?v=example',
        type: 'video',
        providerNameSlug: 'youtube'
      },
      innerHTML: '<figure class="wp-block-embed is-type-video is-provider-youtube"><div class="wp-block-embed__wrapper"><iframe width="560" height="315" src="https://www.youtube.com/embed/example" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></figure>'
    },
    {
      blockName: 'core/html',
      attrs: {},
      innerHTML: '<div onclick="alert(\'Hello World!\')">This has an inline event handler</div><script>console.log("This is client-side JavaScript");</script><style>.duplicate { color: red; }</style><style>.duplicate { color: red; }</style>'
    }
  ]
};

// Example 1: Compare different optimization levels
function compareOptimizationLevels() {
  console.log('=== SSR Optimization Levels Comparison ===\n');
  
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
}

// Example 2: Demonstrate specific features
function demonstrateFeatures() {
  console.log('=== SSR Optimization Features ===\n');
  
  // 1. Lazy Loading Media
  const lazyLoadHtml = processBlocksForSSR(sampleContent, {
    ssrOptions: {
      enabled: true,
      level: 'balanced',
      lazyLoadMedia: true,
      preserveFirstImage: true
    }
  });
  console.log('Lazy Loading Media (with first image preserved):');
  console.log(lazyLoadHtml.match(/<img.*?>/g).map(img => {
    if (img.includes('loading="lazy"')) {
      return '- ' + img + ' (lazy loaded)';
    } else {
      return '- ' + img + ' (not lazy loaded - preserved for LCP)';
    }
  }).join('\n'));
  console.log('----------------------------\n');
  
  // 2. Preconnect to external domains
  const preconnectHtml = processBlocksForSSR(sampleContent, {
    ssrOptions: {
      enabled: true,
      preconnect: true
    }
  });
  const preconnectTags = (preconnectHtml.match(/<link rel="preconnect".*?>/g) || []);
  console.log('Preconnect to External Domains:');
  if (preconnectTags.length) {
    console.log(preconnectTags.join('\n'));
  } else {
    console.log('No preconnect tags were added (no external domains found)');
  }
  console.log('----------------------------\n');
  
  // 3. Remove Duplicate Styles
  const dedupeStylesHtml = processBlocksForSSR(sampleContent, {
    ssrOptions: {
      enabled: true,
      removeDuplicateStyles: true
    }
  });
  console.log('Duplicate Styles Removal:');
  console.log(`Original Style Count: ${(standardHtml.match(/<style/g) || []).length}`);
  console.log(`After Deduplication: ${(dedupeStylesHtml.match(/<style/g) || []).length}`);
  console.log('----------------------------\n');
  
  // 4. Optimization Depth
  const shallowHtml = processBlocksForSSR(sampleContent, {
    ssrOptions: {
      enabled: true,
      optimizationDepth: 'shallow'
    }
  });
  console.log('Optimization Depth - Shallow:');
  console.log(`Size: ${shallowHtml.length} bytes`);
  console.log('----------------------------\n');
  
  // 5. Critical Path Only
  const criticalPathHtml = processBlocksForSSR(sampleContent, {
    ssrOptions: {
      enabled: true,
      level: 'maximum',
      criticalPathOnly: true
    }
  });
  console.log('Critical Path Only:');
  console.log(`Size: ${criticalPathHtml.length} bytes (${Math.round((1 - criticalPathHtml.length / standardHtml.length) * 100)}% reduction)`);
  console.log('----------------------------\n');
  
  // 6. Minify Output
  const minifiedHtml = processBlocksForSSR(sampleContent, {
    ssrOptions: {
      enabled: true,
      minifyOutput: true
    }
  });
  console.log('Minified Output:');
  console.log(`Size: ${minifiedHtml.length} bytes (${Math.round((1 - minifiedHtml.length / standardHtml.length) * 100)}% reduction)`);
  console.log('----------------------------\n');
}

// Run examples
console.log('WP Block to HTML - SSR Optimization Examples\n');
console.log('Version 0.5.0\n');

// Check if specific example is requested via command line
const args = process.argv.slice(2);
if (args.includes('--levels')) {
  compareOptimizationLevels();
} else if (args.includes('--features')) {
  demonstrateFeatures();
} else {
  // Run all examples by default
  compareOptimizationLevels();
  demonstrateFeatures();
}

console.log('Examples completed. These examples demonstrate how to use the new SSR optimization features available in version 0.5.0.'); 