import { CustomClassMap } from '../types';

/**
 * Tailwind CSS mappings for WordPress blocks
 */
export const tailwindMapping: CustomClassMap = {
  // Text blocks
  'core/paragraph': {
    block: 'my-4 px-0',
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    dropCap:
      'first-letter:float-left first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:mt-1',
  },

  'core/heading': {
    block: 'mt-6 mb-4',
    level: {
      1: 'text-4xl font-bold',
      2: 'text-3xl font-bold',
      3: 'text-2xl font-bold',
      4: 'text-xl font-bold',
      5: 'text-lg font-bold',
      6: 'text-base font-bold',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },

  'core/list': {
    block: 'my-4 px-0',
    ordered: 'list-decimal pl-8 space-y-2',
    unordered: 'list-disc pl-8 space-y-2',
  },

  // Media blocks
  'core/image': {
    block: 'max-w-full h-auto my-6',
    align: {
      left: 'float-left mr-6 mb-4',
      center: 'mx-auto',
      right: 'float-right ml-6 mb-4',
    },
    sizeSlug: {
      thumbnail: 'max-w-xs',
      medium: 'max-w-md',
      large: 'max-w-lg',
      full: 'w-full',
    },
  },

  // Layout blocks
  'core/group': {
    block: 'p-6 my-6 rounded',
  },

  'core/columns': {
    block: 'flex flex-wrap gap-4 my-6',
  },

  'core/column': {
    block: 'flex-1 p-4',
    width: {
      '25': 'w-1/4',
      '33.33': 'w-1/3',
      '50': 'w-1/2',
      '66.66': 'w-2/3',
      '75': 'w-3/4',
      '100': 'w-full',
    },
  },

  // Widget blocks
  'core/button': {
    block: 'inline-block px-6 py-3 font-medium rounded transition-colors duration-200 my-4',
    style: {
      fill: 'bg-blue-600 text-white hover:bg-blue-700',
      outline: 'border border-blue-600 text-blue-600 hover:bg-blue-100',
    },
    size: {
      small: 'text-sm px-4 py-2',
      medium: 'text-base px-6 py-3',
      large: 'text-lg px-8 py-4',
    },
  },

  'core/separator': {
    block: 'border-t my-8',
    style: {
      default: 'border-gray-200',
      wide: 'border-gray-200 w-full',
      dots: 'border-dotted border-gray-400',
    },
  },

  'core/spacer': {
    block: '',
    height: {
      small: 'h-4 my-4',
      medium: 'h-8 my-6',
      large: 'h-16 my-8',
    },
  },
};
