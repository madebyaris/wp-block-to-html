/**
 * WordPress Block to HTML Converter - Hydration Utilities
 *
 * Utility functions for hydration system operations.
 *
 * @version 1.0.0
 */

import type { BlockData, HydrationOptions, HydrationStats, StrategyType } from './core';

/**
 * Create default hydration options with sensible defaults
 */
export function createDefaultOptions(overrides: Partial<HydrationOptions> = {}): HydrationOptions {
  return {
    strategy: 'viewport',
    rootMargin: '50px',
    threshold: 0.1,
    interactionEvents: ['click', 'focusin', 'touchstart'],
    idleTimeout: 2000,
    maxConcurrent: 3,
    debug: false,
    ...overrides,
  };
}

/**
 * Create empty hydration statistics
 */
export function createEmptyStats(): HydrationStats {
  return {
    hydrated: 0,
    totalTime: 0,
    averageTime: 0,
    strategyUsage: {
      immediate: 0,
      viewport: 0,
      interaction: 0,
      idle: 0,
    },
  };
}

/**
 * Get current viewport dimensions
 */
export function getViewportDimensions(): { width: number; height: number } {
  if (typeof window !== 'undefined') {
    return {
      width: window.innerWidth || document.documentElement.clientWidth || 0,
      height: window.innerHeight || document.documentElement.clientHeight || 0,
    };
  }
  return { width: 0, height: 0 };
}

/**
 * Generate unique hydration ID
 */
export function generateHydrationId(): string {
  return `h${Date.now().toString(36)}${Math.random().toString(36).substring(2, 5)}`;
}

/**
 * Check if element has hydration marker
 */
export function hasHydrationMarker(element: HTMLElement): boolean {
  return element.hasAttribute('data-wp-hydrate');
}

/**
 * Get hydration ID from element
 */
export function getHydrationId(element: HTMLElement): string | null {
  return element.getAttribute('data-wp-hydrate');
}

/**
 * Get block name from element
 */
export function getBlockName(element: HTMLElement): string | null {
  return element.getAttribute('data-wp-block');
}

/**
 * Get hydration strategy from element
 */
export function getHydrationStrategy(element: HTMLElement): StrategyType | null {
  const strategy = element.getAttribute('data-wp-strategy');
  if (strategy && ['immediate', 'viewport', 'interaction', 'idle'].includes(strategy)) {
    return strategy as StrategyType;
  }
  return null;
}

/**
 * Mark element as hydrated
 */
export function markAsHydrated(element: HTMLElement, blockData: BlockData): void {
  element.setAttribute('data-hydrated', 'true');
  element.setAttribute('data-hydrated-at', Date.now().toString());
  element.setAttribute('data-block-name', blockData.blockName);

  // Dispatch hydration event
  const event = new CustomEvent('wp-block-hydrated', {
    detail: { blockData, element },
    bubbles: true,
  });
  element.dispatchEvent(event);
}

/**
 * Check if element is already hydrated
 */
export function isHydrated(element: HTMLElement): boolean {
  return element.hasAttribute('data-hydrated');
}

/**
 * Remove hydration markers from element
 */
export function removeHydrationMarkers(element: HTMLElement): void {
  element.removeAttribute('data-wp-hydrate');
  element.removeAttribute('data-wp-block');
  element.removeAttribute('data-wp-strategy');
  element.removeAttribute('data-hydrated');
  element.removeAttribute('data-hydrated-at');
  element.removeAttribute('data-block-name');
}

/**
 * Find all elements with hydration markers
 */
export function findHydrationElements(container: Element | Document = document): HTMLElement[] {
  return Array.from(container.querySelectorAll('[data-wp-hydrate]')) as HTMLElement[];
}

/**
 * Load hydration data from script tag
 */
export function loadHydrationData(scriptId = 'wp-hydration-data'): Map<string, BlockData> {
  const dataMap = new Map<string, BlockData>();

  if (typeof document === 'undefined') {
    return dataMap;
  }

  const scriptElement = document.getElementById(scriptId);
  if (!scriptElement || !scriptElement.textContent) {
    return dataMap;
  }

  try {
    const data = JSON.parse(scriptElement.textContent);
    Object.entries(data).forEach(([id, blockData]) => {
      dataMap.set(id, blockData as BlockData);
    });
  } catch (error) {
    console.error('[Hydration] Error parsing hydration data:', error);
  }

  return dataMap;
}

/**
 * Update hydration statistics
 */
export function updateStats(stats: HydrationStats, strategy: StrategyType, duration: number): void {
  stats.hydrated++;
  stats.totalTime += duration;
  stats.averageTime = stats.totalTime / stats.hydrated;
  stats.strategyUsage[strategy]++;
}

/**
 * Performance measurement utility
 */
export class PerformanceTimer {
  private startTime: number;
  private endTime?: number;

  constructor() {
    this.startTime = performance.now();
  }

  /**
   * Stop the timer and return duration
   */
  stop(): number {
    this.endTime = performance.now();
    return this.endTime - this.startTime;
  }

  /**
   * Get current elapsed time without stopping
   */
  elapsed(): number {
    return performance.now() - this.startTime;
  }
}

/**
 * Debounce utility for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle utility for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Priority queue for managing hydration order
 */
export class PriorityQueue<T> {
  private items: Array<{ item: T; priority: number }> = [];

  /**
   * Add item with priority
   */
  enqueue(item: T, priority: number): void {
    const newItem = { item, priority };
    let added = false;

    for (let i = 0; i < this.items.length; i++) {
      if (newItem.priority > this.items[i].priority) {
        this.items.splice(i, 0, newItem);
        added = true;
        break;
      }
    }

    if (!added) {
      this.items.push(newItem);
    }
  }

  /**
   * Remove and return highest priority item
   */
  dequeue(): T | undefined {
    const item = this.items.shift();
    return item?.item;
  }

  /**
   * Check if queue is empty
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Get queue size
   */
  size(): number {
    return this.items.length;
  }

  /**
   * Clear all items
   */
  clear(): void {
    this.items = [];
  }
}

/**
 * Validate block data structure
 */
export function validateBlockData(data: any): data is BlockData {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.blockName === 'string' &&
    typeof data.attributes === 'object' &&
    data.attributes !== null
  );
}

/**
 * Log hydration activity with consistent formatting
 */
export function logHydration(
  level: 'info' | 'warn' | 'error',
  strategy: string,
  message: string,
  data?: any,
): void {
  const prefix = `[Hydration:${strategy}]`;
  const logMessage = `${prefix} ${message}`;

  switch (level) {
    case 'info':
      if (data) {
        console.log(logMessage, data);
      } else {
        console.log(logMessage);
      }
      break;
    case 'warn':
      if (data) {
        console.warn(logMessage, data);
      } else {
        console.warn(logMessage);
      }
      break;
    case 'error':
      if (data) {
        console.error(logMessage, data);
      } else {
        console.error(logMessage);
      }
      break;
  }
} 