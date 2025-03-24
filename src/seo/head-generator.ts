/**
 * Head generator for SEO metadata
 * Generates HTML head content based on extracted SEO metadata
 */

import { SEOMetadata } from './metadata-extractor';

/**
 * Configuration options for the head generator
 */
export interface HeadGeneratorOptions {
  /** Base URL for the site, used for creating absolute URLs */
  baseUrl?: string;
  /** Site name for og:site_name */
  siteName?: string;
  /** Twitter card type, defaults to 'summary_large_image' */
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  /** Twitter site username (without @) */
  twitterSite?: string;
  /** Facebook app ID for the website */
  facebookAppId?: string;
  /** Include JSON-LD schema markup */
  includeSchema?: boolean;
  /** Include meta robots tags */
  includeRobots?: boolean;
  /** Include canonical URL */
  includeCanonical?: boolean;
  /** Whether to index the page (true for index, false for noindex) */
  shouldIndex?: boolean;
}

/**
 * Generates HTML head content based on extracted SEO metadata
 *
 * @param metadata The SEO metadata extracted from content
 * @param options Configuration options for the head generator
 * @param relativePath Optional relative path for the page (for canonical URLs)
 * @returns HTML string with meta tags for the head section
 */
function generateSEOHead(
  metadata: SEOMetadata,
  options: HeadGeneratorOptions = {},
  relativePath?: string,
): string {
  const {
    baseUrl = '',
    siteName = '',
    twitterCard = 'summary_large_image',
    twitterSite = '',
    facebookAppId = '',
    includeSchema = true,
    includeRobots = true,
    includeCanonical = true,
    shouldIndex = true,
  } = options;

  const canonicalUrl = relativePath
    ? `${baseUrl.replace(/\/$/, '')}/${relativePath.replace(/^\//, '')}`
    : baseUrl;
  const tags: string[] = [];

  // Basic meta tags
  if (metadata.title) {
    tags.push(`<title>${escapeHtml(metadata.title)}</title>`);
    tags.push(`<meta name="title" content="${escapeHtml(metadata.title)}" />`);
  }

  if (metadata.description) {
    tags.push(`<meta name="description" content="${escapeHtml(metadata.description)}" />`);
  }

  if (metadata.keywords && metadata.keywords.length > 0) {
    tags.push(`<meta name="keywords" content="${escapeHtml(metadata.keywords.join(', '))}" />`);
  }

  // Open Graph meta tags
  if (metadata.title) {
    tags.push(`<meta property="og:title" content="${escapeHtml(metadata.title)}" />`);
  }

  if (metadata.description) {
    tags.push(`<meta property="og:description" content="${escapeHtml(metadata.description)}" />`);
  }

  if (canonicalUrl) {
    tags.push(`<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`);
  }

  if (siteName) {
    tags.push(`<meta property="og:site_name" content="${escapeHtml(siteName)}" />`);
  }

  tags.push(`<meta property="og:type" content="article" />`);

  // Add Open Graph image if available
  if (metadata.images && metadata.images.length > 0) {
    const primaryImage = metadata.images[0];
    const imageUrl = primaryImage.url.startsWith('http')
      ? primaryImage.url
      : `${baseUrl.replace(/\/$/, '')}/${primaryImage.url.replace(/^\//, '')}`;

    tags.push(`<meta property="og:image" content="${escapeHtml(imageUrl)}" />`);

    if (primaryImage.alt) {
      tags.push(`<meta property="og:image:alt" content="${escapeHtml(primaryImage.alt)}" />`);
    }

    if (primaryImage.width && primaryImage.height) {
      tags.push(`<meta property="og:image:width" content="${primaryImage.width}" />`);
      tags.push(`<meta property="og:image:height" content="${primaryImage.height}" />`);
    }
  }

  // Twitter Card meta tags
  tags.push(`<meta name="twitter:card" content="${twitterCard}" />`);

  if (twitterSite) {
    tags.push(`<meta name="twitter:site" content="@${escapeHtml(twitterSite)}" />`);
  }

  if (metadata.title) {
    tags.push(`<meta name="twitter:title" content="${escapeHtml(metadata.title)}" />`);
  }

  if (metadata.description) {
    tags.push(`<meta name="twitter:description" content="${escapeHtml(metadata.description)}" />`);
  }

  if (metadata.images && metadata.images.length > 0) {
    const primaryImage = metadata.images[0];
    const imageUrl = primaryImage.url.startsWith('http')
      ? primaryImage.url
      : `${baseUrl.replace(/\/$/, '')}/${primaryImage.url.replace(/^\//, '')}`;

    tags.push(`<meta name="twitter:image" content="${escapeHtml(imageUrl)}" />`);

    if (primaryImage.alt) {
      tags.push(`<meta name="twitter:image:alt" content="${escapeHtml(primaryImage.alt)}" />`);
    }
  }

  // Facebook specific tags
  if (facebookAppId) {
    tags.push(`<meta property="fb:app_id" content="${escapeHtml(facebookAppId)}" />`);
  }

  // Canonical URL
  if (includeCanonical && canonicalUrl) {
    tags.push(`<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`);
  }

  // Robots meta
  if (includeRobots) {
    const robotsValue =
      metadata.analysis?.shouldIndex === false ? 'noindex, nofollow' : 'index, follow';
    tags.push(`<meta name="robots" content="${robotsValue}" />`);
  }

  // Schema.org JSON-LD
  if (includeSchema && metadata.schema) {
    tags.push(`<script type="application/ld+json">${JSON.stringify(metadata.schema)}</script>`);
  }

  return tags.join('\n');
}

/**
 * Escape HTML special characters in a string
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default generateSEOHead;
