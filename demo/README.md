# WordPress Block to HTML Converter Demo

This demo application showcases the WordPress Block to HTML converter library by fetching posts from a WordPress REST API endpoint and converting Gutenberg blocks to HTML.

## Features

- Fetches posts from a WordPress REST API endpoint
- Attempts to extract raw block data from posts
- Converts Gutenberg blocks to HTML using the wp-block-to-html library
- Allows switching between different CSS frameworks (WordPress Default, Bootstrap, Tailwind)
- Displays a note indicating whether the content was converted from blocks or using pre-rendered HTML

## Getting Started

1. Make sure you have built the main library first:
   ```
   cd ..
   npm run build
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser at http://localhost:3000

## How It Works

The demo application:

1. Fetches posts from the WordPress REST API endpoint
2. For each post, attempts to fetch and parse the raw block data
3. If blocks are available, uses the wp-block-to-html library to convert them to HTML
4. If blocks are not available, falls back to using the pre-rendered HTML from WordPress
5. Displays the posts with their titles, dates, and content

You can switch between different CSS frameworks using the buttons at the top of the page.

## Notes

- The WordPress REST API may not always provide raw block data in a format that can be easily parsed
- Some posts may use the fallback to pre-rendered HTML if blocks cannot be extracted
- The demo is configured to fetch up to 5 posts at a time 