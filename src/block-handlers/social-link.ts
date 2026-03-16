import { Block, BlockHandler, ConversionOptions } from '../types';
import { appendClassName, createElement, getBlockClasses } from '../core/utils';

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
    const renderedContent = block.innerHTML || block.innerContent.join('');

    // Skip if we don't have enough data to create a link
    if (!url && !renderedContent.includes('<a')) {
      return '';
    }

    const itemClasses = ['wp-social-link', service ? `wp-social-link-${service}` : '', classes]
      .filter(Boolean)
      .join(' ');
    const linkClasses = ['wp-block-social-link-anchor', classes].filter(Boolean).join(' ');

    if (renderedContent.trim().startsWith('<li')) {
      return appendClassName(renderedContent, classes);
    }

    if (renderedContent.includes('<a')) {
      const preservedLink = appendClassName(renderedContent, linkClasses);
      return createElement(
        'li',
        { class: itemClasses, 'data-service': service || 'custom' },
        preservedLink,
      );
    }

    // Create a link element with appropriate attributes
    const linkAttrs = {
      class: linkClasses,
      href: url,
      'aria-label': label,
      target: '_blank',
      rel: 'noopener noreferrer',
    };

    // Create the icon based on service
    const icon = getSocialIcon(service, label);

    // Create the link element
    return createElement(
      'li',
      { class: itemClasses, 'data-service': service || 'custom' },
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
    bluesky: 'Bluesky',
    youtube: 'YouTube',
    'youtube-music': 'YouTube Music',
    videopress: 'VideoPress',
    wordpress: 'WordPress',
    'wordpress-tv': 'WordPress.tv',
    github: 'GitHub',
    tumblr: 'Tumblr',
    mastodon: 'Mastodon',
    tiktok: 'TikTok',
    telegram: 'Telegram',
    reddit: 'Reddit',
    snapchat: 'Snapchat',
    whatsapp: 'WhatsApp',
    imdb: 'IMDb',
    letterboxd: 'Letterboxd',
    signal: 'Signal',
    pocketcasts: 'Pocket Casts',
    'pocket-casts': 'Pocket Casts',
    soundcloud: 'SoundCloud',
    mixcloud: 'Mixcloud',
  };

  return (
    serviceLabels[service] ||
    service
      .split(/[-_]/g)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  );
}

/**
 * Get an SVG icon for a social service
 * This function returns simple SVG icons for common services
 */
function getSocialIcon(service: string, label: string): string {
  const displayLabel = label || getDefaultServiceLabel(service || 'link');

  return `
    <svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" role="img">
      <title>${escapeHtml(displayLabel)}</title>
      <path fill="currentColor" d="M17 7h-3V4h-4v3H7v4h3v3h4v-3h3V7Zm2 12H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2V3h10v2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2Z" />
    </svg>
  `.trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
