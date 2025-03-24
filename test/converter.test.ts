import { describe, it, expect } from 'vitest';
import { convertBlocks } from '../src/core/converter';
import { Block, ConversionOptions } from '../src/types';
import { registerBlockHandler } from '../src/core/registry';
import { paragraphBlockHandler } from '../src/block-handlers/paragraph';
import { headingBlockHandler } from '../src/block-handlers/heading';
import { listBlockHandler } from '../src/block-handlers/list';
import { imageBlockHandler } from '../src/block-handlers/image';
import { galleryBlockHandler } from '../src/block-handlers/gallery';

// Register the block handlers for testing
registerBlockHandler('core/paragraph', paragraphBlockHandler);
registerBlockHandler('core/heading', headingBlockHandler);
registerBlockHandler('core/list', listBlockHandler);
registerBlockHandler('core/image', imageBlockHandler);
registerBlockHandler('core/gallery', galleryBlockHandler);

describe('Block Converter', () => {
  it('should convert paragraph blocks to HTML', () => {
    const blocks: Block[] = [
      {
        blockName: 'core/paragraph',
        attrs: { align: 'center' },
        innerBlocks: [],
        innerContent: ['<p>Hello WordPress!</p>']
      }
    ];
    
    const html = convertBlocks(blocks);
    expect(html).toContain('Hello WordPress!');
    expect(html).toContain('class="');
    expect(html).toContain('wp-block-paragraph');
    expect(html).toContain('has-text-align-center');
  });
  
  it('should support Tailwind CSS classes', () => {
    const blocks: Block[] = [
      {
        blockName: 'core/paragraph',
        attrs: { align: 'center' },
        innerBlocks: [],
        innerContent: ['<p>Hello WordPress!</p>']
      }
    ];
    
    const html = convertBlocks(blocks, { cssFramework: 'tailwind' });
    expect(html).toContain('Hello WordPress!');
    expect(html).toContain('class="');
    expect(html).toContain('text-center');
    expect(html).not.toContain('wp-block-paragraph');
  });
  
  it('should support Bootstrap CSS classes', () => {
    const blocks: Block[] = [
      {
        blockName: 'core/paragraph',
        attrs: { align: 'center' },
        innerBlocks: [],
        innerContent: ['<p>Hello WordPress!</p>']
      }
    ];
    
    const html = convertBlocks(blocks, { cssFramework: 'bootstrap' });
    expect(html).toContain('Hello WordPress!');
    expect(html).toContain('class="');
    expect(html).toContain('text-center');
    expect(html).not.toContain('wp-block-paragraph');
  });
  
  it('should handle custom block transformers', () => {
    const blocks: Block[] = [
      {
        blockName: 'custom/special-block',
        attrs: {},
        innerBlocks: [],
        innerContent: ['Special content']
      }
    ];
    
    const customTransformer = {
      transform(block: Block) {
        return `<div class="special-block">${block.innerContent.join('')}</div>`;
      }
    };
    
    const options: ConversionOptions = {
      blockTransformers: {
        'custom/special-block': customTransformer
      }
    };
    
    const html = convertBlocks(blocks, options);
    
    expect(html).toContain('<div class="special-block">Special content</div>');
  });
  
  it('should handle blocks with no registered handler', () => {
    const blocks: Block[] = [
      {
        blockName: 'unknown/block',
        attrs: {},
        innerBlocks: [],
        innerContent: ['<div>Unknown block content</div>']
      }
    ];
    
    const html = convertBlocks(blocks);
    expect(html).toContain('<div>Unknown block content</div>');
  });
  
  it('should convert heading blocks to HTML', () => {
    const blocks: Block[] = [
      {
        blockName: 'core/heading',
        attrs: { level: 2, align: 'center' },
        innerBlocks: [],
        innerContent: ['<h2>Hello Heading!</h2>']
      }
    ];
    
    const html = convertBlocks(blocks);
    expect(html).toContain('Hello Heading!');
    expect(html).toContain('class="');
    expect(html).toContain('wp-block-heading');
    expect(html).toContain('has-text-align-center');
  });
  
  it('should support Tailwind CSS classes for headings', () => {
    const blocks: Block[] = [
      {
        blockName: 'core/heading',
        attrs: { level: 3, align: 'center' },
        innerBlocks: [],
        innerContent: ['<h3>Hello Heading!</h3>']
      }
    ];
    
    const html = convertBlocks(blocks, { cssFramework: 'tailwind' });
    expect(html).toContain('Hello Heading!');
    expect(html).toContain('class="');
    expect(html).toContain('text-center');
    expect(html).toContain('text-2xl');
    expect(html).not.toContain('wp-block-heading');
  });
  
  it('should support Bootstrap CSS classes for headings', () => {
    const blocks: Block[] = [
      {
        blockName: 'core/heading',
        attrs: { level: 4, align: 'center' },
        innerBlocks: [],
        innerContent: ['<h4>Hello Heading!</h4>']
      }
    ];
    
    const html = convertBlocks(blocks, { cssFramework: 'bootstrap' });
    expect(html).toContain('Hello Heading!');
    expect(html).toContain('class="');
    expect(html).toContain('text-center');
    expect(html).not.toContain('wp-block-heading');
  });
  
  it('should convert list blocks to HTML', () => {
    const blocks: Block[] = [
      {
        blockName: 'core/list',
        attrs: { ordered: false },
        innerBlocks: [],
        innerContent: ['<ul><li>Item 1</li><li>Item 2</li></ul>']
      }
    ];
    
    const html = convertBlocks(blocks);
    expect(html).toContain('Item 1');
    expect(html).toContain('Item 2');
    expect(html).toContain('<ul');
    expect(html).toContain('class="');
    expect(html).toContain('wp-block-list');
  });
  
  it('should convert ordered list blocks to HTML', () => {
    const blocks: Block[] = [
      {
        blockName: 'core/list',
        attrs: { ordered: true },
        innerBlocks: [],
        innerContent: ['<ol><li>Item 1</li><li>Item 2</li></ol>']
      }
    ];
    
    const html = convertBlocks(blocks);
    expect(html).toContain('Item 1');
    expect(html).toContain('Item 2');
    expect(html).toContain('<ol');
    expect(html).toContain('class="');
    expect(html).toContain('wp-block-list');
  });
  
  it('should support Tailwind CSS classes for lists', () => {
    const blocks: Block[] = [
      {
        blockName: 'core/list',
        attrs: { ordered: false },
        innerBlocks: [],
        innerContent: ['<ul><li>Item 1</li><li>Item 2</li></ul>']
      }
    ];
    
    const html = convertBlocks(blocks, { cssFramework: 'tailwind' });
    expect(html).toContain('Item 1');
    expect(html).toContain('Item 2');
    expect(html).toContain('<ul');
    expect(html).toContain('class="');
    expect(html).toContain('list-decimal');
    expect(html).toContain('pl-5');
    expect(html).not.toContain('wp-block-list');
  });
  
  it('should support Bootstrap CSS classes for lists', () => {
    const blocks: Block[] = [
      {
        blockName: 'core/list',
        attrs: { ordered: false },
        innerBlocks: [],
        innerContent: ['<ul><li>Item 1</li><li>Item 2</li></ul>']
      }
    ];
    
    const html = convertBlocks(blocks, { cssFramework: 'bootstrap' });
    expect(html).toContain('Item 1');
    expect(html).toContain('Item 2');
    expect(html).toContain('<ul');
    expect(html).toContain('class="');
    expect(html).toContain('list-group');
  });
  
  it('should handle nested lists correctly', () => {
    const blocks: Block[] = [
      {
        blockName: 'core/list',
        attrs: { ordered: false },
        innerBlocks: [],
        innerContent: ['<ul><li>Item 1<ul><li>Nested Item 1</li><li>Nested Item 2</li></ul></li><li>Item 2</li></ul>']
      }
    ];
    
    const html = convertBlocks(blocks, { cssFramework: 'tailwind' });
    expect(html).toContain('Item 1');
    expect(html).toContain('Nested Item 1');
    expect(html).toContain('Nested Item 2');
    expect(html).toContain('Item 2');
    expect(html).toContain('<ul class="');
    expect(html).toContain('<li>Item 1<ul');
    expect(html).not.toContain('<li>Item 1</li><ul');
  });
  
  it('should handle deeply nested lists', () => {
    const blocks: Block[] = [
      {
        blockName: 'core/list',
        attrs: { ordered: true },
        innerBlocks: [],
        innerContent: ['<ol><li>Level 1<ol><li>Level 2<ul><li>Level 3</li></ul></li></ol></li><li>Level 1 again</li></ol>']
      }
    ];
    
    const html = convertBlocks(blocks, { cssFramework: 'tailwind' });
    console.log("GENERATED HTML:", html);
    expect(html).toContain('Level 1');
    expect(html).toContain('Level 2');
    expect(html).toContain('Level 3');
    expect(html).toContain('Level 1 again');
    expect(html).toContain('<ol class="');
    expect(html).toContain('<ul class="');
    expect(html).toContain('<li>Level 1<ol');
    expect(html).toContain('<li>Level 2<ul');
  });
  
  it('should handle image blocks with captions', () => {
    const blocks: Block[] = [
      {
        blockName: 'core/image',
        attrs: { 
          url: 'https://example.com/image.jpg',
          alt: 'Example image',
          caption: 'This is a caption for the image',
          align: 'center',
          sizeSlug: 'large'
        },
        innerBlocks: [],
        innerContent: ['<figure class="wp-block-image size-large"><img src="https://example.com/image.jpg" alt="Example image" class="wp-image-123"/><figcaption>This is a caption for the image</figcaption></figure>']
      }
    ];
    
    // Test with Tailwind CSS
    const tailwindHtml = convertBlocks(blocks, { cssFramework: 'tailwind' });
    expect(tailwindHtml).toContain('https://example.com/image.jpg');
    expect(tailwindHtml).toContain('This is a caption for the image');
    expect(tailwindHtml).toContain('<figcaption class="');
    expect(tailwindHtml).toContain('text-center');
    
    // Test with Bootstrap
    const bootstrapHtml = convertBlocks(blocks, { cssFramework: 'bootstrap' });
    expect(bootstrapHtml).toContain('https://example.com/image.jpg');
    expect(bootstrapHtml).toContain('This is a caption for the image');
    expect(bootstrapHtml).toContain('<figcaption class="');
    expect(bootstrapHtml).toContain('figure-caption');
  });
  
  it('should handle gallery blocks with image captions', () => {
    const blocks: Block[] = [
      {
        blockName: 'core/gallery',
        attrs: {
          images: [
            {
              url: 'https://example.com/image1.jpg',
              caption: 'First image caption',
              alt: 'First image'
            },
            {
              url: 'https://example.com/image2.jpg',
              caption: 'Second image caption',
              alt: 'Second image'
            }
          ],
          columns: 2,
          caption: 'Gallery caption'
        },
        innerBlocks: [],
        innerContent: ['<figure class="wp-block-gallery columns-2 is-cropped"><ul class="blocks-gallery-grid"><li class="blocks-gallery-item"><figure><img src="https://example.com/image1.jpg" alt="First image" /><figcaption>First image caption</figcaption></figure></li><li class="blocks-gallery-item"><figure><img src="https://example.com/image2.jpg" alt="Second image" /><figcaption>Second image caption</figcaption></figure></li></ul><figcaption>Gallery caption</figcaption></figure>']
      }
    ];
    
    // Test with default styling
    const defaultHtml = convertBlocks(blocks);
    expect(defaultHtml).toContain('First image caption');
    expect(defaultHtml).toContain('Second image caption');
    expect(defaultHtml).toContain('Gallery caption');
    expect(defaultHtml).toContain('<figcaption');
    
    // Test with Tailwind CSS
    const tailwindHtml = convertBlocks(blocks, { cssFramework: 'tailwind' });
    expect(tailwindHtml).toContain('First image caption');
    expect(tailwindHtml).toContain('Second image caption');
    expect(tailwindHtml).toContain('Gallery caption');
    expect(tailwindHtml).toContain('text-center');
    expect(tailwindHtml).toContain('grid');
  });
}); 