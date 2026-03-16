// Import media block handlers
import {
  imageBlockHandler,
  galleryBlockHandler,
  audioBlockHandler,
  videoBlockHandler,
  fileBlockHandler,
  coverBlockHandler,
  mediaTextBlockHandler,
  embedBlockHandler,
  enhancedEmbedBlockHandler,
} from '../../block-handlers';

// Export media block handlers
export {
  imageBlockHandler,
  galleryBlockHandler,
  audioBlockHandler,
  videoBlockHandler,
  fileBlockHandler,
  coverBlockHandler,
  mediaTextBlockHandler,
  embedBlockHandler,
  enhancedEmbedBlockHandler,
};

// Import registry functions
import { registerBlockHandler } from '../../core/registry';

// Function to register only media blocks
export function registerMediaBlockHandlers(): void {
  registerBlockHandler('core/image', imageBlockHandler);
  registerBlockHandler('core/gallery', galleryBlockHandler);
  registerBlockHandler('core/audio', audioBlockHandler);
  registerBlockHandler('core/video', videoBlockHandler);
  registerBlockHandler('core/file', fileBlockHandler);
  registerBlockHandler('core/cover', coverBlockHandler);
  registerBlockHandler('core/media-text', mediaTextBlockHandler);
  registerBlockHandler('core/embed', embedBlockHandler);

  // Register enhancedEmbedBlockHandler for specific providers
  // WordPress supports these providers by default
  [
    'amazon-kindle',
    'youtube',
    'vimeo',
    'twitter',
    'x',
    'wordpress',
    'wordpress-tv',
    'videopress',
    'tumblr',
    'ted',
    'instagram',
    'spotify',
    'soundcloud',
    'flickr',
    'animoto',
    'cloudup',
    'dailymotion',
    'imgur',
    'kickstarter',
    'mixcloud',
    'reddit',
    'tiktok',
    'pinterest',
    'bluesky',
    'speaker-deck',
    'smugmug',
    'slideshare',
    'scribd',
    'screencast',
    'reverbnation',
    'pocket-casts',
    'crowdsignal',
    'issuu',
    'wolfram',
  ].forEach((provider) => {
    registerBlockHandler(`core/embed-${provider}`, enhancedEmbedBlockHandler);
  });
}

// Export core types and functions for usage
export type { Block, BlockList, BlockHandler, ConversionOptions } from '../../types';
export { convertBlocks } from '../../core/converter';
