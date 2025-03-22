import { describe, it, expect, vi } from 'vitest';
import { convertBlocks } from '../src/core/converter';
import { Block } from '../src/types';
import { registerAllBlockHandlers } from '../src/entries/blocks';

// Register all block handlers for browser compatibility testing
registerAllBlockHandlers();

/**
 * This file tests browser compatibility aspects of the package
 * While we can't run actual browser tests in a unit test environment,
 * we can simulate browser environments and test for common compatibility issues
 */
describe('Browser Compatibility', () => {
  describe('Node.js vs Browser Environment', () => {
    it('should not rely on Node.js specific features', () => {
      const blocks: Block[] = [
        {
          blockName: 'core/paragraph',
          attrs: { align: 'left' },
          innerBlocks: [],
          innerContent: ['<p>Simple paragraph content</p>']
        }
      ];
      
      // Simulate browser globals
      const originalGlobals = {
        process: global.process,
        require: global.require,
        module: global.module,
        __dirname: global.__dirname,
        __filename: global.__filename
      };
      
      // Mock Node.js globals as undefined in browser
      vi.stubGlobal('process', undefined);
      vi.stubGlobal('require', undefined);
      vi.stubGlobal('module', undefined);
      vi.stubGlobal('__dirname', undefined);
      vi.stubGlobal('__filename', undefined);
      
      try {
        // Should still work without Node.js globals
        const result = convertBlocks(blocks);
        expect(result).toContain('Simple paragraph content');
        expect(result).toContain('wp-block-paragraph');
      } finally {
        // Restore globals
        vi.stubGlobal('process', originalGlobals.process);
        vi.stubGlobal('require', originalGlobals.require);
        vi.stubGlobal('module', originalGlobals.module);
        vi.stubGlobal('__dirname', originalGlobals.__dirname);
        vi.stubGlobal('__filename', originalGlobals.__filename);
      }
    });
  });
  
  describe('Modern Browser Features', () => {
    it('should not break without modern browser APIs', () => {
      const blocks: Block[] = [
        {
          blockName: 'core/paragraph',
          attrs: { align: 'center' },
          innerBlocks: [],
          innerContent: ['<p>Test content</p>']
        }
      ];
      
      // Mock minimal browser environment (no fetch, Intl, etc.)
      const originalFetch = global.fetch;
      const originalIntl = global.Intl;
      
      vi.stubGlobal('fetch', undefined);
      vi.stubGlobal('Intl', undefined);
      
      try {
        // Should still work without modern browser APIs
        const result = convertBlocks(blocks);
        expect(result).toContain('Test content');
      } finally {
        // Restore globals
        vi.stubGlobal('fetch', originalFetch);
        vi.stubGlobal('Intl', originalIntl);
      }
    });
  });
  
  describe('DOM Interaction', () => {
    it('should not directly interact with DOM during conversion', () => {
      const blocks: Block[] = [
        {
          blockName: 'core/heading',
          attrs: { level: 1 },
          innerBlocks: [],
          innerContent: ['<h1>Important Heading</h1>']
        },
        {
          blockName: 'core/paragraph',
          attrs: {},
          innerBlocks: [],
          innerContent: ['<p>Important content</p>']
        }
      ];
      
      // Mock document as undefined
      const originalDocument = global.document;
      vi.stubGlobal('document', undefined);
      
      try {
        // Should still work without document
        const result = convertBlocks(blocks);
        expect(result).toContain('Important Heading');
        expect(result).toContain('Important content');
      } finally {
        // Restore document
        vi.stubGlobal('document', originalDocument);
      }
    });
  });
  
  describe('Legacy Browser Compatibility', () => {
    it('should not use unsupported ES6+ features without polyfills', () => {
      // Save original Array methods
      const originalArrayMethods = {
        find: Array.prototype.find,
        findIndex: Array.prototype.findIndex,
        includes: Array.prototype.includes,
        map: Array.prototype.map,
        filter: Array.prototype.filter,
        reduce: Array.prototype.reduce
      };
      
      // Mock ES6 methods as undefined to simulate older browsers
      Object.defineProperty(Array.prototype, 'find', { value: undefined });
      Object.defineProperty(Array.prototype, 'findIndex', { value: undefined });
      Object.defineProperty(Array.prototype, 'includes', { value: undefined });
      
      // Create standard fallbacks for essential methods that would break all JS
      if (!Array.prototype.map) {
        Array.prototype.map = function(callback) {
          const result = [];
          for (let i = 0; i < this.length; i++) {
            result.push(callback(this[i], i, this));
          }
          return result;
        };
      }
      
      if (!Array.prototype.filter) {
        Array.prototype.filter = function(callback) {
          const result = [];
          for (let i = 0; i < this.length; i++) {
            if (callback(this[i], i, this)) {
              result.push(this[i]);
            }
          }
          return result;
        };
      }
      
      if (!Array.prototype.reduce) {
        Array.prototype.reduce = function(callback, initialValue) {
          let accumulator = initialValue;
          for (let i = 0; i < this.length; i++) {
            accumulator = callback(accumulator, this[i], i, this);
          }
          return accumulator;
        };
      }
      
      try {
        // Define simple blocks
        const blocks: Block[] = [
          {
            blockName: 'core/paragraph',
            attrs: {},
            innerBlocks: [],
            innerContent: ['<p>Legacy browser test</p>']
          }
        ];
        
        // Should handle missing ES6 methods gracefully by providing fallbacks
        // or using alternative approaches
        let error = null;
        try {
          convertBlocks(blocks);
        } catch (e) {
          error = e;
        }
        
        // Note: This test might fail if the code relies heavily on modern JS features
        // without fallbacks. In that case, consider adding polyfills or documenting
        // browser requirements.
        expect(error).toBeNull();
      } finally {
        // Restore original Array methods
        Object.defineProperty(Array.prototype, 'find', { value: originalArrayMethods.find });
        Object.defineProperty(Array.prototype, 'findIndex', { value: originalArrayMethods.findIndex });
        Object.defineProperty(Array.prototype, 'includes', { value: originalArrayMethods.includes });
        Object.defineProperty(Array.prototype, 'map', { value: originalArrayMethods.map });
        Object.defineProperty(Array.prototype, 'filter', { value: originalArrayMethods.filter });
        Object.defineProperty(Array.prototype, 'reduce', { value: originalArrayMethods.reduce });
      }
    });
  });
  
  describe('Event Loop and Async Behavior', () => {
    it('should not depend on setTimeout or setInterval for core functionality', () => {
      const blocks: Block[] = [
        {
          blockName: 'core/paragraph',
          attrs: {},
          innerBlocks: [],
          innerContent: ['<p>Testing async behavior</p>']
        }
      ];
      
      // Mock timer functions
      const originalSetTimeout = global.setTimeout;
      const originalSetInterval = global.setInterval;
      const originalClearTimeout = global.clearTimeout;
      const originalClearInterval = global.clearInterval;
      
      vi.stubGlobal('setTimeout', undefined);
      vi.stubGlobal('setInterval', undefined);
      vi.stubGlobal('clearTimeout', undefined);
      vi.stubGlobal('clearInterval', undefined);
      
      try {
        // Core functionality should work synchronously without timers
        const result = convertBlocks(blocks);
        expect(result).toContain('Testing async behavior');
      } finally {
        // Restore timer functions
        vi.stubGlobal('setTimeout', originalSetTimeout);
        vi.stubGlobal('setInterval', originalSetInterval);
        vi.stubGlobal('clearTimeout', originalClearTimeout);
        vi.stubGlobal('clearInterval', originalClearInterval);
      }
    });
  });
}); 