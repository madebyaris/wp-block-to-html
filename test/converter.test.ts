import { describe, it, expect } from 'vitest';
import { convertBlocks } from '../src/core/converter';
import { Block, ConversionOptions } from '../src/types';
import { registerBlockHandler } from '../src/core/registry';
import { paragraphBlockHandler } from '../src/block-handlers/paragraph';
import { headingBlockHandler } from '../src/block-handlers/heading';
import { listBlockHandler } from '../src/block-handlers/list';

// Register the block handlers for testing
registerBlockHandler('core/paragraph', paragraphBlockHandler);
registerBlockHandler('core/heading', headingBlockHandler);
registerBlockHandler('core/list', listBlockHandler);

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
    expect(html).not.toContain('wp-block-list');
  });
}); 