import { describe, expect, it } from 'vitest';

import { convertBlocks } from '../src/core/converter';
import { processBlocksIncrementally } from '../src/core/incremental';
import { registerAllBlockHandlers } from '../src/entries/blocks';
import type { Block } from '../src/types';

registerAllBlockHandlers();

describe('v1.5.0 compatibility coverage', () => {
  it('renders core/buttons containers with nested buttons', () => {
    const blocks: Block[] = [
      {
        blockName: 'core/buttons',
        attrs: { align: 'center' },
        innerBlocks: [
          {
            blockName: 'core/button',
            attrs: { text: 'Primary CTA', url: 'https://example.com' },
            innerBlocks: [],
            innerContent: [
              '<div class="wp-block-button"><a class="wp-block-button__link">Primary CTA</a></div>',
            ],
          },
        ],
        innerContent: [''],
      },
    ];

    const html = convertBlocks(blocks) as string;
    expect(html).toContain('wp-block-buttons');
    expect(html).toContain('Primary CTA');
    expect(html).toContain('is-content-justification-center');
  });

  it('renders core/math blocks with MathML content', () => {
    const blocks: Block[] = [
      {
        blockName: 'core/math',
        attrs: {},
        innerBlocks: [],
        innerContent: ['<math><mi>x</mi><mo>=</mo><mn>5</mn></math>'],
      },
    ];

    const html = convertBlocks(blocks) as string;
    expect(html).toContain('data-math-format="mathml"');
    expect(html).toContain('<math>');
  });

  it('renders core/accordion blocks and preserves nested content', () => {
    const blocks: Block[] = [
      {
        blockName: 'core/accordion',
        attrs: {},
        innerBlocks: [],
        innerContent: ['<details><summary>FAQ</summary><p>Accordion content</p></details>'],
      },
    ];

    const html = convertBlocks(blocks) as string;
    expect(html).toContain('Accordion content');
    expect(html).toContain('FAQ');
  });

  it('renders selected 6.9 and 7.0 dynamic/theme blocks', () => {
    const blocks: Block[] = [
      {
        blockName: 'core/latest-comments',
        attrs: { commentsToShow: 2 },
        innerBlocks: [],
        innerContent: [''],
      },
      {
        blockName: 'core/terms-query',
        attrs: { query: { taxonomy: 'category' } },
        innerBlocks: [],
        innerContent: [''],
      },
      {
        blockName: 'core/comments-link',
        attrs: { text: 'View 3 comments' },
        innerBlocks: [],
        innerContent: [''],
      },
      {
        blockName: 'core/comments-count',
        attrs: { count: 3 },
        innerBlocks: [],
        innerContent: [''],
      },
      {
        blockName: 'core/breadcrumbs',
        attrs: { separator: '>' },
        innerBlocks: [],
        innerContent: [''],
      },
    ];

    const html = convertBlocks(blocks) as string;
    expect(html).toContain('data-comments-to-show="2"');
    expect(html).toContain('data-taxonomy="category"');
    expect(html).toContain('View 3 comments');
    expect(html).toContain('3 comments');
    expect(html).toContain('aria-label="Breadcrumb"');
  });

  it('emits compatibility wrappers for modern block visibility metadata', () => {
    const blocks: Block[] = [
      {
        blockName: 'core/paragraph',
        attrs: {
          metadata: {
            blockVisibility: {
              viewport: {
                mobile: false,
                tablet: true,
                desktop: false,
              },
            },
          },
        },
        innerBlocks: [],
        innerContent: ['<p>Visibility aware text</p>'],
      },
      {
        blockName: 'core/paragraph',
        attrs: {
          metadata: {
            blockVisibility: false,
          },
        },
        innerBlocks: [],
        innerContent: ['<p>Always hidden text</p>'],
      },
    ];

    const html = convertBlocks(blocks) as string;
    expect(html).toContain('wp-block-to-html-hidden-mobile');
    expect(html).toContain('wp-block-to-html-hidden-desktop');
    expect(html).toContain('data-wp-block-visibility="mobile,desktop"');
    expect(html).toContain('hidden data-wp-block-visibility="hidden"');
  });

  it('uses template batches instead of serializing raw block JSON for incremental mode', () => {
    const blocks: Block[] = [
      {
        blockName: 'core/paragraph',
        attrs: {},
        innerBlocks: [],
        innerContent: ['<p>One</p>'],
      },
      {
        blockName: 'core/paragraph',
        attrs: {},
        innerBlocks: [],
        innerContent: ['<p>Two</p>'],
      },
      {
        blockName: 'core/paragraph',
        attrs: {},
        innerBlocks: [],
        innerContent: ['<p>Three</p>'],
      },
    ];

    const html = processBlocksIncrementally(blocks, (block) => block.innerContent.join(''), {
      initialRenderCount: 1,
      batchSize: 1,
    });

    expect(html).toContain('wp-block-incremental-template-0');
    expect(html).not.toContain('remainingBlocks:');
    expect(html).toContain('window.__wpProcessRemainingBlocks');
  });
});
