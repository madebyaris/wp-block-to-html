import { CustomClassMap } from '../types';

/**
 * Basic custom CSS mappings for WordPress blocks
 * Developers can extend or modify this mapping for their own needs
 */
export const customMapping: CustomClassMap = {
  // Text blocks
  'core/paragraph': {
    block: 'margin-bottom: 1.5em; padding: 0;',
    align: {
      left: 'text-align: left;',
      center: 'text-align: center;',
      right: 'text-align: right;',
    },
    dropCap:
      'first-letter { float: left; font-size: 3em; font-weight: bold; margin-right: 0.25em; margin-top: 0.1em; }',
  },

  'core/heading': {
    block: 'margin-top: 1.2em; margin-bottom: 0.8em;',
    level: {
      1: 'font-size: 2.5em; font-weight: bold;',
      2: 'font-size: 2em; font-weight: bold;',
      3: 'font-size: 1.75em; font-weight: bold;',
      4: 'font-size: 1.5em; font-weight: bold;',
      5: 'font-size: 1.25em; font-weight: bold;',
      6: 'font-size: 1em; font-weight: bold;',
    },
    align: {
      left: 'text-align: left;',
      center: 'text-align: center;',
      right: 'text-align: right;',
    },
  },

  'core/list': {
    block: 'margin: 1em 0; padding: 0;',
    ordered: 'list-style-type: decimal; padding-left: 2em;',
    unordered: 'list-style-type: disc; padding-left: 2em;',
  },

  // Media blocks
  'core/image': {
    block: 'max-width: 100%; height: auto; margin: 1.5em 0;',
    align: {
      left: 'float: left; margin-right: 1.5em; margin-bottom: 1em;',
      center: 'margin-left: auto; margin-right: auto; display: block;',
      right: 'float: right; margin-left: 1.5em; margin-bottom: 1em;',
    },
    sizeSlug: {
      thumbnail: 'max-width: 150px;',
      medium: 'max-width: 300px;',
      large: 'max-width: 600px;',
      full: 'width: 100%;',
    },
  },

  // Layout blocks
  'core/group': {
    block: 'padding: 1.5em; margin: 1.5em 0; border-radius: 4px;',
  },

  'core/columns': {
    block: 'display: flex; flex-wrap: wrap; gap: 1em; margin: 1.5em 0;',
  },

  'core/column': {
    block: 'flex: 1; padding: 1em;',
    width: {
      '25': 'width: 25%;',
      '33.33': 'width: 33.33%;',
      '50': 'width: 50%;',
      '66.66': 'width: 66.66%;',
      '75': 'width: 75%;',
      '100': 'width: 100%;',
    },
  },

  // Widget blocks
  'core/button': {
    block:
      'display: inline-block; padding: 0.75em 1.5em; margin: 1em 0; border-radius: 4px; text-decoration: none; font-weight: 500; transition: background-color 0.2s;',
    style: {
      fill: 'background-color: #0073aa; color: white;',
      outline: 'border: 1px solid #0073aa; color: #0073aa;',
    },
    size: {
      small: 'font-size: 0.85em; padding: 0.5em 1em;',
      medium: 'font-size: 1em; padding: 0.75em 1.5em;',
      large: 'font-size: 1.15em; padding: 1em 2em;',
    },
  },

  'core/separator': {
    block: 'border-top: 1px solid; margin: 2em 0;',
    style: {
      default: 'border-color: #ddd;',
      wide: 'border-color: #ddd; width: 100%;',
      dots: 'border-style: dotted; border-color: #999;',
    },
  },

  'core/spacer': {
    block: '',
    height: {
      small: 'height: 1em; margin: 1em 0;',
      medium: 'height: 2em; margin: 1.5em 0;',
      large: 'height: 4em; margin: 2em 0;',
    },
  },
};
