import { describe, it, expect, beforeEach } from 'vitest';
import { convertBlocks } from '../src/core/converter';
import { registerBlockHandler, getBlockHandler, hasBlockHandler, removeBlockHandler, getAllBlockHandlers } from '../src/core/registry';
import { Block } from '../src/types';

// Import from core module
import * as Core from '../src/index';

// Import block handlers from entry points
import * as Text from '../src/entries/blocks/text';
import * as Media from '../src/entries/blocks/media';
import * as Layout from '../src/entries/blocks/layout';
import * as Widget from '../src/entries/blocks/widget';
import * as Dynamic from '../src/entries/blocks/dynamic';
import * as Blocks from '../src/entries/blocks';

describe('Bundle Optimization', () => {
  describe('Modular Imports', () => {
    it('should export core functionality from Core module', () => {
      expect(Core.convertBlocks).toBeDefined();
      expect(Core.registerBlockHandler).toBeDefined();
      expect(Core.getBlockHandler).toBeDefined();
      expect(Core.hasBlockHandler).toBeDefined();
    });

    it('should export text block handlers from Text module', () => {
      expect(Text.paragraphBlockHandler).toBeDefined();
      expect(Text.headingBlockHandler).toBeDefined();
      expect(Text.listBlockHandler).toBeDefined();
      expect(Text.quoteBlockHandler).toBeDefined();
      expect(Text.registerTextBlockHandlers).toBeDefined();
    });

    it('should export media block handlers from Media module', () => {
      expect(Media.imageBlockHandler).toBeDefined();
      expect(Media.galleryBlockHandler).toBeDefined();
      expect(Media.videoBlockHandler).toBeDefined();
      expect(Media.audioBlockHandler).toBeDefined();
      expect(Media.fileBlockHandler).toBeDefined();
      expect(Media.embedBlockHandler).toBeDefined();
      expect(Media.enhancedEmbedBlockHandler).toBeDefined();
      expect(Media.registerMediaBlockHandlers).toBeDefined();
    });

    it('should export layout block handlers from Layout module', () => {
      expect(Layout.columnsBlockHandler).toBeDefined();
      expect(Layout.columnBlockHandler).toBeDefined();
      expect(Layout.groupBlockHandler).toBeDefined();
      expect(Layout.rowBlockHandler).toBeDefined();
      expect(Layout.registerLayoutBlockHandlers).toBeDefined();
    });

    it('should export widget block handlers from Widget module', () => {
      expect(Widget.shortcodeBlockHandler).toBeDefined();
      expect(Widget.buttonBlockHandler).toBeDefined();
      expect(Widget.customHtmlBlockHandler).toBeDefined();
      expect(Widget.tableBlockHandler).toBeDefined();
      expect(Widget.archivesBlockHandler).toBeDefined();
      expect(Widget.registerWidgetBlockHandlers).toBeDefined();
    });

    it('should export dynamic block handlers from Dynamic module', () => {
      expect(Dynamic.latestPostsBlockHandler).toBeDefined();
      expect(Dynamic.pageBreakBlockHandler).toBeDefined();
      expect(Dynamic.processPaginatedContent).toBeDefined();
      expect(Dynamic.registerDynamicBlockHandlers).toBeDefined();
    });

    it('should export registration function for all blocks', () => {
      expect(Blocks.registerAllBlockHandlers).toBeDefined();
      expect(Blocks.registerTextBlockHandlers).toBeDefined();
      expect(Blocks.registerMediaBlockHandlers).toBeDefined();
      expect(Blocks.registerLayoutBlockHandlers).toBeDefined();
      expect(Blocks.registerWidgetBlockHandlers).toBeDefined();
      expect(Blocks.registerDynamicBlockHandlers).toBeDefined();
    });
  });

  describe('Core Functionality with Minimal Imports', () => {
    beforeEach(() => {
      // Clear registered handlers before each test
      // Use direct registry functions instead of Core module
      const allHandlers = getAllBlockHandlers();
      Object.keys(allHandlers).forEach(key => {
        removeBlockHandler(key);
      });
    });

    it('should allow using only required block handlers', () => {
      // Register just paragraph and heading handlers
      registerBlockHandler('core/paragraph', Text.paragraphBlockHandler);
      registerBlockHandler('core/heading', Text.headingBlockHandler);

      // Create blocks data
      const blocks: Block[] = [
        {
          blockName: 'core/paragraph',
          attrs: {},
          innerBlocks: [],
          innerContent: ['<p>Test paragraph</p>']
        },
        {
          blockName: 'core/heading',
          attrs: { level: 2 },
          innerBlocks: [],
          innerContent: ['<h2>Test heading</h2>']
        },
        {
          blockName: 'core/image',
          attrs: { url: 'test.jpg' },
          innerBlocks: [],
          innerContent: ['<figure><img src="test.jpg" /></figure>']
        }
      ];

      // Should convert paragraph and heading, but default handle image
      const html = convertBlocks(blocks);
      expect(html).toContain('Test paragraph');
      expect(html).toContain('Test heading');
      expect(html).toContain('test.jpg');
      
      // Check that we have specific handlers for paragraph and heading
      expect(hasBlockHandler('core/paragraph')).toBe(true);
      expect(hasBlockHandler('core/heading')).toBe(true);
      expect(hasBlockHandler('core/image')).toBe(false);
    });

    it('should allow targeted registration of specific handlers', () => {
      // Register only media handlers
      Media.registerMediaBlockHandlers();

      // Create blocks data
      const blocks: Block[] = [
        {
          blockName: 'core/paragraph',
          attrs: {},
          innerBlocks: [],
          innerContent: ['<p>Test paragraph</p>']
        },
        {
          blockName: 'core/image',
          attrs: { url: 'test.jpg' },
          innerBlocks: [],
          innerContent: ['<figure><img src="test.jpg" /></figure>']
        }
      ];

      // Should use specific handler for image, default for paragraph
      const html = convertBlocks(blocks);
      expect(html).toContain('Test paragraph');
      expect(html).toContain('test.jpg');
      expect(html).toContain('wp-block-image');
      
      // Check that we have image handler but not paragraph
      expect(hasBlockHandler('core/paragraph')).toBe(false);
      expect(hasBlockHandler('core/image')).toBe(true);
      
      // Specific media handlers should be registered
      expect(getBlockHandler('core/image')).toBe(Media.imageBlockHandler);
      expect(getBlockHandler('core/gallery')).toBe(Media.galleryBlockHandler);
      expect(getBlockHandler('core/video')).toBe(Media.videoBlockHandler);
    });
  });
}); 