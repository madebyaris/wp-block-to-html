import { Block } from '../src/types';
import { extractMetadata, SEOMetadata } from '../src/seo/metadata-extractor';
import { generateSEOHead } from '../src/seo';

describe('SEO Metadata Extraction', () => {
  it('should extract title from heading block', () => {
    const blocks: Block[] = [
      {
        blockName: 'core/heading',
        attrs: { level: 1 },
        innerBlocks: [],
        innerContent: ['<h1>Test Page Title</h1>']
      }
    ];
    
    const metadata = extractMetadata(blocks);
    expect(metadata.title).toBe('Test Page Title');
    expect(metadata.headings.length).toBe(1);
    expect(metadata.headings[0].level).toBe(1);
  });
  
  it('should extract description from paragraph block', () => {
    const blocks: Block[] = [
      {
        blockName: 'core/paragraph',
        attrs: {},
        innerBlocks: [],
        innerContent: ['<p>This is a longer paragraph that should be used as the meta description for the page because it provides a good summary of the content.</p>']
      }
    ];
    
    const metadata = extractMetadata(blocks);
    expect(metadata.description).toBeDefined();
    expect(metadata.description?.length).toBeGreaterThanOrEqual(50);
    expect(metadata.description?.length).toBeLessThanOrEqual(160);
  });
  
  it('should extract image metadata', () => {
    const blocks: Block[] = [
      {
        blockName: 'core/image',
        attrs: {
          url: 'https://example.com/image.jpg',
          alt: 'Example Alt Text',
          width: 800,
          height: 600
        },
        innerBlocks: [],
        innerContent: ['<img src="https://example.com/image.jpg" alt="Example Alt Text" width="800" height="600" />']
      }
    ];
    
    const metadata = extractMetadata(blocks);
    expect(metadata.images.length).toBe(1);
    expect(metadata.images[0].url).toBe('https://example.com/image.jpg');
    expect(metadata.images[0].alt).toBe('Example Alt Text');
    expect(metadata.images[0].width).toBe(800);
    expect(metadata.images[0].height).toBe(600);
  });
  
  it('should extract links', () => {
    const blocks: Block[] = [
      {
        blockName: 'core/paragraph',
        attrs: {},
        innerBlocks: [],
        innerContent: ['<p>This paragraph has a <a href="https://example.com">link to example.com</a> and another <a href="/internal-page">internal link</a>.</p>']
      }
    ];
    
    const metadata = extractMetadata(blocks);
    expect(metadata.links.length).toBe(2);
    expect(metadata.links[0].url).toBe('https://example.com');
    expect(metadata.links[0].text).toBe('link to example.com');
    expect(metadata.links[0].isExternal).toBe(true);
    expect(metadata.links[1].isExternal).toBe(false);
  });
  
  it('should count words in content', () => {
    const blocks: Block[] = [
      {
        blockName: 'core/paragraph',
        attrs: {},
        innerBlocks: [],
        innerContent: ['<p>This paragraph has ten words in it for testing purposes.</p>']
      },
      {
        blockName: 'core/heading',
        attrs: { level: 2 },
        innerBlocks: [],
        innerContent: ['<h2>This heading has five words</h2>']
      }
    ];
    
    const metadata = extractMetadata(blocks);
    expect(metadata.wordCount).toBe(15);
  });
  
  it('should analyze SEO quality', () => {
    const blocks: Block[] = [
      {
        blockName: 'core/heading',
        attrs: { level: 1 },
        innerBlocks: [],
        innerContent: ['<h1>Test Page Title</h1>']
      },
      {
        blockName: 'core/paragraph',
        attrs: {},
        innerBlocks: [],
        innerContent: ['<p>This is a longer paragraph that should be used as the meta description for the page because it provides a good summary of the content.</p>']
      },
      {
        blockName: 'core/image',
        attrs: {
          url: 'https://example.com/image.jpg',
          alt: 'Example Alt Text'
        },
        innerBlocks: [],
        innerContent: ['<img src="https://example.com/image.jpg" alt="Example Alt Text" />']
      }
    ];
    
    const metadata = extractMetadata(blocks);
    expect(metadata.analysis).toBeDefined();
    expect(metadata.analysis?.score).toBeGreaterThanOrEqual(0);
    expect(metadata.analysis?.score).toBeLessThanOrEqual(100);
  });
  
  it('should detect missing alt text', () => {
    const blocks: Block[] = [
      {
        blockName: 'core/image',
        attrs: {
          url: 'https://example.com/image.jpg'
          // No alt text provided
        },
        innerBlocks: [],
        innerContent: ['<img src="https://example.com/image.jpg" />']
      }
    ];
    
    const metadata = extractMetadata(blocks);
    expect(metadata.images[0].alt).toBe('');
    expect(metadata.analysis?.suggestions.some(suggestion => suggestion.toLowerCase().includes('alt'))).toBe(true);
  });
  
  it('should extract schema if present', () => {
    const blocks: Block[] = [
      {
        blockName: 'core/html',
        attrs: {},
        innerBlocks: [],
        innerContent: ['<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article"}</script>']
      }
    ];
    
    const metadata = extractMetadata(blocks);
    expect(metadata.hasSchema).toBe(true);
    expect(metadata.schema).toEqual({ '@context': 'https://schema.org', '@type': 'Article' });
  });
  
  it('should set shouldIndex property based on SEO score', () => {
    // High-quality content
    const goodBlocks: Block[] = [
      {
        blockName: 'core/heading',
        attrs: { level: 1 },
        innerBlocks: [],
        innerContent: ['<h1>Well-Structured Page Title</h1>']
      },
      {
        blockName: 'core/paragraph',
        attrs: {},
        innerBlocks: [],
        innerContent: ['<p>This is a longer paragraph that should be used as the meta description for the page because it provides a good summary of the content.</p>']
      },
      {
        blockName: 'core/image',
        attrs: {
          url: 'https://example.com/image.jpg',
          alt: 'Descriptive Alt Text'
        },
        innerBlocks: [],
        innerContent: ['<img src="https://example.com/image.jpg" alt="Descriptive Alt Text" />']
      }
    ];
    
    // Low-quality content
    const poorBlocks: Block[] = [
      {
        blockName: 'core/paragraph',
        attrs: {},
        innerBlocks: [],
        innerContent: ['<p>Very short.</p>']
      }
    ];
    
    const goodMetadata = extractMetadata(goodBlocks);
    const poorMetadata = extractMetadata(poorBlocks);
    
    expect(goodMetadata.analysis?.shouldIndex).toBe(true);
    expect(poorMetadata.analysis?.shouldIndex).toBe(false);
  });
});

describe('SEO Head Generator', () => {
  it('should generate basic meta tags', () => {
    const metadata: SEOMetadata = {
      title: 'Test Page',
      description: 'This is a test page description',
      keywords: ['test', 'page', 'seo'],
      images: [{ url: 'https://example.com/image.jpg', alt: 'Test Image' }],
      headings: [{ text: 'Test Page', level: 1 }],
      links: [],
      analysis: {
        score: 75,
        shouldIndex: true
      }
    };
    
    const head = generateSEOHead(metadata, { siteName: 'Test Site' });
    expect(head).toContain('<title>Test Page</title>');
    expect(head).toContain('<meta name="description" content="This is a test page description" />');
    expect(head).toContain('<meta name="keywords" content="test, page, seo" />');
    expect(head).toContain('<meta property="og:title" content="Test Page" />');
    expect(head).toContain('<meta property="og:site_name" content="Test Site" />');
    expect(head).toContain('<meta name="robots" content="index, follow" />');
  });
  
  it('should generate low-quality page with noindex', () => {
    const metadata: SEOMetadata = {
      title: 'Test',  // Very short title
      images: [],     // No images
      headings: [{ text: 'Test', level: 1 }],
      links: [],
      analysis: {
        score: 25,    // Low score
        shouldIndex: false
      }
    };
    
    const head = generateSEOHead(metadata);
    expect(head).toContain('<meta name="robots" content="noindex, nofollow" />');
  });
}); 