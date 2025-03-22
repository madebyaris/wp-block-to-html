// Import and export Svelte-specific adapters
export {
  convertBlocksToSvelte,
  createSvelteComponentCode,
  createSvelteStore,
} from '../framework-adapters/svelte';

// Export core types and functions for usage with Svelte
export type { Block, BlockList, BlockHandler, ConversionOptions } from '../types';
