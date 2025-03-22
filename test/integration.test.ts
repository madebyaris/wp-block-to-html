import { describe, it, expect } from 'vitest';
import { convertBlocks } from '../src/core/converter';
import { Block } from '../src/types';
import { registerAllBlockHandlers } from '../src/entries/blocks';

// Register all block handlers for integration testing
registerAllBlockHandlers();

describe('Integration Tests with Complex Block Combinations', () => {
  describe('Nested Layout Blocks', () => {
    it('should handle nested group and column blocks with content', () => {
      const blocks: Block[] = [
        {
          blockName: 'core/group',
          attrs: { align: 'wide' },
          innerBlocks: [
            {
              blockName: 'core/heading',
              attrs: { level: 2, align: 'center' },
              innerBlocks: [],
              innerContent: ['<h2>Group Title</h2>']
            },
            {
              blockName: 'core/columns',
              attrs: { columns: 2 },
              innerBlocks: [
                {
                  blockName: 'core/column',
                  attrs: { width: 50 },
                  innerBlocks: [
                    {
                      blockName: 'core/paragraph',
                      attrs: {},
                      innerBlocks: [],
                      innerContent: ['<p>Column 1 content</p>']
                    }
                  ],
                  innerContent: ['', '']
                },
                {
                  blockName: 'core/column',
                  attrs: { width: 50 },
                  innerBlocks: [
                    {
                      blockName: 'core/image',
                      attrs: { url: 'image.jpg', alt: 'Test image' },
                      innerBlocks: [],
                      innerContent: ['<img src="image.jpg" alt="Test image" />']
                    }
                  ],
                  innerContent: ['', '']
                }
              ],
              innerContent: ['', '', '']
            }
          ],
          innerContent: ['', '', '']
        }
      ];

      const html = convertBlocks(blocks);
      
      // Should contain all the nested block content
      expect(html).toContain('Group Title');
      expect(html).toContain('Column 1 content');
      expect(html).toContain('image.jpg');
      
      // Should have appropriate structure
      expect(html).toContain('wp-block-group');
      expect(html).toContain('wp-block-heading');
      expect(html).toContain('wp-block-columns');
      expect(html).toContain('wp-block-column');
      expect(html).toContain('wp-block-paragraph');
      expect(html).toContain('wp-block-image');
    });
  });

  describe('Media with Widget Blocks', () => {
    it('should process a cover block with button and text', () => {
      const blocks: Block[] = [
        {
          blockName: 'core/cover',
          attrs: { 
            url: 'background.jpg',
            dimRatio: 50,
            minHeight: 300
          },
          innerBlocks: [
            {
              blockName: 'core/heading',
              attrs: { level: 2, textColor: 'white' },
              innerBlocks: [],
              innerContent: ['<h2>Cover Title</h2>']
            },
            {
              blockName: 'core/paragraph',
              attrs: { textColor: 'white' },
              innerBlocks: [],
              innerContent: ['<p>Cover description text</p>']
            },
            {
              blockName: 'core/button',
              attrs: { 
                text: 'Learn More',
                url: '#',
                backgroundColor: 'primary',
                textColor: 'white'
              },
              innerBlocks: [],
              innerContent: ['<div class="wp-block-button"><a class="wp-block-button__link">Learn More</a></div>']
            }
          ],
          innerContent: ['', '', '', '']
        }
      ];

      const html = convertBlocks(blocks);
      
      // Check for content and structure
      expect(html).toContain('background.jpg');
      expect(html).toContain('Cover Title');
      expect(html).toContain('Cover description text');
      expect(html).toContain('Learn More');
      
      // Check for structure and attributes
      expect(html).toContain('wp-block-cover');
      expect(html).toContain('has-background-dim');
      expect(html).toContain('style=');
    });
  });

  describe('Text with Dynamic Blocks', () => {
    it('should process latest posts block with heading and separator', () => {
      const blocks: Block[] = [
        {
          blockName: 'core/heading',
          attrs: { level: 2 },
          innerBlocks: [],
          innerContent: ['<h2>Latest Articles</h2>']
        },
        {
          blockName: 'core/separator',
          attrs: { style: 'wide' },
          innerBlocks: [],
          innerContent: ['<hr class="wp-block-separator has-alpha-channel-opacity"/>']
        },
        {
          blockName: 'core/latest-posts',
          attrs: { 
            postsToShow: 3,
            displayPostDate: true,
            displayFeaturedImage: true
          },
          innerBlocks: [],
          innerContent: [
            '<div class="wp-block-latest-posts wp-block-latest-posts__list has-dates has-featured-images">' +
            '<li><div class="wp-block-latest-posts__featured-image"><img src="post1.jpg" /></div>' +
            '<a href="/post1">Post 1 Title</a><time>January 1, 2023</time></li>' +
            '<li><div class="wp-block-latest-posts__featured-image"><img src="post2.jpg" /></div>' +
            '<a href="/post2">Post 2 Title</a><time>January 2, 2023</time></li>' +
            '<li><div class="wp-block-latest-posts__featured-image"><img src="post3.jpg" /></div>' +
            '<a href="/post3">Post 3 Title</a><time>January 3, 2023</time></li>' +
            '</div>'
          ]
        }
      ];

      const html = convertBlocks(blocks);
      
      // Check for content and structure
      expect(html).toContain('Latest Articles');
      expect(html).toContain('Post 1 Title');
      expect(html).toContain('Post 2 Title');
      expect(html).toContain('Post 3 Title');
      expect(html).toContain('January 1, 2023');
      
      // Check for structure
      expect(html).toContain('wp-block-heading');
      expect(html).toContain('wp-block-separator');
      expect(html).toContain('wp-block-latest-posts');
    });
  });

  describe('CSS Framework Integrations', () => {
    it('should correctly apply Tailwind CSS classes', () => {
      const blocks: Block[] = [
        {
          blockName: 'core/columns',
          attrs: { columns: 2 },
          innerBlocks: [
            {
              blockName: 'core/column',
              attrs: { width: 50 },
              innerBlocks: [
                {
                  blockName: 'core/heading',
                  attrs: { level: 3, align: 'center' },
                  innerBlocks: [],
                  innerContent: ['<h3>Tailwind Heading</h3>']
                },
                {
                  blockName: 'core/paragraph',
                  attrs: { align: 'center' },
                  innerBlocks: [],
                  innerContent: ['<p>Tailwind paragraph text</p>']
                }
              ],
              innerContent: ['', '']
            },
            {
              blockName: 'core/column',
              attrs: { width: 50 },
              innerBlocks: [
                {
                  blockName: 'core/image',
                  attrs: { 
                    url: 'test.jpg',
                    alt: 'Test Image',
                    align: 'center'
                  },
                  innerBlocks: [],
                  innerContent: ['<img src="test.jpg" alt="Test Image" />']
                }
              ],
              innerContent: ['', '']
            }
          ],
          innerContent: ['', '', '']
        }
      ];

      const html = convertBlocks(blocks, { cssFramework: 'tailwind' });
      
      // Should contain Tailwind specific classes
      expect(html).toContain('flex');
      expect(html).toContain('gap-4');
      expect(html).toContain('text-center');
      expect(html).toContain('mx-auto');
      
      // Should not contain WordPress default classes
      expect(html).not.toContain('wp-block-columns');
      expect(html).not.toContain('wp-block-heading');
      
      // Should still contain content
      expect(html).toContain('Tailwind Heading');
      expect(html).toContain('Tailwind paragraph text');
      expect(html).toContain('test.jpg');
    });

    it('should correctly apply Bootstrap CSS classes', () => {
      const blocks: Block[] = [
        {
          blockName: 'core/columns',
          attrs: { columns: 2 },
          innerBlocks: [
            {
              blockName: 'core/column',
              attrs: { width: 50 },
              innerBlocks: [
                {
                  blockName: 'core/heading',
                  attrs: { level: 3, align: 'center' },
                  innerBlocks: [],
                  innerContent: ['<h3>Bootstrap Heading</h3>']
                },
                {
                  blockName: 'core/paragraph',
                  attrs: { align: 'center' },
                  innerBlocks: [],
                  innerContent: ['<p>Bootstrap paragraph text</p>']
                }
              ],
              innerContent: ['', '']
            },
            {
              blockName: 'core/column',
              attrs: { width: 50 },
              innerBlocks: [
                {
                  blockName: 'core/button',
                  attrs: { 
                    text: 'Bootstrap Button',
                    url: '#',
                    backgroundColor: 'primary'
                  },
                  innerBlocks: [],
                  innerContent: ['<div class="wp-block-button"><a class="wp-block-button__link">Bootstrap Button</a></div>']
                }
              ],
              innerContent: ['', '']
            }
          ],
          innerContent: ['', '', '']
        }
      ];

      const html = convertBlocks(blocks, { cssFramework: 'bootstrap' });
      
      // Should contain Bootstrap specific classes
      expect(html).toContain('row');
      expect(html).toContain('col-md-6');
      expect(html).toContain('text-center');
      expect(html).toContain('btn');
      expect(html).toContain('btn-primary');
      
      // Should not contain WordPress default classes
      expect(html).not.toContain('wp-block-columns');
      expect(html).not.toContain('wp-block-button__link');
      
      // Should still contain content
      expect(html).toContain('Bootstrap Heading');
      expect(html).toContain('Bootstrap paragraph text');
      expect(html).toContain('Bootstrap Button');
    });
  });
}); 