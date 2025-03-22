import { registerBlockHandler } from './core/registry';
import { paragraphBlockHandler } from './block-handlers/paragraph';
import { headingBlockHandler } from './block-handlers/heading';
import { listBlockHandler } from './block-handlers/list';
import { imageBlockHandler } from './block-handlers/image';
import { mediaTextBlockHandler } from './block-handlers/media-text';
import { quoteBlockHandler } from './block-handlers/quote';
import { codeBlockHandler } from './block-handlers/code';
import { preformattedBlockHandler } from './block-handlers/preformatted';
import { pullquoteBlockHandler } from './block-handlers/pullquote';
import { verseBlockHandler } from './block-handlers/verse';
import { tableBlockHandler } from './block-handlers/table';
import { columnsBlockHandler } from './block-handlers/columns';
import { groupBlockHandler } from './block-handlers/group';
import { buttonBlockHandler } from './block-handlers/button';
import { buttonsBlockHandler } from './block-handlers/buttons';
import { separatorBlockHandler } from './block-handlers/separator';
import { spacerBlockHandler } from './block-handlers/spacer';
import { shortcodeBlockHandler } from './block-handlers/shortcode';
import { customHtmlBlockHandler } from './block-handlers/custom-html';
import { latestPostsBlockHandler } from './block-handlers/latest-posts';
import { archivesBlockHandler } from './block-handlers/archives';
import { calendarBlockHandler } from './block-handlers/calendar';
import { categoriesBlockHandler } from './block-handlers/categories';
import { pageListBlockHandler } from './block-handlers/page-list';
import { rssBlockHandler } from './block-handlers/rss';
import { searchBlockHandler } from './block-handlers/search';
import { socialLinksBlockHandler } from './block-handlers/social-links';

/**
 * Register all built-in block handlers
 */
export function registerBuiltInBlockHandlers(): void {
  // Register core block handlers
  registerBlockHandler('core/paragraph', paragraphBlockHandler);
  registerBlockHandler('core/heading', headingBlockHandler);
  registerBlockHandler('core/list', listBlockHandler);
  registerBlockHandler('core/image', imageBlockHandler);
  registerBlockHandler('core/media-text', mediaTextBlockHandler);
  registerBlockHandler('core/quote', quoteBlockHandler);
  registerBlockHandler('core/code', codeBlockHandler);
  registerBlockHandler('core/preformatted', preformattedBlockHandler);
  registerBlockHandler('core/pullquote', pullquoteBlockHandler);
  registerBlockHandler('core/verse', verseBlockHandler);
  registerBlockHandler('core/table', tableBlockHandler);
  registerBlockHandler('core/columns', columnsBlockHandler);
  registerBlockHandler('core/group', groupBlockHandler);
  registerBlockHandler('core/button', buttonBlockHandler);
  registerBlockHandler('core/buttons', buttonsBlockHandler);
  registerBlockHandler('core/separator', separatorBlockHandler);
  registerBlockHandler('core/spacer', spacerBlockHandler);
  registerBlockHandler('core/shortcode', shortcodeBlockHandler);
  registerBlockHandler('core/html', customHtmlBlockHandler);
  registerBlockHandler('core/latest-posts', latestPostsBlockHandler);
  registerBlockHandler('core/archives', archivesBlockHandler);
  registerBlockHandler('core/calendar', calendarBlockHandler);
  registerBlockHandler('core/categories', categoriesBlockHandler);
  registerBlockHandler('core/page-list', pageListBlockHandler);
  registerBlockHandler('core/rss', rssBlockHandler);
  registerBlockHandler('core/search', searchBlockHandler);
  registerBlockHandler('core/social-links', socialLinksBlockHandler);
}
