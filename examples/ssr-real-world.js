/**
 * Real-world example demonstrating SSR optimizations with a typical WordPress blog post
 * 
 * This example shows how the SSR optimizations module can be applied to a real
 * WordPress post with common block types to improve performance.
 */

const { processBlocksForSSR } = require('../dist');
const fs = require('fs');

// Create a sample WordPress post with typical blocks
const wordpressPost = {
  blocks: [
    // Header
    {
      blockName: 'core/heading',
      attrs: { level: 1 },
      innerContent: [`<h1 class="wp-block-heading">10 Tips for Improving Website Performance</h1>`]
    },
    
    // Feature image
    {
      blockName: 'core/image',
      attrs: {
        url: 'https://example.com/images/website-performance.jpg',
        alt: 'Website performance optimization illustration',
        id: 123
      },
      innerContent: [
        `<figure class="wp-block-image size-large is-style-default">
          <img src="https://example.com/images/website-performance.jpg" 
               alt="Website performance optimization illustration" 
               class="wp-image-123"/>
          <figcaption class="wp-element-caption">Optimizing your website for better performance</figcaption>
        </figure>`
      ]
    },
    
    // Introduction paragraph
    {
      blockName: 'core/paragraph',
      attrs: {},
      innerContent: [
        `<p class="wp-block-paragraph">In today's digital landscape, website performance is crucial for user experience and SEO. 
        A slow-loading website can lead to increased bounce rates and decreased conversions. 
        Let's explore some effective strategies to boost your website's performance and provide a better user experience.</p>`
      ]
    },
    
    // Section heading
    {
      blockName: 'core/heading',
      attrs: { level: 2 },
      innerContent: [`<h2 class="wp-block-heading">1. Optimize Your Images</h2>`]
    },
    
    // Content paragraph
    {
      blockName: 'core/paragraph',
      attrs: {},
      innerContent: [
        `<p class="wp-block-paragraph">Images often account for the majority of a webpage's size. 
        Implement proper image optimization by:</p>`
      ]
    },
    
    // List of image optimization techniques
    {
      blockName: 'core/list',
      attrs: {},
      innerContent: [
        `<ul class="wp-block-list">
          <li>Compressing images without sacrificing quality</li>
          <li>Using modern formats like WebP</li>
          <li>Implementing lazy loading techniques</li>
          <li>Serving appropriately sized images for different devices</li>
        </ul>`
      ]
    },
    
    // Another image example
    {
      blockName: 'core/image',
      attrs: {
        url: 'https://example.com/images/image-optimization.jpg',
        alt: 'Image optimization comparison',
        id: 124
      },
      innerContent: [
        `<figure class="wp-block-image size-medium is-style-default">
          <img src="https://example.com/images/image-optimization.jpg" 
               alt="Image optimization comparison" 
               class="wp-image-124"/>
          <figcaption class="wp-element-caption">Before and after image optimization</figcaption>
        </figure>`
      ]
    },
    
    // Section heading
    {
      blockName: 'core/heading',
      attrs: { level: 2 },
      innerContent: [`<h2 class="wp-block-heading">2. Minimize HTTP Requests</h2>`]
    },
    
    // Content paragraph
    {
      blockName: 'core/paragraph',
      attrs: {},
      innerContent: [
        `<p class="wp-block-paragraph">Each element on your webpage requires an HTTP request. 
        Reducing these requests can significantly improve loading times:</p>`
      ]
    },
    
    // Code block
    {
      blockName: 'core/html',
      attrs: {},
      innerContent: [
        `<div class="wp-block-html">
          <pre><code>
// Combine multiple CSS files
@import 'normalize.css';
@import 'typography.css';
@import 'layout.css';
          </code></pre>
          <script>
            // This is a client-side script that should be removed in SSR
            console.log('This script should be removed by SSR optimization');
            document.addEventListener('DOMContentLoaded', function() {
              console.log('Page loaded');
            });
          </script>
        </div>`
      ]
    },
    
    // Interactive element with event handlers
    {
      blockName: 'core/html',
      attrs: {},
      innerContent: [
        `<div class="wp-block-html interactive-demo">
          <button onclick="alert('This onclick should be removed in SSR')">Click me</button>
          <div onmouseover="console.log('Hover event')" class="hover-element">Hover over me</div>
        </div>`
      ]
    },
    
    // Section heading
    {
      blockName: 'core/heading',
      attrs: { level: 2 },
      innerContent: [`<h2 class="wp-block-heading">3. Leverage Browser Caching</h2>`]
    },
    
    // Content paragraph
    {
      blockName: 'core/paragraph',
      attrs: {},
      innerContent: [
        `<p class="wp-block-paragraph">Browser caching stores webpage resources locally in the user's browser, 
        reducing the need to reload all resources on subsequent visits.</p>`
      ]
    },
    
    // Quote block
    {
      blockName: 'core/quote',
      attrs: {},
      innerContent: [
        `<blockquote class="wp-block-quote">
          <p>Efficient browser caching can reduce page load times by up to 80% for returning visitors.</p>
          <cite>Web Performance Study, 2023</cite>
        </blockquote>`
      ]
    },
    
    // Video embed
    {
      blockName: 'core/embed',
      attrs: {
        url: 'https://www.youtube.com/watch?v=example',
        type: 'video',
        providerNameSlug: 'youtube'
      },
      innerContent: [
        `<figure class="wp-block-embed is-type-video is-provider-youtube">
          <div class="wp-block-embed__wrapper">
            <iframe width="560" height="315" 
                   src="https://www.youtube.com/embed/example" 
                   frameborder="0" 
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                   allowfullscreen></iframe>
          </div>
          <figcaption class="wp-element-caption">Performance optimization tutorial</figcaption>
        </figure>`
      ]
    },
    
    // Conclusion heading
    {
      blockName: 'core/heading',
      attrs: { level: 2 },
      innerContent: [`<h2 class="wp-block-heading">Conclusion</h2>`]
    },
    
    // Conclusion paragraph
    {
      blockName: 'core/paragraph',
      attrs: {},
      innerContent: [
        `<p class="wp-block-paragraph">Implementing these performance optimization techniques can dramatically 
        improve your website's loading speed, user experience, and search engine rankings. 
        Start with the highest-impact optimizations and monitor your progress using tools like 
        Google PageSpeed Insights and WebPageTest.</p>`
      ]
    },
    
    // Comments section with client scripts
    {
      blockName: 'core/html',
      attrs: {},
      innerContent: [
        `<div class="wp-block-html comments-section">
          <!-- WordPress comment system -->
          <div id="comments">
            <h3>Comments</h3>
            <script>
              // Comment system initialization
              (function() {
                const commentForm = document.getElementById('commentForm');
                if (commentForm) {
                  commentForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    // Submit comment via AJAX
                    console.log('Comment submitted');
                  });
                }
              })();
            </script>
            <form id="commentForm">
              <textarea placeholder="Leave a comment"></textarea>
              <button type="submit" onclick="return validateComment()">Submit</button>
            </form>
          </div>
        </div>`
      ]
    }
  ]
};

// Process the post with different SSR optimization levels
console.log('===== WordPress Post SSR Optimization Comparison =====\n');

// No optimization
const standardHtml = processBlocksForSSR(wordpressPost);
console.log(`Standard HTML size: ${standardHtml.length} bytes`);

// Minimal optimization
const minimalHtml = processBlocksForSSR(wordpressPost, {
  ssrOptions: {
    enabled: true,
    level: 'minimal'
  }
});
console.log(`Minimal optimization: ${minimalHtml.length} bytes (${Math.round((1 - minimalHtml.length / standardHtml.length) * 100)}% reduction)`);

// Balanced optimization (default)
const balancedHtml = processBlocksForSSR(wordpressPost, {
  ssrOptions: {
    enabled: true,
    level: 'balanced'
  }
});
console.log(`Balanced optimization: ${balancedHtml.length} bytes (${Math.round((1 - balancedHtml.length / standardHtml.length) * 100)}% reduction)`);

// Maximum optimization
const maximumHtml = processBlocksForSSR(wordpressPost, {
  ssrOptions: {
    enabled: true,
    level: 'maximum',
    inlineCriticalCSS: true
  }
});
console.log(`Maximum optimization: ${maximumHtml.length} bytes (${Math.round((1 - maximumHtml.length / standardHtml.length) * 100)}% reduction)`);

// Save the different versions to files for comparison
if (!fs.existsSync('./examples/output')) {
  fs.mkdirSync('./examples/output');
}

fs.writeFileSync('./examples/output/standard.html', standardHtml);
fs.writeFileSync('./examples/output/minimal.html', minimalHtml);
fs.writeFileSync('./examples/output/balanced.html', balancedHtml);
fs.writeFileSync('./examples/output/maximum.html', maximumHtml);

console.log('\nHTML files saved to examples/output directory for comparison');

// Detailed analysis
console.log('\n===== Optimization Details =====');

// Count scripts
const countScripts = html => (html.match(/<script/g) || []).length;
console.log(`\nNumber of <script> tags:`);
console.log(`- Standard: ${countScripts(standardHtml)}`);
console.log(`- Minimal: ${countScripts(minimalHtml)}`);
console.log(`- Balanced: ${countScripts(balancedHtml)}`);
console.log(`- Maximum: ${countScripts(maximumHtml)}`);

// Count event handlers
const countEventHandlers = html => (html.match(/\son\w+=/g) || []).length;
console.log(`\nNumber of inline event handlers (onclick, etc.):`);
console.log(`- Standard: ${countEventHandlers(standardHtml)}`);
console.log(`- Minimal: ${countEventHandlers(minimalHtml)}`);
console.log(`- Balanced: ${countEventHandlers(balancedHtml)}`);
console.log(`- Maximum: ${countEventHandlers(maximumHtml)}`);

// Count lazy-loaded images
const countLazyImages = html => (html.match(/loading="lazy"/g) || []).length;
console.log(`\nNumber of lazy-loaded images:`);
console.log(`- Standard: ${countLazyImages(standardHtml)}`);
console.log(`- Minimal: ${countLazyImages(minimalHtml)}`);
console.log(`- Balanced: ${countLazyImages(balancedHtml)}`);
console.log(`- Maximum: ${countLazyImages(maximumHtml)}`);

// Check for critical CSS
const hasCriticalCSS = html => html.includes('<style id="critical-css">');
console.log(`\nCritical CSS inlined:`);
console.log(`- Standard: ${hasCriticalCSS(standardHtml)}`);
console.log(`- Minimal: ${hasCriticalCSS(minimalHtml)}`);
console.log(`- Balanced: ${hasCriticalCSS(balancedHtml)}`);
console.log(`- Maximum: ${hasCriticalCSS(maximumHtml)}`);

console.log('\nRun this example to see detailed SSR optimizations in action.'); 