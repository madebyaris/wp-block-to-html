import { BlockHandler, BlockHandlerRegistry } from '../types';

/**
 * Global registry of block handlers
 */
const blockHandlers: BlockHandlerRegistry = {};

/**
 * Register a block handler for a specific block type
 * @param blockName WordPress block name (e.g., 'core/paragraph')
 * @param handler Block handler implementation
 */
export function registerBlockHandler(blockName: string, handler: BlockHandler): void {
  blockHandlers[blockName] = handler;
}

/**
 * Get a block handler for a specific block type
 * @param blockName WordPress block name (e.g., 'core/paragraph')
 * @returns Block handler if registered, undefined otherwise
 */
export function getBlockHandler(blockName: string): BlockHandler | undefined {
  return blockHandlers[blockName];
}

/**
 * Check if a block handler is registered
 * @param blockName WordPress block name
 * @returns True if a handler is registered, false otherwise
 */
export function hasBlockHandler(blockName: string): boolean {
  return blockName in blockHandlers;
}

/**
 * Get all registered block handlers
 * @returns Object mapping block names to handlers
 */
export function getAllBlockHandlers(): BlockHandlerRegistry {
  return { ...blockHandlers };
}

/**
 * Remove a block handler
 * @param blockName WordPress block name
 */
export function removeBlockHandler(blockName: string): void {
  if (blockName in blockHandlers) {
    delete blockHandlers[blockName];
  }
} 