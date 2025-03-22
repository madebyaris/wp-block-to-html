// Import dynamic block handlers
import {
  latestPostsBlockHandler,
  moreBlockHandler,
  pageBreakBlockHandler,
  separatorBlockHandler,
  spacerBlockHandler,
} from '../../block-handlers';

// Import pagination utility directly
import { processPaginatedContent } from '../../block-handlers/page-break';

// Export dynamic block handlers
export {
  latestPostsBlockHandler,
  moreBlockHandler,
  pageBreakBlockHandler,
  separatorBlockHandler,
  spacerBlockHandler,
  // Export pagination utility
  processPaginatedContent,
};

// Import registry functions
import { registerBlockHandler } from '../../core/registry';

// Function to register only dynamic blocks
export function registerDynamicBlockHandlers(): void {
  registerBlockHandler('core/latest-posts', latestPostsBlockHandler);
  registerBlockHandler('core/more', moreBlockHandler);
  registerBlockHandler('core/nextpage', pageBreakBlockHandler);
  registerBlockHandler('core/separator', separatorBlockHandler);
  registerBlockHandler('core/spacer', spacerBlockHandler);
}

// Export core types and functions for usage
export type { Block, BlockList, BlockHandler, ConversionOptions } from '../../types';
export { convertBlocks } from '../../core/converter';
