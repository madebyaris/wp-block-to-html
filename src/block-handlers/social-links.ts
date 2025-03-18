import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';

/**
 * Handler for the 'core/social-links' block
 */
export const socialLinksBlockHandler: BlockHandler = {
  /**
   * Transform a social links block to HTML
   * @param block Social links block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Check for custom processor
    if (options.customSocialLinksProcessor) {
      return options.customSocialLinksProcessor(block, options);
    }

    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);

    // Extract social links attributes
    const attrs = block.attrs || {};
    const iconColor = attrs.iconColor || '';
    const iconColorValue = attrs.iconColorValue || '';
    const iconBackgroundColor = attrs.iconBackgroundColor || '';
    const iconBackgroundColorValue = attrs.iconBackgroundColorValue || '';
    const size = attrs.size || 'normal';
    const layout = attrs.layout?.type || 'horizontal';

    // Process inner blocks if any
    let innerContent = '';
    if (block.innerBlocks && block.innerBlocks.length > 0) {
      // Process each social link
      innerContent = block.innerBlocks
        .map((socialLink) => {
          return processSocialLink(socialLink, options, {
            iconColor,
            iconColorValue,
            iconBackgroundColor,
            iconBackgroundColorValue,
            size,
            layout,
          });
        })
        .join('');
    } else {
      // If no inner blocks, create placeholder social links
      innerContent = generatePlaceholderSocialLinks(options.cssFramework, size, layout);
    }

    // Create the container class based on layout
    const containerClass = getSocialLinksContainerClass(layout, options.cssFramework);

    // Create the social links container
    return createElement(
      'ul',
      {
        class: `${classes} ${containerClass}`,
        'data-icon-color': iconColor,
        'data-icon-background-color': iconBackgroundColor,
        'data-size': size,
        'data-layout': layout,
      },
      innerContent,
    );
  },

  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'my-6',
      size: {
        normal: 'text-base',
        small: 'text-sm',
        large: 'text-lg',
      },
      layout: {
        horizontal: 'flex flex-row gap-2',
        vertical: 'flex flex-col gap-2',
      },
      align: {
        left: 'mr-auto',
        center: 'mx-auto',
        right: 'ml-auto',
        wide: 'max-w-screen-xl mx-auto',
        full: 'w-full',
      },
    },

    // Bootstrap mappings
    bootstrap: {
      block: 'my-4',
      size: {
        normal: '',
        small: 'btn-sm',
        large: 'btn-lg',
      },
      layout: {
        horizontal: 'd-flex flex-row gap-2',
        vertical: 'd-flex flex-column gap-2',
      },
      align: {
        left: 'float-start',
        center: 'd-block mx-auto',
        right: 'float-end',
        wide: 'container-lg',
        full: 'container-fluid',
      },
    },
  },
};

/**
 * Process a single social link block
 */
function processSocialLink(
  socialLink: Block,
  options: ConversionOptions,
  parentAttrs: {
    iconColor: string;
    iconColorValue: string;
    iconBackgroundColor: string;
    iconBackgroundColorValue: string;
    size: string;
    layout: string;
  },
): string {
  // Extract social link attributes
  const attrs = socialLink.attrs || {};
  const service = attrs.service || '';
  const url = attrs.url || '#';
  const label = attrs.label || service;

  // Get the social icon
  const icon = getSocialIcon(service);

  // Get the social link class
  const linkClass = getSocialLinkClass(service, parentAttrs.size, options.cssFramework);

  // Create inline styles for colors if provided
  let style = '';
  if (parentAttrs.iconColorValue) {
    style += `color: ${parentAttrs.iconColorValue};`;
  }
  if (parentAttrs.iconBackgroundColorValue) {
    style += `background-color: ${parentAttrs.iconBackgroundColorValue};`;
  }

  // Create the social link
  return `
    <li class="${getSocialLinkItemClass(options.cssFramework)}">
      <a href="${url}" class="${linkClass}" title="${label}" ${style ? `style="${style}"` : ''}>
        ${icon}
        <span class="${getSocialLinkLabelClass(options.cssFramework)}">${label}</span>
      </a>
    </li>
  `;
}

/**
 * Generate placeholder social links
 */
function generatePlaceholderSocialLinks(
  cssFramework?: string,
  size: string = 'normal',
  layout: string = 'horizontal',
): string {
  const socialServices = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'];

  return socialServices
    .map((service) => {
      const icon = getSocialIcon(service);
      const linkClass = getSocialLinkClass(service, size, cssFramework);

      return `
      <li class="${getSocialLinkItemClass(cssFramework)}">
        <a href="#" class="${linkClass}" title="${service}">
          ${icon}
          <span class="${getSocialLinkLabelClass(cssFramework)}">${service}</span>
        </a>
      </li>
    `;
    })
    .join('');
}

/**
 * Helper functions for CSS classes
 */
function getSocialLinksContainerClass(layout: string, cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return layout === 'horizontal'
        ? 'flex flex-row flex-wrap gap-2 list-none p-0'
        : 'flex flex-col gap-2 list-none p-0';
    case 'bootstrap':
      return layout === 'horizontal'
        ? 'd-flex flex-row flex-wrap gap-2 list-unstyled'
        : 'd-flex flex-column gap-2 list-unstyled';
    default:
      return layout === 'horizontal'
        ? 'wp-block-social-links is-layout-horizontal'
        : 'wp-block-social-links is-layout-vertical';
  }
}

function getSocialLinkItemClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'inline-block';
    case 'bootstrap':
      return '';
    default:
      return 'wp-social-link';
  }
}

function getSocialLinkClass(service: string, size: string, cssFramework?: string): string {
  const sizeClass = getSocialLinkSizeClass(size, cssFramework);

  switch (cssFramework) {
    case 'tailwind':
      return `flex items-center justify-center p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 ${sizeClass}`;
    case 'bootstrap':
      return `btn btn-dark rounded-circle d-flex align-items-center justify-content-center ${sizeClass}`;
    default:
      return `wp-social-link-${service} wp-social-link wp-social-link-${size}`;
  }
}

function getSocialLinkSizeClass(size: string, cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      switch (size) {
        case 'small':
          return 'w-8 h-8 text-sm';
        case 'large':
          return 'w-12 h-12 text-lg';
        default:
          return 'w-10 h-10 text-base';
      }
    case 'bootstrap':
      switch (size) {
        case 'small':
          return 'btn-sm';
        case 'large':
          return 'btn-lg';
        default:
          return '';
      }
    default:
      return `has-${size}-icon-size`;
  }
}

function getSocialLinkLabelClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'sr-only';
    case 'bootstrap':
      return 'visually-hidden';
    default:
      return 'wp-block-social-link-label';
  }
}

/**
 * Get a social icon SVG
 */
function getSocialIcon(service: string): string {
  // Simple SVG icons for common social services
  switch (service.toLowerCase()) {
    case 'facebook':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
      </svg>`;
    case 'twitter':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
      </svg>`;
    case 'instagram':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
      </svg>`;
    case 'linkedin':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.025a5.54 5.54 0 0 1 .025-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
      </svg>`;
    case 'youtube':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/>
      </svg>`;
    default:
      // Generic social icon
      return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm.007 12.422c-2.44 0-4.422-1.982-4.422-4.422 0-2.44 1.982-4.421 4.422-4.421 2.44 0 4.421 1.981 4.421 4.421 0 2.44-1.981 4.422-4.421 4.422z"/>
      </svg>`;
  }
}
