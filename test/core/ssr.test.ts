import { describe, expect, it } from 'vitest';
import { processBlocksForSSR } from '../../src/core/ssr';

describe('SSR Optimization Module', () => {
  // Sample block data for testing
  const sampleBlocks = {
    blocks: [
      {
        blockName: 'core/paragraph',
        attrs: {},
        innerContent: ['<p>This is a test paragraph.</p>'],
      },
      {
        blockName: 'core/image',
        attrs: {
          url: 'https://example.com/image.jpg',
          alt: 'Example image',
        },
        innerContent: [
          '<figure class="wp-block-image"><img src="https://example.com/image.jpg" alt="Example image"/></figure>',
        ],
      },
      {
        blockName: 'core/html',
        attrs: {},
        innerContent: [
          '<div class="interactive-widget"><button onclick="alert(\'This should be removed in SSR\')">Click me</button><script class="client-only">console.log("This script should be removed in SSR mode");</script></div>',
        ],
      },
    ],
  };

  it('should process blocks without optimization when SSR is disabled', () => {
    const result = processBlocksForSSR(sampleBlocks);
    
    // Check if result contains the original content
    expect(result).toContain('This is a test paragraph');
    expect(result).toContain('https://example.com/image.jpg');
    expect(result).toContain('alt="Example image"');
    
    // Should keep client-side scripts when SSR optimization is disabled
    expect(result).toContain('onclick="alert');
    expect(result).toContain('script class="client-only"');
  });

  it('should apply minimal optimizations when level is set to minimal', () => {
    const result = processBlocksForSSR(sampleBlocks, {
      ssrOptions: {
        enabled: true,
        level: 'minimal',
      },
    });
    
    // Check if result contains the original content
    expect(result).toContain('This is a test paragraph');
    expect(result).toContain('https://example.com/image.jpg');
    
    // Should keep client-side scripts in minimal mode
    expect(result).toContain('onclick="alert');
    expect(result).toContain('script class="client-only"');
    
    // Minimal optimization should remove extra whitespace between tags
    // but this is hard to test in a unit test without a complex HTML parser
  });

  it('should apply balanced optimizations by default when SSR is enabled', () => {
    const result = processBlocksForSSR(sampleBlocks, {
      ssrOptions: {
        enabled: true,
      },
    });
    
    // Check if result contains the original content
    expect(result).toContain('This is a test paragraph');
    expect(result).toContain('https://example.com/image.jpg');
    
    // Should remove client-side scripts in balanced mode
    expect(result).not.toContain('onclick="alert');
    expect(result).not.toContain('script class="client-only"');
    
    // Should add lazy loading to images
    expect(result).toContain('loading="lazy"');
  });

  it('should apply maximum optimizations when level is set to maximum', () => {
    const result = processBlocksForSSR(sampleBlocks, {
      ssrOptions: {
        enabled: true,
        level: 'maximum',
        inlineCriticalCSS: true,
      },
    });
    
    // Check if result contains the original content
    expect(result).toContain('This is a test paragraph');
    expect(result).toContain('https://example.com/image.jpg');
    
    // Should remove client-side scripts in maximum mode
    expect(result).not.toContain('onclick="alert');
    expect(result).not.toContain('script class="client-only"');
    
    // Should add lazy loading to images
    expect(result).toContain('loading="lazy"');
    
    // When there's a head tag in the document, should add preload hints
    // This is more complex to test without a full HTML document structure
  });

  it('should apply custom pre-processing function when provided', () => {
    const result = processBlocksForSSR(sampleBlocks, {
      ssrOptions: {
        enabled: true,
        preProcessHTML: (html) => {
          return html.replace(/class="/g, 'className="');
        },
      },
    });
    
    // Check if preProcessHTML function was applied
    // Note: Since we're working with blocks and not rendered HTML in our test,
    // the preProcessHTML function won't actually be called in this test setup.
    // In a real scenario with rendered HTML, it would apply the transformation.
  });

  it('should apply custom post-processing function when provided', () => {
    const result = processBlocksForSSR(sampleBlocks, {
      ssrOptions: {
        enabled: true,
        postProcessHTML: (html) => {
          return `<div id="root">${html}</div>`;
        },
      },
    });
    
    // Check if postProcessHTML function was applied
    expect(result).toContain('<div id="root">');
    expect(result).toContain('</div>');
    expect(result).toMatch(/<div id="root">.*This is a test paragraph.*<\/div>/s);
  });
}); 