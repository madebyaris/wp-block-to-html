// Import widget block handlers
import {
  shortcodeBlockHandler,
  buttonBlockHandler,
  customHtmlBlockHandler,
  tableBlockHandler,
  archivesBlockHandler,
  calendarBlockHandler,
  categoriesBlockHandler,
  termListBlockHandler,
  pageListBlockHandler,
  rssBlockHandler,
  searchBlockHandler,
  socialLinksBlockHandler,
} from '../../block-handlers';

// Export widget block handlers
export {
  shortcodeBlockHandler,
  buttonBlockHandler,
  customHtmlBlockHandler,
  tableBlockHandler,
  archivesBlockHandler,
  calendarBlockHandler,
  categoriesBlockHandler,
  termListBlockHandler,
  pageListBlockHandler,
  rssBlockHandler,
  searchBlockHandler,
  socialLinksBlockHandler,
};

// Import registry functions
import { registerBlockHandler } from '../../core/registry';

// Function to register only widget blocks
export function registerWidgetBlockHandlers(): void {
  registerBlockHandler('core/shortcode', shortcodeBlockHandler);
  registerBlockHandler('core/button', buttonBlockHandler);
  registerBlockHandler('core/html', customHtmlBlockHandler);
  registerBlockHandler('core/table', tableBlockHandler);
  registerBlockHandler('core/archives', archivesBlockHandler);
  registerBlockHandler('core/calendar', calendarBlockHandler);
  registerBlockHandler('core/categories', categoriesBlockHandler);
  registerBlockHandler('core/tag-cloud', termListBlockHandler);
  registerBlockHandler('core/page-list', pageListBlockHandler);
  registerBlockHandler('core/rss', rssBlockHandler);
  registerBlockHandler('core/search', searchBlockHandler);
  registerBlockHandler('core/social-links', socialLinksBlockHandler);
}

// Export core types and functions for usage
export type { Block, BlockList, BlockHandler, ConversionOptions } from '../../types';
export { convertBlocks } from '../../core/converter';
