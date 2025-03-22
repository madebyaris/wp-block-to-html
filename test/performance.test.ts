import { describe, it, expect } from 'vitest';
import { convertBlocks } from '../src/core/converter';
import { registerAllBlockHandlers } from '../src/entries/blocks';
import { Block } from '../src/types';

// Register all handlers for performance testing
registerAllBlockHandlers();

/**
 * Helper function to create a large number of blocks for testing
 */
function createBlocks(count: number): Block[] {
  const blocks: Block[] = [];
  
  for (let i = 0; i < count; i++) {
    if (i % 4 === 0) {
      blocks.push({
        blockName: 'core/paragraph',
        attrs: {},
        innerBlocks: [],
        innerContent: [`<p>Paragraph ${i}</p>`]
      });
    } else if (i % 4 === 1) {
      blocks.push({
        blockName: 'core/heading',
        attrs: { level: 2 },
        innerBlocks: [],
        innerContent: [`<h2>Heading ${i}</h2>`]
      });
    } else if (i % 4 === 2) {
      blocks.push({
        blockName: 'core/image',
        attrs: { url: `image${i}.jpg`, alt: `Image ${i}` },
        innerBlocks: [],
        innerContent: [`<img src="image${i}.jpg" alt="Image ${i}" />`]
      });
    } else {
      blocks.push({
        blockName: 'core/list',
        attrs: {},
        innerBlocks: [],
        innerContent: [`<ul><li>List item ${i}.1</li><li>List item ${i}.2</li></ul>`]
      });
    }
  }
  
  return blocks;
}

/**
 * Performance benchmarks for block conversion
 */
describe('Performance Benchmarks', () => {
  describe('Block Count Scaling', () => {
    it('should process 10 blocks in under 10ms', () => {
      const blocks = createBlocks(10);
      
      const start = performance.now();
      const html = convertBlocks(blocks);
      const end = performance.now();
      const duration = end - start;
      
      expect(html).toContain('Paragraph 0');
      expect(duration).toBeLessThan(10);
    });
    
    it('should process 100 blocks in under 50ms', () => {
      const blocks = createBlocks(100);
      
      const start = performance.now();
      const html = convertBlocks(blocks);
      const end = performance.now();
      const duration = end - start;
      
      expect(html).toContain('Paragraph 0');
      expect(html).toContain('Heading 1');
      expect(duration).toBeLessThan(50);
    });
    
    it('should process 1000 blocks in under 500ms', () => {
      const blocks = createBlocks(1000);
      
      const start = performance.now();
      const html = convertBlocks(blocks);
      const end = performance.now();
      const duration = end - start;
      
      expect(html).toContain('Paragraph 0');
      expect(html).toContain('Heading 1');
      expect(duration).toBeLessThan(500);
      
      console.log(`Processed 1000 blocks in ${duration.toFixed(2)}ms`);
    });
  });
  
  describe('CSS Framework Performance Comparison', () => {
    it('should compare performance across CSS frameworks for 100 blocks', () => {
      const blocks = createBlocks(100);
      
      // No framework
      const startNoFramework = performance.now();
      convertBlocks(blocks);
      const endNoFramework = performance.now();
      const durationNoFramework = endNoFramework - startNoFramework;
      
      // Tailwind
      const startTailwind = performance.now();
      convertBlocks(blocks, { cssFramework: 'tailwind' });
      const endTailwind = performance.now();
      const durationTailwind = endTailwind - startTailwind;
      
      // Bootstrap
      const startBootstrap = performance.now();
      convertBlocks(blocks, { cssFramework: 'bootstrap' });
      const endBootstrap = performance.now();
      const durationBootstrap = endBootstrap - startBootstrap;
      
      // Log durations for comparison
      console.log(`CSS Framework comparison for 100 blocks:
        - No framework: ${durationNoFramework.toFixed(2)}ms
        - Tailwind: ${durationTailwind.toFixed(2)}ms
        - Bootstrap: ${durationBootstrap.toFixed(2)}ms
      `);
      
      // All should be reasonably fast
      expect(durationNoFramework).toBeLessThan(100);
      expect(durationTailwind).toBeLessThan(100);
      expect(durationBootstrap).toBeLessThan(100);
    });
  });
  
  describe('Content Handling Mode Performance', () => {
    it('should compare performance across content handling modes for 100 blocks', () => {
      const blocks = createBlocks(100);
      
      // Raw mode
      const startRaw = performance.now();
      convertBlocks(blocks, { contentHandling: 'raw' });
      const endRaw = performance.now();
      const durationRaw = endRaw - startRaw;
      
      // Rendered mode
      const startRendered = performance.now();
      convertBlocks(blocks, { contentHandling: 'rendered' });
      const endRendered = performance.now();
      const durationRendered = endRendered - startRendered;
      
      // Hybrid mode
      const startHybrid = performance.now();
      convertBlocks(blocks, { contentHandling: 'hybrid' });
      const endHybrid = performance.now();
      const durationHybrid = endHybrid - startHybrid;
      
      // Log durations for comparison
      console.log(`Content handling mode comparison for 100 blocks:
        - Raw: ${durationRaw.toFixed(2)}ms
        - Rendered: ${durationRendered.toFixed(2)}ms
        - Hybrid: ${durationHybrid.toFixed(2)}ms
      `);
      
      // All should be reasonably fast
      expect(durationRaw).toBeLessThan(100);
      expect(durationRendered).toBeLessThan(100);
      expect(durationHybrid).toBeLessThan(100);
    });
  });
  
  describe('Complex Nested Blocks Performance', () => {
    it('should efficiently process deeply nested blocks', () => {
      // Create a deeply nested structure
      const createNestedGroup = (depth: number, prefix: string): Block => {
        if (depth <= 0) {
          return {
            blockName: 'core/paragraph',
            attrs: {},
            innerBlocks: [],
            innerContent: [`<p>${prefix} content</p>`]
          };
        }
        
        return {
          blockName: 'core/group',
          attrs: {},
          innerBlocks: [
            createNestedGroup(depth - 1, `${prefix}-1`),
            createNestedGroup(depth - 1, `${prefix}-2`)
          ],
          innerContent: ['', '']
        };
      };
      
      // Create a block with 4 levels of nesting (creates 2^4 = 16 paragraphs)
      const nestedBlock = createNestedGroup(4, 'Nested');
      
      const start = performance.now();
      const html = convertBlocks([nestedBlock]);
      const end = performance.now();
      const duration = end - start;
      
      // Should contain all nested paragraphs
      expect(html).toContain('Nested-1-1-1-1 content');
      expect(html).toContain('Nested-2-2-2-2 content');
      
      // Should process efficiently (under 50ms)
      expect(duration).toBeLessThan(50);
      console.log(`Processed deeply nested blocks in ${duration.toFixed(2)}ms`);
    });
  });
}); 