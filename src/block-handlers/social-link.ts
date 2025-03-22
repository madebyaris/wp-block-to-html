import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';

/**
 * Handler for individual social link blocks within a social links container
 */
export const socialLinkBlockHandler: BlockHandler = {
  /**
   * Transform a social link block to HTML
   * @param block Social link block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);

    // Extract attributes
    const url = block.attrs?.url || '';
    const service = block.attrs?.service || '';
    const label = block.attrs?.label || getDefaultServiceLabel(service);

    // Skip if we don't have a URL
    if (!url) {
      return '';
    }

    // Create a link element with appropriate attributes
    const linkAttrs = {
      class: `${classes} wp-social-link-${service}`,
      href: url,
      'aria-label': label,
      target: '_blank',
      rel: 'noopener noreferrer',
    };

    // Create the icon based on service
    const icon = getSocialIcon(service);

    // Create the link element
    return createElement(
      'li',
      { class: `wp-social-link ${classes}` },
      createElement('a', linkAttrs, icon),
    );
  },

  // CSS framework class mappings
  cssMapping: {
    default: {
      block: 'wp-social-link',
    },
    tailwind: {
      block: 'inline-block m-1',
    },
    bootstrap: {
      block: 'd-inline-block m-1',
    },
  },
};

/**
 * Get a default label for a social service if none provided
 */
function getDefaultServiceLabel(service: string): string {
  const serviceLabels: Record<string, string> = {
    facebook: 'Facebook',
    twitter: 'Twitter',
    x: 'X',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    pinterest: 'Pinterest',
    youtube: 'YouTube',
    github: 'GitHub',
    tumblr: 'Tumblr',
    mastodon: 'Mastodon',
    tiktok: 'TikTok',
    telegram: 'Telegram',
    reddit: 'Reddit',
    snapchat: 'Snapchat',
    whatsapp: 'WhatsApp',
  };

  return serviceLabels[service] || service.charAt(0).toUpperCase() + service.slice(1);
}

/**
 * Get an SVG icon for a social service
 * This function returns simple SVG icons for common services
 */
function getSocialIcon(service: string): string {
  // Simple placeholder SVG for all services
  // In a real implementation, specific icons would be used
  return `<svg aria-hidden="true" focusable="false" width="24" height="24" role="img">
    <span class="screen-reader-text">${service}</span>
  </svg>`;
}
