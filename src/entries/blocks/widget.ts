// Import widget block handlers
import {
  tableBlockHandler,
  buttonBlockHandler,
  shortcodeBlockHandler,
  customHtmlBlockHandler,
} from '../../block-handlers';

// Export widget block handlers
export { tableBlockHandler, buttonBlockHandler, shortcodeBlockHandler, customHtmlBlockHandler };

// Import registry functions
import { registerBlockHandler } from '../../core/registry';

// Function to register only widget blocks
export function registerWidgetBlockHandlers(): void {
  registerBlockHandler('core/table', tableBlockHandler);
  registerBlockHandler('core/button', buttonBlockHandler);
  registerBlockHandler('core/shortcode', shortcodeBlockHandler);
  registerBlockHandler('core/html', customHtmlBlockHandler);
}

// Export core types and functions for usage
export type { Block, BlockList, BlockHandler, ConversionOptions } from '../../types';
export { convertBlocks } from '../../core/converter';
