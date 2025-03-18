import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';

/**
 * Handler for the 'core/embed' block
 */
export const embedBlockHandler: BlockHandler = {
  /**
   * Transform an embed block to HTML
   * @param block Embed block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Check for custom processor
    if (options.customEmbedProcessor) {
      return options.customEmbedProcessor(block, options);
    }

    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);

    // Extract embed attributes
    const attrs = block.attrs || {};
    const url = attrs.url || '';
    const caption = attrs.caption || '';
    const providerNameSlug = attrs.providerNameSlug || '';
    const type = attrs.type || '';
    const responsive = attrs.responsive !== false;
    const align = attrs.align || 'none';

    // Determine the provider based on the block name or provider slug
    const provider = getProviderFromBlock(block, providerNameSlug);

    // Generate the embed HTML
    let embedHtml = '';

    if (url) {
      // Generate embed HTML based on provider
      embedHtml = generateEmbedHtml(url, provider, responsive, options.cssFramework);
    } else {
      // Placeholder for empty embed
      embedHtml = generatePlaceholderEmbed(provider, options.cssFramework);
    }

    // Add caption if provided
    if (caption) {
      const captionClass = getCaptionClass(options.cssFramework);
      embedHtml += `<figcaption class="${captionClass}">${caption}</figcaption>`;
    }

    // Create the embed container
    return createElement(
      'figure',
      {
        class: classes,
        'data-provider': provider,
        'data-embed-type': type,
        'data-responsive': responsive ? 'true' : 'false',
      },
      embedHtml,
    );
  },

  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'my-6',
      align: {
        left: 'mr-auto',
        center: 'mx-auto',
        right: 'ml-auto',
        wide: 'max-w-screen-xl mx-auto',
        full: 'w-full',
      },
      responsive: 'w-full aspect-video',
      youtube: 'bg-red-100',
      twitter: 'bg-blue-100',
      vimeo: 'bg-blue-200',
      spotify: 'bg-green-100',
      soundcloud: 'bg-orange-100',
      flickr: 'bg-pink-100',
      animoto: 'bg-purple-100',
      cloudup: 'bg-blue-100',
      crowdsignal: 'bg-blue-100',
      dailymotion: 'bg-blue-100',
      imgur: 'bg-green-100',
      issuu: 'bg-blue-100',
      kickstarter: 'bg-green-100',
      mixcloud: 'bg-blue-100',
      pocketcasts: 'bg-red-100',
      reddit: 'bg-orange-100',
      reverbnation: 'bg-blue-100',
      screencast: 'bg-blue-100',
      scribd: 'bg-blue-100',
      smugmug: 'bg-gray-100',
      speaker: 'bg-blue-100',
      tiktok: 'bg-black',
      ted: 'bg-red-100',
      tumblr: 'bg-blue-100',
      videopress: 'bg-blue-100',
      wordpress: 'bg-blue-100',
      amazon: 'bg-yellow-100',
      pinterest: 'bg-red-100',
      wolfram: 'bg-orange-100',
      bluesky: 'bg-blue-100',
    },

    // Bootstrap mappings
    bootstrap: {
      block: 'my-4',
      align: {
        left: 'float-start',
        center: 'd-block mx-auto',
        right: 'float-end',
        wide: 'container-lg',
        full: 'container-fluid',
      },
      responsive: 'ratio ratio-16x9',
      youtube: 'bg-danger bg-opacity-10',
      twitter: 'bg-info bg-opacity-10',
      vimeo: 'bg-info bg-opacity-25',
      spotify: 'bg-success bg-opacity-10',
      soundcloud: 'bg-warning bg-opacity-10',
      flickr: 'bg-danger bg-opacity-10',
      animoto: 'bg-purple bg-opacity-10',
      cloudup: 'bg-info bg-opacity-10',
      crowdsignal: 'bg-info bg-opacity-10',
      dailymotion: 'bg-info bg-opacity-10',
      imgur: 'bg-success bg-opacity-10',
      issuu: 'bg-info bg-opacity-10',
      kickstarter: 'bg-success bg-opacity-10',
      mixcloud: 'bg-info bg-opacity-10',
      pocketcasts: 'bg-danger bg-opacity-10',
      reddit: 'bg-warning bg-opacity-10',
      reverbnation: 'bg-info bg-opacity-10',
      screencast: 'bg-info bg-opacity-10',
      scribd: 'bg-info bg-opacity-10',
      smugmug: 'bg-secondary bg-opacity-10',
      speaker: 'bg-info bg-opacity-10',
      tiktok: 'bg-dark',
      ted: 'bg-danger bg-opacity-10',
      tumblr: 'bg-info bg-opacity-10',
      videopress: 'bg-info bg-opacity-10',
      wordpress: 'bg-info bg-opacity-10',
      amazon: 'bg-warning bg-opacity-10',
      pinterest: 'bg-danger bg-opacity-10',
      wolfram: 'bg-warning bg-opacity-10',
      bluesky: 'bg-info bg-opacity-10',
    },
  },
};

/**
 * Get the provider name from the block
 */
function getProviderFromBlock(block: Block, providerNameSlug: string): string {
  // If provider slug is provided, use it
  if (providerNameSlug) {
    return providerNameSlug;
  }

  // Otherwise, try to extract from block name
  const blockName = block.blockName || '';
  const match = blockName.match(/^core-embed\/(.+)$/) || blockName.match(/^core\/embed-(.+)$/);

  if (match && match[1]) {
    return match[1];
  }

  // Default to generic embed
  return 'embed';
}

/**
 * Generate embed HTML based on provider
 */
function generateEmbedHtml(
  url: string,
  provider: string,
  responsive: boolean,
  cssFramework?: string,
): string {
  // Get responsive class based on framework
  const responsiveClass = responsive ? getResponsiveClass(cssFramework) : '';

  // Generate provider-specific embed HTML
  switch (provider) {
    case 'youtube':
      return generateYouTubeEmbed(url, responsiveClass);
    case 'twitter':
      return generateTwitterEmbed(url, responsiveClass);
    case 'vimeo':
      return generateVimeoEmbed(url, responsiveClass);
    case 'spotify':
      return generateSpotifyEmbed(url, responsiveClass);
    case 'soundcloud':
      return generateSoundCloudEmbed(url, responsiveClass);
    case 'flickr':
      return generateFlickrEmbed(url, responsiveClass);
    case 'tiktok':
      return generateTikTokEmbed(url, responsiveClass);
    case 'pinterest':
      return generatePinterestEmbed(url, responsiveClass);
    case 'amazon':
      return generateAmazonEmbed(url, responsiveClass);
    default:
      // Generic iframe embed
      return generateGenericEmbed(url, provider, responsiveClass);
  }
}

/**
 * Generate a placeholder for empty embeds
 */
function generatePlaceholderEmbed(provider: string, cssFramework?: string): string {
  const providerClass = getProviderClass(provider, cssFramework);
  const responsiveClass = getResponsiveClass(cssFramework);

  return `
    <div class="${responsiveClass} ${providerClass} flex items-center justify-center p-4 border border-gray-300 rounded">
      <div class="text-center">
        <div class="text-xl font-bold mb-2">${getProviderDisplayName(provider)} Embed</div>
        <p class="text-sm text-gray-600">Enter a URL to embed content from ${getProviderDisplayName(provider)}</p>
      </div>
    </div>
  `;
}

/**
 * Get the display name for a provider
 */
function getProviderDisplayName(provider: string): string {
  // Map of provider slugs to display names
  const displayNames: Record<string, string> = {
    youtube: 'YouTube',
    twitter: 'Twitter',
    vimeo: 'Vimeo',
    spotify: 'Spotify',
    soundcloud: 'SoundCloud',
    flickr: 'Flickr',
    animoto: 'Animoto',
    cloudup: 'Cloudup',
    crowdsignal: 'Crowdsignal',
    dailymotion: 'Dailymotion',
    imgur: 'Imgur',
    issuu: 'Issuu',
    kickstarter: 'Kickstarter',
    mixcloud: 'Mixcloud',
    pocketcasts: 'Pocket Casts',
    reddit: 'Reddit',
    reverbnation: 'ReverbNation',
    screencast: 'Screencast',
    scribd: 'Scribd',
    smugmug: 'SmugMug',
    speaker: 'Speaker Deck',
    tiktok: 'TikTok',
    ted: 'TED',
    tumblr: 'Tumblr',
    videopress: 'VideoPress',
    wordpress: 'WordPress.tv',
    amazon: 'Amazon Kindle',
    pinterest: 'Pinterest',
    wolfram: 'Wolfram',
    bluesky: 'Bluesky',
  };

  return displayNames[provider] || provider.charAt(0).toUpperCase() + provider.slice(1);
}

/**
 * Generate YouTube embed HTML
 */
function generateYouTubeEmbed(url: string, responsiveClass: string): string {
  // Extract video ID from URL
  const videoId = extractYouTubeVideoId(url);

  if (!videoId) {
    return `<div class="${responsiveClass}">Invalid YouTube URL</div>`;
  }

  return `
    <div class="${responsiveClass}">
      <iframe 
        src="https://www.youtube.com/embed/${videoId}" 
        frameborder="0" 
        allowfullscreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
    </div>
  `;
}

/**
 * Generate Twitter embed HTML
 */
function generateTwitterEmbed(url: string, responsiveClass: string): string {
  return `
    <div class="${responsiveClass}">
      <blockquote class="twitter-tweet">
        <a href="${url}">View Tweet</a>
      </blockquote>
      <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    </div>
  `;
}

/**
 * Generate Vimeo embed HTML
 */
function generateVimeoEmbed(url: string, responsiveClass: string): string {
  // Extract video ID from URL
  const videoId = extractVimeoVideoId(url);

  if (!videoId) {
    return `<div class="${responsiveClass}">Invalid Vimeo URL</div>`;
  }

  return `
    <div class="${responsiveClass}">
      <iframe 
        src="https://player.vimeo.com/video/${videoId}" 
        frameborder="0" 
        allowfullscreen
        allow="autoplay; fullscreen; picture-in-picture"
      ></iframe>
    </div>
  `;
}

/**
 * Generate Spotify embed HTML
 */
function generateSpotifyEmbed(url: string, responsiveClass: string): string {
  // Extract Spotify URI or ID
  const spotifyId = extractSpotifyId(url);
  const spotifyType = determineSpotifyType(url);

  if (!spotifyId || !spotifyType) {
    return `<div class="${responsiveClass}">Invalid Spotify URL</div>`;
  }

  return `
    <div class="${responsiveClass}">
      <iframe 
        src="https://open.spotify.com/embed/${spotifyType}/${spotifyId}" 
        frameborder="0" 
        allowtransparency="true" 
        allow="encrypted-media"
      ></iframe>
    </div>
  `;
}

/**
 * Generate SoundCloud embed HTML
 */
function generateSoundCloudEmbed(url: string, responsiveClass: string): string {
  return `
    <div class="${responsiveClass}">
      <iframe 
        src="https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true" 
        frameborder="0" 
        scrolling="no" 
        allow="autoplay"
      ></iframe>
    </div>
  `;
}

/**
 * Generate Flickr embed HTML
 */
function generateFlickrEmbed(url: string, responsiveClass: string): string {
  return `
    <div class="${responsiveClass}">
      <a data-flickr-embed="true" href="${url}" target="_blank">
        <img src="https://live.staticflickr.com/placeholder/flickr-embed.jpg" alt="Flickr embed" />
      </a>
      <script async src="https://embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>
    </div>
  `;
}

/**
 * Generate TikTok embed HTML
 */
function generateTikTokEmbed(url: string, responsiveClass: string): string {
  return `
    <div class="${responsiveClass}">
      <blockquote class="tiktok-embed" cite="${url}">
        <a href="${url}">View on TikTok</a>
      </blockquote>
      <script async src="https://www.tiktok.com/embed.js"></script>
    </div>
  `;
}

/**
 * Generate Pinterest embed HTML
 */
function generatePinterestEmbed(url: string, responsiveClass: string): string {
  return `
    <div class="${responsiveClass}">
      <a data-pin-do="embedPin" href="${url}"></a>
      <script async defer src="//assets.pinterest.com/js/pinit.js"></script>
    </div>
  `;
}

/**
 * Generate Amazon Kindle embed HTML
 */
function generateAmazonEmbed(url: string, responsiveClass: string): string {
  // Extract ASIN from URL
  const asin = extractAmazonAsin(url);

  if (!asin) {
    return `<div class="${responsiveClass}">Invalid Amazon URL</div>`;
  }

  return `
    <div class="${responsiveClass}">
      <iframe 
        type="text/html" 
        sandbox="allow-scripts allow-same-origin allow-popups" 
        width="336" 
        height="550" 
        frameborder="0" 
        allowfullscreen 
        src="https://read.amazon.com/kp/card?asin=${asin}&preview=inline&linkCode=kpe&ref_=cm_sw_r_kb_dp_EXAMPLE"
      ></iframe>
    </div>
  `;
}

/**
 * Generate generic embed HTML
 */
function generateGenericEmbed(url: string, provider: string, responsiveClass: string): string {
  const providerClass = getProviderClass(provider, 'tailwind');

  return `
    <div class="${responsiveClass} ${providerClass}">
      <iframe 
        src="${url}" 
        frameborder="0" 
        allowfullscreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
    </div>
  `;
}

/**
 * Helper functions for extracting IDs from URLs
 */
function extractYouTubeVideoId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
}

function extractVimeoVideoId(url: string): string | null {
  const regExp = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/;
  const match = url.match(regExp);
  return match ? match[5] : null;
}

function extractSpotifyId(url: string): string | null {
  const regExp = /^.*(spotify\.com\/)((track|album|playlist|artist|episode|show)\/([a-zA-Z0-9]+))/;
  const match = url.match(regExp);
  return match ? match[4] : null;
}

function determineSpotifyType(url: string): string | null {
  if (url.includes('/track/')) return 'track';
  if (url.includes('/album/')) return 'album';
  if (url.includes('/playlist/')) return 'playlist';
  if (url.includes('/artist/')) return 'artist';
  if (url.includes('/episode/')) return 'episode';
  if (url.includes('/show/')) return 'show';
  return null;
}

function extractAmazonAsin(url: string): string | null {
  const regExp = /\/dp\/([A-Z0-9]{10})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

/**
 * Helper functions for CSS classes
 */
function getResponsiveClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'relative w-full aspect-video';
    case 'bootstrap':
      return 'ratio ratio-16x9';
    default:
      return 'wp-block-embed__wrapper';
  }
}

function getProviderClass(provider: string, cssFramework?: string): string {
  if (!cssFramework) {
    return `wp-block-embed-${provider}`;
  }

  const framework = cssFramework as 'tailwind' | 'bootstrap';
  const mapping = embedBlockHandler.cssMapping?.[framework];

  if (mapping && mapping[provider]) {
    return mapping[provider] as string;
  }

  return '';
}

function getCaptionClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'text-sm text-gray-600 mt-2 text-center';
    case 'bootstrap':
      return 'figure-caption text-center mt-2';
    default:
      return 'wp-block-embed__caption';
  }
}
