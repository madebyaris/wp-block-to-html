import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    // Main entry point (full package with all block handlers)
    index: 'src/index.ts',
    
    // Core functionality only (no block handlers)
    core: 'src/entries/core.ts',
    
    // CSS frameworks
    'frameworks/tailwind': 'src/entries/frameworks/tailwind.ts',
    'frameworks/bootstrap': 'src/entries/frameworks/bootstrap.ts',
    
    // Block category entries
    'blocks/text': 'src/entries/blocks/text.ts',
    'blocks/media': 'src/entries/blocks/media.ts',
    'blocks/layout': 'src/entries/blocks/layout.ts',
    'blocks/widget': 'src/entries/blocks/widget.ts',
    'blocks/dynamic': 'src/entries/blocks/dynamic.ts',
    
    // SEO module
    seo: 'src/entries/seo.ts',
    
    // Streaming module for large content
    streaming: 'src/streaming/index.ts',
    
    // Incremental rendering module
    incremental: 'src/entries/incremental.ts',
    
    // Framework adapters
    react: 'src/entries/react.ts',
    vue: 'src/entries/vue.ts',
    
    // Hydration module
    hydration: 'src/hydration/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  clean: true,
  treeshake: true,
  minify: true,
  sourcemap: true,
}); 