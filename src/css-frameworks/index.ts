import { CSSFramework, CustomClassMap } from '../types';
import { tailwindMapping } from './tailwind';
import { bootstrapMapping } from './bootstrap';
import { customMapping } from './custom';

/**
 * Get CSS mapping for a specific framework
 * @param framework CSS framework name
 * @returns CSS class mapping for the specified framework
 */
export function getCSSFrameworkMapping(framework: CSSFramework): CustomClassMap {
  switch (framework) {
    case 'tailwind':
      return tailwindMapping;
    case 'bootstrap':
      return bootstrapMapping;
    case 'custom':
      return customMapping;
    case 'none':
    default:
      return {};
  }
}

export { tailwindMapping, bootstrapMapping, customMapping };
