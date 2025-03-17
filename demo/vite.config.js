import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        default: resolve(__dirname, 'default.html'),
        bootstrap: resolve(__dirname, 'bootstrap.html'),
        tailwind: resolve(__dirname, 'tailwind.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/wp-api': {
        target: 'https://wp.madebyaris.com/wp-json',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/wp-api/, ''),
        secure: true,
        headers: {
          Referer: 'https://wp.madebyaris.com',
          Origin: 'https://wp.madebyaris.com',
        },
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from:', req.url, proxyRes.statusCode);
          });
        },
      },
    },
  },

  resolve: {
    alias: {
      'wp-block-to-html': resolve(__dirname, '../dist/index.mjs'),
    },
  },
}); 