import { CustomClassMap } from '../types';

/**
 * Bootstrap CSS mappings for WordPress blocks
 */
export const bootstrapMapping: CustomClassMap = {
  // Text blocks
  'core/paragraph': {
    block: 'mb-4 px-0',
    align: {
      left: 'text-start',
      center: 'text-center',
      right: 'text-end',
    },
    dropCap:
      'first-letter:float-start first-letter:fs-1 first-letter:fw-bold first-letter:me-2 first-letter:mt-1',
  },

  'core/heading': {
    block: 'mt-4 mb-3',
    level: {
      1: 'h1 display-4',
      2: 'h2 display-5',
      3: 'h3 display-6',
      4: 'h4',
      5: 'h5',
      6: 'h6',
    },
    align: {
      left: 'text-start',
      center: 'text-center',
      right: 'text-end',
    },
  },

  'core/list': {
    block: 'my-4 px-0',
    ordered: 'list-group list-group-numbered ps-4',
    unordered: 'list-group ps-4',
  },

  // Media blocks
  'core/image': {
    block: 'img-fluid my-4 rounded',
    align: {
      left: 'float-start me-4 mb-3',
      center: 'mx-auto d-block',
      right: 'float-end ms-4 mb-3',
    },
    sizeSlug: {
      thumbnail: 'w-25',
      medium: 'w-50',
      large: 'w-75',
      full: 'w-100',
    },
  },

  // Layout blocks
  'core/group': {
    block: 'p-4 my-4 bg-light rounded',
  },

  'core/columns': {
    block: 'row g-4 my-4',
  },

  'core/column': {
    block: 'col p-3',
    width: {
      '25': 'col-3',
      '33.33': 'col-4',
      '50': 'col-6',
      '66.66': 'col-8',
      '75': 'col-9',
      '100': 'col-12',
    },
  },

  // Widget blocks
  'core/button': {
    block: 'btn my-3',
    style: {
      fill: 'btn-primary',
      outline: 'btn-outline-primary',
    },
    size: {
      small: 'btn-sm',
      medium: '',
      large: 'btn-lg',
    },
  },

  'core/separator': {
    block: 'border-top my-5',
    style: {
      default: '',
      wide: 'w-100',
      dots: 'border-dotted',
    },
  },

  'core/spacer': {
    block: '',
    height: {
      small: 'my-3',
      medium: 'my-4',
      large: 'my-5',
    },
  },
};
