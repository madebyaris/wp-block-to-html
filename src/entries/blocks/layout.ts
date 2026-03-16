// Import layout block handlers
import {
  groupBlockHandler,
  columnsBlockHandler,
  columnBlockHandler,
  rowBlockHandler,
  stackBlockHandler,
  gridBlockHandler,
  buttonsBlockHandler,
  accordionBlockHandler,
} from '../../block-handlers';

// Export layout block handlers
export {
  groupBlockHandler,
  columnsBlockHandler,
  columnBlockHandler,
  rowBlockHandler,
  stackBlockHandler,
  gridBlockHandler,
  buttonsBlockHandler,
  accordionBlockHandler,
};

// Import registry functions
import { registerBlockHandler } from '../../core/registry';

// Function to register only layout blocks
export function registerLayoutBlockHandlers(): void {
  registerBlockHandler('core/group', groupBlockHandler);
  registerBlockHandler('core/columns', columnsBlockHandler);
  registerBlockHandler('core/column', columnBlockHandler);
  registerBlockHandler('core/row', rowBlockHandler);
  registerBlockHandler('core/stack', stackBlockHandler);
  registerBlockHandler('core/grid', gridBlockHandler);
  registerBlockHandler('core/buttons', buttonsBlockHandler);
  registerBlockHandler('core/accordion', accordionBlockHandler);
}

// Export core types and functions for usage
export type { Block, BlockList, BlockHandler, ConversionOptions } from '../../types';
export { convertBlocks } from '../../core/converter';
