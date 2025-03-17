import { registerBlockHandler } from '../core/registry';
import { paragraphBlockHandler } from './paragraph';
import { headingBlockHandler } from './heading';
import { listBlockHandler } from './list';
import { imageBlockHandler } from './image';
import { quoteBlockHandler } from './quote';
import { codeBlockHandler } from './code';
import { preformattedBlockHandler } from './preformatted';
import { tableBlockHandler } from './table';
import { buttonBlockHandler } from './button';
import { separatorBlockHandler } from './separator';
import { spacerBlockHandler } from './spacer';
import { groupBlockHandler } from './group';
import { columnsBlockHandler } from './columns';
import { columnBlockHandler } from './column';
import { embedBlockHandler } from './embed';
import { galleryBlockHandler } from './gallery';
import { detailsBlockHandler } from './details';
import { pullquoteBlockHandler } from './pullquote';
import { verseBlockHandler } from './verse';
import { classicBlockHandler } from './classic';
import { audioBlockHandler } from './audio';
import { videoBlockHandler } from './video';
import { fileBlockHandler } from './file';
import { coverBlockHandler } from './cover';
import { mediaTextBlockHandler } from './media-text';
import { rowBlockHandler } from './row';
import { stackBlockHandler } from './stack';
import { gridBlockHandler } from './grid';
import { pageBreakBlockHandler } from './page-break';
import { moreBlockHandler } from './more';
import { shortcodeBlockHandler } from './shortcode';
import { customHtmlBlockHandler } from './custom-html';
import { latestPostsBlockHandler } from './latest-posts';

// Register all built-in block handlers
export function registerBuiltInBlockHandlers(): void {
  // Text blocks
  registerBlockHandler('core/paragraph', paragraphBlockHandler);
  registerBlockHandler('core/heading', headingBlockHandler);
  registerBlockHandler('core/list', listBlockHandler);
  registerBlockHandler('core/quote', quoteBlockHandler);
  registerBlockHandler('core/code', codeBlockHandler);
  registerBlockHandler('core/preformatted', preformattedBlockHandler);
  registerBlockHandler('core/pullquote', pullquoteBlockHandler);
  registerBlockHandler('core/verse', verseBlockHandler);
  registerBlockHandler('core/freeform', classicBlockHandler); // Classic editor
  registerBlockHandler('core/details', detailsBlockHandler);
  
  // Media blocks
  registerBlockHandler('core/image', imageBlockHandler);
  registerBlockHandler('core/gallery', galleryBlockHandler);
  registerBlockHandler('core/audio', audioBlockHandler);
  registerBlockHandler('core/video', videoBlockHandler);
  registerBlockHandler('core/file', fileBlockHandler);
  registerBlockHandler('core/cover', coverBlockHandler);
  registerBlockHandler('core/media-text', mediaTextBlockHandler);
  registerBlockHandler('core/embed', embedBlockHandler);
  
  // Widget blocks
  registerBlockHandler('core/table', tableBlockHandler);
  registerBlockHandler('core/button', buttonBlockHandler);
  registerBlockHandler('core/shortcode', shortcodeBlockHandler);
  registerBlockHandler('core/html', customHtmlBlockHandler);
  
  // Dynamic blocks
  registerBlockHandler('core/latest-posts', latestPostsBlockHandler);
  registerBlockHandler('core/more', moreBlockHandler);
  registerBlockHandler('core/nextpage', pageBreakBlockHandler);
  registerBlockHandler('core/separator', separatorBlockHandler);
  registerBlockHandler('core/spacer', spacerBlockHandler);
  
  // Layout blocks
  registerBlockHandler('core/group', groupBlockHandler);
  registerBlockHandler('core/columns', columnsBlockHandler);
  registerBlockHandler('core/column', columnBlockHandler);
  registerBlockHandler('core/row', rowBlockHandler);
  registerBlockHandler('core/stack', stackBlockHandler);
  registerBlockHandler('core/grid', gridBlockHandler);
}

// Export individual handlers for direct use
export { 
  paragraphBlockHandler,
  headingBlockHandler,
  listBlockHandler,
  imageBlockHandler,
  quoteBlockHandler,
  codeBlockHandler,
  preformattedBlockHandler,
  tableBlockHandler,
  buttonBlockHandler,
  separatorBlockHandler,
  spacerBlockHandler,
  groupBlockHandler,
  columnsBlockHandler,
  columnBlockHandler,
  embedBlockHandler,
  galleryBlockHandler,
  detailsBlockHandler,
  pullquoteBlockHandler,
  verseBlockHandler,
  classicBlockHandler,
  audioBlockHandler,
  videoBlockHandler,
  fileBlockHandler,
  coverBlockHandler,
  mediaTextBlockHandler,
  rowBlockHandler,
  stackBlockHandler,
  gridBlockHandler,
  pageBreakBlockHandler,
  moreBlockHandler,
  shortcodeBlockHandler,
  customHtmlBlockHandler,
  latestPostsBlockHandler
};