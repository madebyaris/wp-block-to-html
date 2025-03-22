// Import and export Angular-specific adapters
export {
  convertBlocksToAngular,
  createAngularService,
  createAngularDirective,
} from '../framework-adapters/angular';

// Export core types and functions for usage with Angular
export type { Block, BlockList, BlockHandler, ConversionOptions } from '../types';
