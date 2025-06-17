/**
 * WordPress Block to HTML Converter - Hydration Module
 *
 * This module provides client-side hydration capabilities for server-side rendered
 * WordPress blocks, enabling progressive enhancement and interactive functionality.
 *
 * @version 1.0.0
 */

import {
  type BlockData,
  type HydrationCallback,
  type HydrationContext,
  type HydrationOptions,
  type HydrationStats,
  HydrationStrategy,
  type StrategyType,
  StrategyFactory,
} from './core';

import {
  createDefaultOptions,
  createEmptyStats,
  findHydrationElements,
  getHydrationId,
  getHydrationStrategy,
  getViewportDimensions,
  isHydrated,
  loadHydrationData,
  logHydration,
  markAsHydrated,
  PerformanceTimer,
  PriorityQueue,
  removeHydrationMarkers,
  updateStats,
  validateBlockData,
} from './utils';

/**
 * Main hydration manager class
 */
export class HydrationManager {
  private context: HydrationContext;
  private options: HydrationOptions;
  private strategies: Map<StrategyType, HydrationStrategy> = new Map();
  private hydrationData: Map<string, BlockData> = new Map();
  private priorityQueue: PriorityQueue<HTMLElement> = new PriorityQueue();
  private isInitialized = false;

  constructor(options: Partial<HydrationOptions> = {}) {
    this.options = createDefaultOptions(options);
    this.context = {
      viewport: getViewportDimensions(),
      timing: { start: performance.now() },
      queue: new Set(),
      stats: createEmptyStats(),
    };

    if (this.options.debug) {
      logHydration('info', 'Manager', 'HydrationManager created', this.options);
    }
  }

  /**
   * Initialize the hydration system
   */
  async initialize(container?: Element): Promise<void> {
    if (this.isInitialized) {
      logHydration('warn', 'Manager', 'Already initialized');
      return;
    }

    const timer = new PerformanceTimer();

    try {
      // Load hydration data from script tag
      this.hydrationData = loadHydrationData();

      if (this.options.debug) {
        logHydration('info', 'Manager', `Loaded hydration data for ${this.hydrationData.size} blocks`);
      }

      // Find elements that need hydration
      const elements = findHydrationElements(container);

      if (elements.length === 0) {
        logHydration('info', 'Manager', 'No elements found for hydration');
        this.isInitialized = true;
        return;
      }

      // Create block data map for elements
      const blockDataMap = this.createBlockDataMap(elements);

      // Setup hydration strategies
      await this.setupStrategies(elements, blockDataMap);

      this.isInitialized = true;
      this.context.timing.renderStart = timer.stop();

      if (this.options.debug) {
        logHydration('info', 'Manager', `Initialization completed in ${this.context.timing.renderStart.toFixed(2)}ms`);
      }
    } catch (error) {
      logHydration('error', 'Manager', 'Initialization failed', error);
      throw error;
    }
  }

  /**
   * Manually hydrate a specific element
   */
  async hydrate(element: HTMLElement, blockData: BlockData, options?: HydrationOptions): Promise<void> {
    if (isHydrated(element)) {
      if (this.options.debug) {
        logHydration('warn', 'Manual', 'Element already hydrated');
      }
      return;
    }

    const timer = new PerformanceTimer();
    const mergedOptions = { ...this.options, ...options };

    try {
      await this.executeHydration(element, blockData, mergedOptions);
      const duration = timer.stop();
      updateStats(this.context.stats, mergedOptions.strategy as StrategyType || 'immediate', duration);

      if (mergedOptions.debug) {
        logHydration('info', 'Manual', `Element hydrated in ${duration.toFixed(2)}ms`);
      }
    } catch (error) {
      logHydration('error', 'Manual', 'Hydration failed', error);
      throw error;
    }
  }

  /**
   * Progressive hydration for multiple elements
   */
  async hydrateProgressively(
    elements: HTMLElement[],
    blockDataMap: Map<HTMLElement, BlockData>,
    options?: HydrationOptions,
  ): Promise<void> {
    const mergedOptions = { ...this.options, ...options };
    const strategies = Array.isArray(mergedOptions.strategy) 
      ? mergedOptions.strategy 
      : [mergedOptions.strategy || 'viewport'];

    if (mergedOptions.debug) {
      logHydration('info', 'Progressive', `Starting progressive hydration for ${elements.length} elements`);
    }

    // Group elements by strategy
    const strategyGroups = this.groupElementsByStrategy(elements, blockDataMap, strategies);

    // Setup each strategy
    for (const [strategyType, strategyElements] of strategyGroups) {
      const strategy = StrategyFactory.createStrategy(strategyType, mergedOptions, this.context);
      
      if (strategy.shouldHydrate(strategyElements[0], blockDataMap.get(strategyElements[0])!)) {
        strategy.setup(strategyElements, blockDataMap, (el, data) => this.executeHydration(el, data, mergedOptions));
        this.strategies.set(strategyType, strategy);
      }
    }
  }

  /**
   * Cleanup all hydration resources
   */
  cleanup(): void {
    // Cleanup all strategies
    this.strategies.forEach((strategy) => {
      strategy.cleanup();
    });
    this.strategies.clear();

    // Clear queues and data
    this.context.queue.clear();
    this.priorityQueue.clear();
    this.hydrationData.clear();

    this.isInitialized = false;

    if (this.options.debug) {
      logHydration('info', 'Manager', 'Cleanup completed');
    }
  }

  /**
   * Get hydration statistics
   */
  getStats(): HydrationStats {
    return { ...this.context.stats };
  }

  /**
   * Check if element is hydrated
   */
  isHydrated(element: HTMLElement): boolean {
    return isHydrated(element);
  }

  /**
   * Remove hydration markers from element
   */
  removeMarkers(element: HTMLElement): void {
    removeHydrationMarkers(element);
  }

  /**
   * Create block data map for elements
   */
  private createBlockDataMap(elements: HTMLElement[]): Map<HTMLElement, BlockData> {
    const map = new Map<HTMLElement, BlockData>();

    elements.forEach((element) => {
      const hydrationId = getHydrationId(element);
      if (hydrationId) {
        const blockData = this.hydrationData.get(hydrationId);
        if (blockData && validateBlockData(blockData)) {
          map.set(element, blockData);
        } else if (this.options.debug) {
          logHydration('warn', 'Manager', `No valid block data found for hydration ID: ${hydrationId}`);
        }
      }
    });

    return map;
  }

  /**
   * Setup hydration strategies
   */
  private async setupStrategies(
    elements: HTMLElement[],
    blockDataMap: Map<HTMLElement, BlockData>,
  ): Promise<void> {
    const strategies = Array.isArray(this.options.strategy) 
      ? this.options.strategy 
      : [this.options.strategy || 'viewport'];

    // Group elements by strategy
    const strategyGroups = this.groupElementsByStrategy(elements, blockDataMap, strategies);

    // Setup each strategy
    for (const [strategyType, strategyElements] of strategyGroups) {
      const strategy = StrategyFactory.createStrategy(strategyType, this.options, this.context);
      
      if (strategy.shouldHydrate(strategyElements[0], blockDataMap.get(strategyElements[0])!)) {
        strategy.setup(strategyElements, blockDataMap, (el, data) => this.executeHydration(el, data, this.options));
        this.strategies.set(strategyType, strategy);
      } else if (this.options.debug) {
        logHydration('warn', 'Manager', `Strategy ${strategyType} not supported, skipping`);
      }
    }
  }

  /**
   * Group elements by their hydration strategy
   */
  private groupElementsByStrategy(
    elements: HTMLElement[],
    blockDataMap: Map<HTMLElement, BlockData>,
    strategies: StrategyType[],
  ): Map<StrategyType, HTMLElement[]> {
    const groups = new Map<StrategyType, HTMLElement[]>();

    elements.forEach((element) => {
      // Check for element-specific strategy first
      let elementStrategy = getHydrationStrategy(element);
      
      // Fall back to default strategies
      if (!elementStrategy) {
        elementStrategy = strategies[0];
      }

      // Validate strategy is supported
      if (!strategies.includes(elementStrategy)) {
        elementStrategy = 'immediate'; // Fallback strategy
      }

      if (!groups.has(elementStrategy)) {
        groups.set(elementStrategy, []);
      }
      groups.get(elementStrategy)!.push(element);
    });

    return groups;
  }

  /**
   * Execute hydration for a single element
   */
  private async executeHydration(
    element: HTMLElement,
    blockData: BlockData,
    options: HydrationOptions,
  ): Promise<void> {
    if (isHydrated(element)) {
      return;
    }

    // Check concurrent hydration limit
    if (this.context.queue.size >= (options.maxConcurrent || 3)) {
      // Wait briefly and retry
      await new Promise((resolve) => setTimeout(resolve, 10));
      return this.executeHydration(element, blockData, options);
    }

    const timer = new PerformanceTimer();

    try {
      // Add to active queue
      this.context.queue.add(element);

      // Mark as hydrated
      markAsHydrated(element, blockData);

      // Framework-specific hydration logic would go here
      // For now, just mark as complete
      
      const duration = timer.stop();
      updateStats(this.context.stats, options.strategy as StrategyType || 'immediate', duration);

      if (options.debug) {
        logHydration('info', 'Execute', `Hydrated ${blockData.blockName} in ${duration.toFixed(2)}ms`);
      }
    } finally {
      // Remove from active queue
      this.context.queue.delete(element);
    }
  }
}

// Export convenience functions
export async function initialize(options?: Partial<HydrationOptions>): Promise<HydrationManager> {
  const manager = new HydrationManager(options);
  await manager.initialize();
  return manager;
}

export function hydrate(
  element: HTMLElement,
  blockData: BlockData,
  options?: HydrationOptions,
): Promise<void> {
  const manager = new HydrationManager(options);
  return manager.hydrate(element, blockData, options);
}

export function hydrateProgressively(
  elements: HTMLElement[],
  blockDataMap: Map<HTMLElement, BlockData>,
  options?: HydrationOptions,
): Promise<void> {
  const manager = new HydrationManager(options);
  return manager.hydrateProgressively(elements, blockDataMap, options);
}

// Export types and utilities
export type {
  BlockData,
  HydrationCallback,
  HydrationContext,
  HydrationOptions,
  HydrationStats,
  StrategyType,
};

export {
  createDefaultOptions,
  findHydrationElements,
  isHydrated,
  loadHydrationData,
  markAsHydrated,
  removeHydrationMarkers,
  StrategyFactory,
};

// Version export
export const VERSION = '1.0.0'; 