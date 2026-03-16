import {
  breadcrumbsBlockHandler,
  commentsCountBlockHandler,
  commentsLinkBlockHandler,
  termsQueryBlockHandler,
} from '../../block-handlers';
import { registerBlockHandler } from '../../core/registry';

export {
  breadcrumbsBlockHandler,
  commentsCountBlockHandler,
  commentsLinkBlockHandler,
  termsQueryBlockHandler,
};

export function registerThemeBlockHandlers(): void {
  registerBlockHandler('core/terms-query', termsQueryBlockHandler);
  registerBlockHandler('core/comments-link', commentsLinkBlockHandler);
  registerBlockHandler('core/comments-count', commentsCountBlockHandler);
  registerBlockHandler('core/breadcrumbs', breadcrumbsBlockHandler);
}

export type { Block, BlockList, BlockHandler, ConversionOptions } from '../../types';
export { convertBlocks } from '../../core/converter';
