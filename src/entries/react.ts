// Import and export React-specific adapters
export { convertBlocksToReact, createReactComponent } from '../framework-adapters/react';

// Export React-specific types
export type { ReactWordPressBlocksProps } from '../framework-adapters';

// Export core types and functions for usage with React
export type { Block, BlockList, BlockHandler, ConversionOptions } from '../types';
export { convertBlocks } from '../core/converter';
export { registerBlockHandler } from '../core/registry';
