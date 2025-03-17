import { CustomClassMap } from '../types';

/**
 * Bootstrap CSS mappings for WordPress blocks
 */
export const bootstrapMapping: CustomClassMap = {
  // Text blocks
  'core/paragraph': {
    block: '',
    align: {
      left: 'text-start',
      center: 'text-center',
      right: 'text-end',
    },
    dropCap: 'first-letter:float-start first-letter:fs-1 first-letter:fw-bold first-letter:me-2',
  },
  
  'core/heading': {
    block: '',
    level: {
      1: 'h1',
      2: 'h2',
      3: 'h3',
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
    block: '',
    ordered: 'list-group list-group-numbered',
    unordered: 'list-group',
  },
  
  // Media blocks
  'core/image': {
    block: 'img-fluid',
    align: {
      left: 'float-start me-3 mb-3',
      center: 'mx-auto d-block',
      right: 'float-end ms-3 mb-3',
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
    block: 'p-3',
  },
  
  'core/columns': {
    block: 'row',
  },
  
  'core/column': {
    block: 'col p-2',
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
    block: 'btn',
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
    block: 'border-top my-4',
    style: {
      default: '',
      wide: 'w-100',
      dots: 'border-dotted',
    },
  },
  
  'core/spacer': {
    block: '',
    height: {
      small: 'my-2',
      medium: 'my-3',
      large: 'my-5',
    },
  },
}; 