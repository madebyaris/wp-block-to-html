import { Block, BlockList } from '../types';

/**
 * Interface for SEO metadata
 */
export interface SEOMetadata {
  /**
   * Page/post title extracted from heading blocks
   */
  title?: string;

  /**
   * Meta description extracted from content
   */
  description?: string;

  /**
   * List of images with alt text
   */
  images: {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  }[];

  /**
   * List of headings and their hierarchy
   */
  headings: {
    text: string;
    level: number;
  }[];

  /**
   * Primary keywords detected in content
   */
  keywords?: string[];

  /**
   * Approximate word count
   */
  wordCount?: number;

  /**
   * List of links found in content
   */
  links: {
    url: string;
    text: string;
    isExternal: boolean;
  }[];

  /**
   * Timestamps
   */
  timestamps?: {
    created?: string;
    modified?: string;
    published?: string;
  };

  /**
   * Whether content has schema markup
   */
  hasSchema?: boolean;

  /**
   * Raw schema JSON if present
   */
  schema?: any;

  /**
   * SEO score/analysis
   */
  analysis?: {
    score?: number;
    suggestions?: string[];
    shouldIndex?: boolean;
  };
}

/**
 * Extract SEO metadata from WordPress blocks
 * @param blocks WordPress blocks
 * @returns Extracted SEO metadata
 */
export function extractMetadata(blocks: Block[] | BlockList): SEOMetadata {
  // Normalize input to get array of blocks
  const blockArray = Array.isArray(blocks) ? blocks : blocks.blocks;

  // Initialize empty metadata
  const metadata: SEOMetadata = {
    images: [],
    headings: [],
    links: [],
  };

  // Process each block
  blockArray.forEach((block) => {
    processBlock(block, metadata);
  });

  // Generate description if none exists
  if (!metadata.description) {
    metadata.description = generateDescription(blockArray);
  }

  // Count words in content
  metadata.wordCount = countWords(blockArray);

  // Extract keywords if not already set
  if (!metadata.keywords) {
    metadata.keywords = extractKeywords(blockArray);
  }

  // Analyze SEO quality
  metadata.analysis = analyzeSEO(metadata);

  return metadata;
}

/**
 * Process a single block for metadata extraction
 * @param block WordPress block
 * @param metadata SEO metadata object to update
 */
function processBlock(block: Block, metadata: SEOMetadata): void {
  // Process based on block type
  switch (block.blockName) {
    case 'core/heading':
      processHeadingBlock(block, metadata);
      break;
    case 'core/paragraph':
      processParagraphBlock(block, metadata);
      break;
    case 'core/image':
      processImageBlock(block, metadata);
      break;
    case 'core/gallery':
      processGalleryBlock(block, metadata);
      break;
    case 'core/embed':
      processEmbedBlock(block, metadata);
      break;
    case 'core/html':
      processHTMLBlock(block, metadata);
      break;
  }

  // Process inner blocks recursively
  if (block.innerBlocks && block.innerBlocks.length > 0) {
    block.innerBlocks.forEach((innerBlock) => {
      processBlock(innerBlock, metadata);
    });
  }

  // Process content for links
  extractLinks(block, metadata);
}

/**
 * Process a heading block to extract title and heading structure
 * @param block Heading block
 * @param metadata SEO metadata object to update
 */
function processHeadingBlock(block: Block, metadata: SEOMetadata): void {
  const level = block.attrs?.level || 2;
  const content = extractTextFromBlock(block);

  if (!content) return;

  // Add to headings list
  metadata.headings.push({
    text: content,
    level: level,
  });

  // If this is an h1 or the first h2 (if no h1), use as title
  if (level === 1 || (level === 2 && !metadata.title)) {
    metadata.title = content;
  }
}

/**
 * Process a paragraph block to extract potential description
 * @param block Paragraph block
 * @param metadata SEO metadata object to update
 */
function processParagraphBlock(block: Block, metadata: SEOMetadata): void {
  // If we already have a description, skip
  if (metadata.description) return;

  const content = extractTextFromBlock(block);

  if (!content) return;

  // If this paragraph is substantial enough, use it as description
  if (content.length > 50 && !metadata.description) {
    // Limit to ~160 chars for meta description
    metadata.description = content.substring(0, 157) + (content.length > 157 ? '...' : '');
  }
}

/**
 * Process an image block to extract image metadata
 * @param block Image block
 * @param metadata SEO metadata object to update
 */
function processImageBlock(block: Block, metadata: SEOMetadata): void {
  const { url, alt, width, height } = block.attrs || {};

  if (!url) return;

  metadata.images.push({
    url,
    alt: alt || '',
    width,
    height,
  });
}

/**
 * Process a gallery block to extract image metadata
 * @param block Gallery block
 * @param metadata SEO metadata object to update
 */
function processGalleryBlock(block: Block, metadata: SEOMetadata): void {
  const images = block.attrs?.images || [];

  images.forEach((image: any) => {
    if (image.url) {
      metadata.images.push({
        url: image.url,
        alt: image.alt || '',
        width: image.width,
        height: image.height,
      });
    }
  });
}

/**
 * Process an embed block for metadata
 * @param block Embed block
 * @param metadata SEO metadata object to update
 */
function processEmbedBlock(block: Block, metadata: SEOMetadata): void {
  const { url, caption } = block.attrs || {};

  if (url) {
    // Add as a special type of link
    metadata.links.push({
      url,
      text: caption || 'Embedded content',
      isExternal: true,
    });
  }
}

/**
 * Process an HTML block to look for schema markup
 * @param block HTML block
 * @param metadata SEO metadata object to update
 */
function processHTMLBlock(block: Block, metadata: SEOMetadata): void {
  const content = block.innerContent.join('');

  // Look for JSON-LD schema
  if (content.includes('<script type="application/ld+json">')) {
    metadata.hasSchema = true;

    // Try to extract schema JSON
    try {
      const schemaMatch = content.match(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
      );
      if (schemaMatch && schemaMatch[1]) {
        metadata.schema = JSON.parse(schemaMatch[1]);
      }
    } catch (e) {
      // Schema parsing failed, but we know it exists
    }
  }
}

/**
 * Extract links from a block
 * @param block Block to process
 * @param metadata SEO metadata object to update
 */
function extractLinks(block: Block, metadata: SEOMetadata): void {
  // Join the inner content
  const content = block.innerContent.join('');

  // Look for anchor tags
  const linkRegex = /<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const url = match[1];
    const text = stripHtml(match[2]);

    if (url && text) {
      metadata.links.push({
        url,
        text,
        isExternal: isExternalUrl(url),
      });
    }
  }
}

/**
 * Check if a URL is external
 * @param url URL to check
 * @returns Whether the URL is external
 */
function isExternalUrl(url: string): boolean {
  return url.startsWith('http') || url.startsWith('//');
}

/**
 * Strip HTML tags from a string
 * @param html HTML string
 * @returns Plain text
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '');
}

/**
 * Extract text content from a block
 * @param block Block to process
 * @returns Plain text content
 */
function extractTextFromBlock(block: Block): string {
  // Join inner content
  const content = block.innerContent.join('');

  // Strip HTML
  return stripHtml(content).trim();
}

/**
 * Generate a description from blocks if none exists
 * @param blocks Array of blocks
 * @returns Generated description
 */
function generateDescription(blocks: Block[]): string {
  // Look for the first substantial paragraph
  for (const block of blocks) {
    if (block.blockName === 'core/paragraph') {
      const text = extractTextFromBlock(block);
      if (text.length >= 50) {
        return text.substring(0, 157) + (text.length > 157 ? '...' : '');
      }
    }

    // Check inner blocks recursively
    if (block.innerBlocks && block.innerBlocks.length > 0) {
      const description = generateDescription(block.innerBlocks);
      if (description) {
        return description;
      }
    }
  }

  // If no substantial paragraph, join all text content up to a limit
  let combinedText = '';

  for (const block of blocks) {
    if (combinedText.length > 200) break;

    if (['core/paragraph', 'core/heading', 'core/list'].includes(block.blockName || '')) {
      combinedText += ' ' + extractTextFromBlock(block);
    }
  }

  if (combinedText.length > 0) {
    return combinedText.trim().substring(0, 157) + (combinedText.length > 157 ? '...' : '');
  }

  return '';
}

/**
 * Count words in all text blocks
 * @param blocks Array of blocks
 * @returns Word count
 */
function countWords(blocks: Block[]): number {
  let text = '';

  // Extract text from all blocks
  blocks.forEach((block) => {
    if (
      block.blockName &&
      !block.blockName.startsWith('core/image') &&
      !block.blockName.startsWith('core/gallery')
    ) {
      text += ' ' + extractTextFromBlock(block);
    }

    // Process inner blocks recursively
    if (block.innerBlocks && block.innerBlocks.length > 0) {
      text += ' ' + extractTextFromInnerBlocks(block.innerBlocks);
    }
  });

  // Count words
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Extract text from inner blocks
 * @param blocks Array of blocks
 * @returns Combined text
 */
function extractTextFromInnerBlocks(blocks: Block[]): string {
  let text = '';

  blocks.forEach((block) => {
    if (
      block.blockName &&
      !block.blockName.startsWith('core/image') &&
      !block.blockName.startsWith('core/gallery')
    ) {
      text += ' ' + extractTextFromBlock(block);
    }

    // Process nested inner blocks recursively
    if (block.innerBlocks && block.innerBlocks.length > 0) {
      text += ' ' + extractTextFromInnerBlocks(block.innerBlocks);
    }
  });

  return text;
}

/**
 * Extract potential keywords from content
 * @param blocks Array of blocks
 * @returns Array of keywords
 */
function extractKeywords(blocks: Block[]): string[] {
  // Get all the text content
  let text = '';

  blocks.forEach((block) => {
    if (block.blockName && ['core/paragraph', 'core/heading'].includes(block.blockName)) {
      text += ' ' + extractTextFromBlock(block);
    }

    // Process inner blocks recursively
    if (block.innerBlocks && block.innerBlocks.length > 0) {
      text += ' ' + extractTextFromInnerBlocks(block.innerBlocks);
    }
  });

  // Normalize text
  text = text.toLowerCase();

  // Remove common words and count frequency
  const words = text.split(/\W+/).filter((word) => {
    return word.length > 3 && !commonWords.includes(word);
  });

  // Count word frequency
  const wordCount: Record<string, number> = {};
  words.forEach((word) => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  // Sort by frequency
  const sortedWords = Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word);

  // Return top keywords
  return sortedWords.slice(0, 10);
}

/**
 * Analyze SEO quality based on extracted metadata
 * @param metadata SEO metadata
 * @returns SEO analysis
 */
function analyzeSEO(metadata: SEOMetadata): {
  score?: number;
  suggestions?: string[];
  shouldIndex?: boolean;
} {
  const suggestions: string[] = [];
  let score = 0;

  // Title analysis
  if (metadata.title) {
    score += 10;
    if (metadata.title.length < 40) {
      score += 5;
    } else if (metadata.title.length > 60) {
      suggestions.push('Title is too long (>60 chars). Consider shortening it.');
    }
  } else {
    suggestions.push('No H1 title found. Add a clear H1 heading.');
  }

  // Description analysis
  if (metadata.description) {
    score += 10;
    if (metadata.description.length < 120) {
      suggestions.push('Description is too short (<120 chars). Add more detail.');
    } else if (metadata.description.length > 160) {
      suggestions.push('Description is too long (>160 chars). Consider shortening it.');
    } else {
      score += 5;
    }
  } else {
    suggestions.push('No meta description found. Add a descriptive paragraph near the top.');
  }

  // Image analysis
  if (metadata.images.length > 0) {
    score += 5;

    // Check for alt text
    const imagesWithAlt = metadata.images.filter((image) => image.alt && image.alt.length > 0);
    if (imagesWithAlt.length < metadata.images.length) {
      suggestions.push(
        `${metadata.images.length - imagesWithAlt.length} images missing alt text. Add descriptive alt attributes for accessibility and SEO.`,
      );
    } else {
      score += 5;
    }
  } else {
    suggestions.push('No images found. Consider adding visual content.');
  }

  // Heading structure analysis
  if (metadata.headings.length > 0) {
    score += 5;

    // Check if we have a good hierarchy
    const h1Count = metadata.headings.filter((h) => h.level === 1).length;
    if (h1Count === 0) {
      suggestions.push('No H1 heading found. Add a primary heading.');
    } else if (h1Count > 1) {
      suggestions.push('Multiple H1 headings found. Use only one H1 per page.');
    } else {
      score += 5;
    }
  } else {
    suggestions.push('No headings found. Add a proper heading structure.');
  }

  // Word count analysis
  if (metadata.wordCount) {
    if (metadata.wordCount < 300) {
      suggestions.push('Content is too short (<300 words). Add more comprehensive content.');
    } else {
      score += 10;
      if (metadata.wordCount > 1000) {
        score += 5;
      }
    }
  }

  // Schema analysis
  if (metadata.hasSchema) {
    score += 10;
  } else {
    suggestions.push('No structured data (Schema) detected. Consider adding JSON-LD markup.');
  }

  // Normalize score to 0-100
  const normalizedScore = Math.min(100, Math.max(0, score));

  // Determine if the page should be indexed based on score
  // Pages with very low scores (<30) might not be ready for indexing
  const shouldIndex = normalizedScore >= 30;

  return {
    score: normalizedScore,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
    shouldIndex,
  };
}

/**
 * List of common words to ignore in keyword extraction
 */
const commonWords = [
  'about',
  'after',
  'also',
  'another',
  'because',
  'been',
  'before',
  'being',
  'between',
  'both',
  'came',
  'come',
  'could',
  'each',
  'from',
  'have',
  'here',
  'himself',
  'into',
  'like',
  'more',
  'none',
  'only',
  'other',
  'same',
  'some',
  'such',
  'than',
  'that',
  'their',
  'them',
  'then',
  'there',
  'these',
  'they',
  'this',
  'those',
  'through',
  'under',
  'very',
  'well',
  'were',
  'what',
  'where',
  'which',
  'while',
  'with',
  'would',
  'your',
];
