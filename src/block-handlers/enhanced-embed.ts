import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';

/**
 * Handler for enhanced embed blocks with better support for specific providers
 */
export const enhancedEmbedBlockHandler: BlockHandler = {
  /**
   * Transform an embed block to HTML with enhanced support for providers
   * @param block Embed block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);

    // Extract embed attributes
    const provider = block.attrs?.providerNameSlug || '';
    const url = block.attrs?.url || '';
    const html = block.attrs?.html || '';
    const caption = block.attrs?.caption || '';

    // Extract responsive dimensions
    const aspectRatio = block.attrs?.aspectRatio || '16:9';
    const width = block.attrs?.width || 600;
    const height = block.attrs?.height || 338;

    // If we already have pre-rendered HTML and we're respecting rendered content
    if (html && options.contentHandling === 'rendered') {
      const wrapperClasses = `${classes} wp-block-embed-${provider}`;
      return `
        <figure class="${wrapperClasses}">
          <div class="wp-block-embed__wrapper">${html}</div>
          ${caption ? `<figcaption>${caption}</figcaption>` : ''}
        </figure>
      `;
    }

    // Create enhanced embed based on provider
    let embedContent = '';

    switch (provider) {
      case 'youtube':
        embedContent = createYouTubeEmbed(url, width, height, aspectRatio);
        break;
      case 'vimeo':
        embedContent = createVimeoEmbed(url, width, height, aspectRatio);
        break;
      case 'twitter':
      case 'x':
        embedContent = createTwitterEmbed(url);
        break;
      case 'instagram':
        embedContent = createInstagramEmbed(url);
        break;
      default:
        // For unknown providers or if we have HTML already
        if (html) {
          embedContent = html;
        } else if (url) {
          // Create a basic iframe or fallback to a link
          embedContent = `
            <iframe 
              src="${url}" 
              width="${width}" 
              height="${height}" 
              frameborder="0" 
              allowfullscreen
            ></iframe>
          `;
        } else {
          embedContent = `<a href="${url}" target="_blank" rel="noopener">${url}</a>`;
        }
    }

    // Create element based on the output format
    const wrapperClasses = `${classes} wp-block-embed-${provider}`;

    const wrapperAttrs = {
      class: wrapperClasses,
      'data-provider': provider,
      'data-url': url,
      style: `aspect-ratio: ${aspectRatio.replace(':', '/')};`,
    };

    // Create the figure element
    return createElement(
      'figure',
      wrapperAttrs,
      `
        <div class="wp-block-embed__wrapper">
          ${embedContent}
        </div>
        ${caption ? `<figcaption>${caption}</figcaption>` : ''}
      `,
    );
  },

  // CSS framework class mappings
  cssMapping: {
    default: {
      block: 'wp-block-embed',
      align: {
        left: 'alignleft',
        center: 'aligncenter',
        right: 'alignright',
        wide: 'alignwide',
        full: 'alignfull',
      },
    },
    tailwind: {
      block: 'relative mb-4 overflow-hidden',
      align: {
        left: 'float-left mr-4',
        center: 'mx-auto text-center',
        right: 'float-right ml-4',
        wide: 'w-[calc(100%+4rem)] -mx-8',
        full: 'w-screen -mx-[calc((100vw-100%)/2)]',
      },
    },
    bootstrap: {
      block: 'embed-responsive mb-3',
      align: {
        left: 'float-start me-3',
        center: 'd-block mx-auto text-center',
        right: 'float-end ms-3',
        wide: 'w-100',
        full: 'w-100',
      },
    },
  },
};

/**
 * Create a responsive YouTube embed
 */
function createYouTubeEmbed(
  url: string,
  width: number,
  height: number,
  aspectRatio: string,
): string {
  // Extract YouTube video ID from URL
  const videoId = extractYouTubeVideoId(url);

  if (!videoId) {
    return `<a href="${url}" target="_blank" rel="noopener">${url}</a>`;
  }

  return `
    <div class="wp-embed-responsive" style="aspect-ratio: ${aspectRatio.replace(':', '/')};">
      <iframe 
        width="${width}" 
        height="${height}" 
        src="https://www.youtube.com/embed/${videoId}" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen
      ></iframe>
    </div>
  `;
}

/**
 * Create a responsive Vimeo embed
 */
function createVimeoEmbed(url: string, width: number, height: number, aspectRatio: string): string {
  // Extract Vimeo video ID from URL
  const videoId = extractVimeoVideoId(url);

  if (!videoId) {
    return `<a href="${url}" target="_blank" rel="noopener">${url}</a>`;
  }

  return `
    <div class="wp-embed-responsive" style="aspect-ratio: ${aspectRatio.replace(':', '/')};">
      <iframe 
        width="${width}" 
        height="${height}" 
        src="https://player.vimeo.com/video/${videoId}" 
        frameborder="0" 
        allow="autoplay; fullscreen; picture-in-picture" 
        allowfullscreen
      ></iframe>
    </div>
  `;
}

/**
 * Create a Twitter/X embed
 */
function createTwitterEmbed(url: string): string {
  // Twitter embeds usually require a script for full functionality
  // We'll create a placeholder that can be enhanced by the Twitter widget.js
  return `
    <blockquote class="twitter-tweet">
      <a href="${url}" target="_blank" rel="noopener">View Tweet</a>
    </blockquote>
    <!-- Twitter embed script would be included separately -->
  `;
}

/**
 * Create an Instagram embed
 */
function createInstagramEmbed(url: string): string {
  // Instagram embeds usually require a script for full functionality
  // We'll create a placeholder that can be enhanced by the Instagram embed.js
  return `
    <blockquote class="instagram-media">
      <a href="${url}" target="_blank" rel="noopener">View Post on Instagram</a>
    </blockquote>
    <!-- Instagram embed script would be included separately -->
  `;
}

/**
 * Extract YouTube video ID from various URL formats
 */
function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/\s]+)/i,
    /youtube\.com\/shorts\/([^&?/\s]+)/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Extract Vimeo video ID from various URL formats
 */
function extractVimeoVideoId(url: string): string | null {
  if (!url) return null;

  // Handle Vimeo URL formats
  const pattern = /vimeo\.com\/(?:video\/|channels\/[^/]+\/|groups\/[^/]+\/videos\/|)(\d+)/i;
  const match = url.match(pattern);

  if (match && match[1]) {
    return match[1];
  }

  return null;
}
