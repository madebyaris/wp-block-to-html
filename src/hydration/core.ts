/**
 * WordPress Block to HTML Converter - Core Hydration System
 *
 * Implements the Hybrid Configurable Strategy for progressive hydration
 * of server-side rendered WordPress blocks.
 *
 * @version 1.0.0
 */

export interface HydrationOptions {
  /** Hydration strategy to use */
  strategy?: StrategyType | StrategyType[];
  /** Root margin for viewport strategy (default: '50px') */
  rootMargin?: string;
  /** Visibility threshold for viewport strategy (default: 0.1) */
  threshold?: number;
  /** Events to listen for in interaction strategy */
  interactionEvents?: string[];
  /** Idle timeout in ms for idle strategy (default: 2000) */
  idleTimeout?: number;
  /** Maximum concurrent hydrations (default: 3) */
  maxConcurrent?: number;
  /** Custom priority function */
  prioritize?: (elements: HTMLElement[]) => HTMLElement[];
  /** Framework-specific options */
  framework?: 'react' | 'vue' | 'angular' | 'svelte';
  /** Enable debug logging */
  debug?: boolean;
}

export interface BlockData {
  /** Block type (e.g., 'core/paragraph') */
  blockName: string;
  /** Block attributes */
  attributes: Record<string, any>;
  /** Inner blocks for nested structures */
  innerBlocks?: BlockData[];
  /** Hydration metadata */
  hydrationId?: string;
  /** Framework-specific data */
  frameworkData?: Record<string, any>;
}

export interface HydrationContext {
  /** Current viewport dimensions */
  viewport: { width: number; height: number };
  /** Performance timing information */
  timing: { start: number; renderStart?: number };
  /** Active hydration queue */
  queue: Set<HTMLElement>;
  /** Hydration statistics */
  stats: HydrationStats;
}

export interface HydrationStats {
  /** Total elements hydrated */
  hydrated: number;
  /** Total hydration time in ms */
  totalTime: number;
  /** Average time per hydration */
  averageTime: number;
  /** Strategy usage counts */
  strategyUsage: Record<StrategyType, number>;
}

export type StrategyType = 'immediate' | 'viewport' | 'interaction' | 'idle';

export type HydrationCallback = (element: HTMLElement, blockData: BlockData) => Promise<void>;

/**
 * Abstract base class for hydration strategies
 */
export abstract class HydrationStrategy {
  abstract readonly name: StrategyType;

  constructor(
    protected options: HydrationOptions,
    protected context: HydrationContext,
  ) {}

  /**
   * Determine if element should be hydrated with this strategy
   */
  abstract shouldHydrate(element: HTMLElement, blockData: BlockData): boolean;

  /**
   * Setup the strategy for a set of elements
   */
  abstract setup(
    elements: HTMLElement[],
    blockDataMap: Map<HTMLElement, BlockData>,
    callback: HydrationCallback,
  ): void;

  /**
   * Cleanup strategy resources
   */
  abstract cleanup(): void;

  /**
   * Get strategy-specific priority for element
   */
  getPriority(element: HTMLElement, blockData: BlockData): number {
    return 0; // Default priority
  }
}

/**
 * Immediate hydration strategy - hydrates elements immediately
 */
export class ImmediateStrategy extends HydrationStrategy {
  readonly name: StrategyType = 'immediate';

  shouldHydrate(): boolean {
    return true; // Always applicable
  }

  setup(
    elements: HTMLElement[],
    blockDataMap: Map<HTMLElement, BlockData>,
    callback: HydrationCallback,
  ): void {
    if (this.options.debug) {
      console.log('[Hydration] ImmediateStrategy: Processing', elements.length, 'elements');
    }

    // Process all elements immediately
    elements.forEach(async (element) => {
      const blockData = blockDataMap.get(element);
      if (blockData) {
        try {
          await callback(element, blockData);
          this.context.stats.strategyUsage.immediate++;
        } catch (error) {
          console.error('[Hydration] ImmediateStrategy error:', error);
        }
      }
    });
  }

  cleanup(): void {
    // No cleanup needed for immediate strategy
  }

  getPriority(): number {
    return 10; // High priority for immediate strategy
  }
}

/**
 * Viewport hydration strategy - hydrates when elements enter viewport
 */
export class ViewportStrategy extends HydrationStrategy {
  readonly name: StrategyType = 'viewport';
  private observer?: IntersectionObserver;

  shouldHydrate(): boolean {
    return typeof IntersectionObserver !== 'undefined';
  }

  setup(
    elements: HTMLElement[],
    blockDataMap: Map<HTMLElement, BlockData>,
    callback: HydrationCallback,
  ): void {
    if (!this.shouldHydrate()) {
      if (this.options.debug) {
        console.warn('[Hydration] ViewportStrategy: IntersectionObserver not supported, skipping');
      }
      return;
    }

    if (this.options.debug) {
      console.log('[Hydration] ViewportStrategy: Setting up observer for', elements.length, 'elements');
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const blockData = blockDataMap.get(element);

            if (blockData && !this.context.queue.has(element)) {
              this.context.queue.add(element);
              try {
                await callback(element, blockData);
                this.context.stats.strategyUsage.viewport++;
                this.observer?.unobserve(element);
                this.context.queue.delete(element);
              } catch (error) {
                console.error('[Hydration] ViewportStrategy error:', error);
                this.context.queue.delete(element);
              }
            }
          }
        });
      },
      {
        rootMargin: this.options.rootMargin || '50px',
        threshold: this.options.threshold || 0.1,
      },
    );

    elements.forEach((element) => {
      this.observer?.observe(element);
    });
  }

  cleanup(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
  }

  getPriority(element: HTMLElement): number {
    // Higher priority for elements closer to viewport
    const rect = element.getBoundingClientRect();
    const viewportHeight = this.context.viewport.height;
    const distanceFromViewport = Math.max(0, rect.top - viewportHeight);

    return Math.max(1, 100 - Math.floor(distanceFromViewport / 100));
  }
}

/**
 * Interaction hydration strategy - hydrates on user interaction
 */
export class InteractionStrategy extends HydrationStrategy {
  readonly name: StrategyType = 'interaction';
  private eventListeners: Map<HTMLElement, () => void> = new Map();

  shouldHydrate(): boolean {
    return true; // Always supported
  }

  setup(
    elements: HTMLElement[],
    blockDataMap: Map<HTMLElement, BlockData>,
    callback: HydrationCallback,
  ): void {
    const events = this.options.interactionEvents || ['click', 'focusin', 'touchstart'];

    if (this.options.debug) {
      console.log('[Hydration] InteractionStrategy: Setting up listeners for', elements.length, 'elements');
    }

    elements.forEach((element) => {
      const blockData = blockDataMap.get(element);
      if (!blockData) return;

      const handleInteraction = async () => {
        if (this.context.queue.has(element)) return;

        this.context.queue.add(element);
        try {
          await callback(element, blockData);
          this.context.stats.strategyUsage.interaction++;
          this.removeEventListeners(element);
          this.context.queue.delete(element);
        } catch (error) {
          console.error('[Hydration] InteractionStrategy error:', error);
          this.context.queue.delete(element);
        }
      };

      // Add event listeners
      events.forEach((eventType) => {
        element.addEventListener(eventType, handleInteraction, { once: true, passive: true });
      });

      this.eventListeners.set(element, handleInteraction);
    });
  }

  cleanup(): void {
    this.eventListeners.forEach((handler, element) => {
      this.removeEventListeners(element);
    });
    this.eventListeners.clear();
  }

  private removeEventListeners(element: HTMLElement): void {
    const events = this.options.interactionEvents || ['click', 'focusin', 'touchstart'];
    const handler = this.eventListeners.get(element);

    if (handler) {
      events.forEach((eventType) => {
        element.removeEventListener(eventType, handler);
      });
      this.eventListeners.delete(element);
    }
  }

  getPriority(element: HTMLElement, blockData: BlockData): number {
    // Higher priority for interactive blocks
    const interactiveBlocks = ['core/button', 'core/buttons', 'core/navigation', 'core/search'];
    return interactiveBlocks.includes(blockData.blockName) ? 8 : 3;
  }
}

/**
 * Idle hydration strategy - hydrates when browser is idle
 */
export class IdleStrategy extends HydrationStrategy {
  readonly name: StrategyType = 'idle';
  private timeoutIds: Set<ReturnType<typeof setTimeout>> = new Set();

  shouldHydrate(): boolean {
    return typeof requestIdleCallback !== 'undefined' || typeof setTimeout !== 'undefined';
  }

  setup(
    elements: HTMLElement[],
    blockDataMap: Map<HTMLElement, BlockData>,
    callback: HydrationCallback,
  ): void {
    if (this.options.debug) {
      console.log('[Hydration] IdleStrategy: Scheduling hydration for', elements.length, 'elements');
    }

    elements.forEach((element) => {
      const blockData = blockDataMap.get(element);
      if (!blockData) return;

      const hydrateElement = async () => {
        if (this.context.queue.has(element)) return;

        this.context.queue.add(element);
        try {
          await callback(element, blockData);
          this.context.stats.strategyUsage.idle++;
          this.context.queue.delete(element);
        } catch (error) {
          console.error('[Hydration] IdleStrategy error:', error);
          this.context.queue.delete(element);
        }
      };

      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(hydrateElement, {
          timeout: this.options.idleTimeout || 2000,
        });
      } else {
        // Fallback to setTimeout
        const timeoutId = setTimeout(hydrateElement, this.options.idleTimeout || 2000);
        this.timeoutIds.add(timeoutId);
      }
    });
  }

  cleanup(): void {
    this.timeoutIds.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    this.timeoutIds.clear();
  }

  getPriority(): number {
    return 1; // Low priority for idle strategy
  }
}

/**
 * Strategy factory for creating hydration strategies
 */
export class StrategyFactory {
  static createStrategy(
    type: StrategyType,
    options: HydrationOptions,
    context: HydrationContext,
  ): HydrationStrategy {
    switch (type) {
      case 'immediate':
        return new ImmediateStrategy(options, context);
      case 'viewport':
        return new ViewportStrategy(options, context);
      case 'interaction':
        return new InteractionStrategy(options, context);
      case 'idle':
        return new IdleStrategy(options, context);
      default:
        throw new Error(`Unknown hydration strategy: ${type}`);
    }
  }

  static getAvailableStrategies(): StrategyType[] {
    const strategies: StrategyType[] = ['immediate'];

    if (typeof IntersectionObserver !== 'undefined') {
      strategies.push('viewport');
    }

    strategies.push('interaction');

    if (typeof requestIdleCallback !== 'undefined' || typeof setTimeout !== 'undefined') {
      strategies.push('idle');
    }

    return strategies;
  }
} 