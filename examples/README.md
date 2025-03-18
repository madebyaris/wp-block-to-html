# WordPress Block to HTML Examples

This directory contains examples demonstrating various features of the wp-block-to-html library.

## Rendering Modes Demo

The [render-modes.html](./render-modes.html) file demonstrates the three different rendering modes available for handling pre-rendered HTML content from WordPress:

1. **respect mode** - Uses the pre-rendered HTML exactly as provided by WordPress
2. **rebuild mode** - Extracts content from tags and rebuilds elements with our framework's classes (default)
3. **preserve-attrs mode** - Keeps the original HTML structure but adds our CSS classes to existing tags

## Running the Examples

You can run these examples by using:

```bash
# From the project root
npm run serve

# Then navigate to:
# http://localhost:3000/examples/render-modes.html
```

## Use Cases for Different Rendering Modes

- **respect mode**: When you want to preserve WordPress's exact styling and structure
  - Good for when WordPress themes have specific styling you want to maintain
  - Useful for quick migrations where preserving the exact output is important

- **rebuild mode** (default): When you want to apply your framework's styling consistently
  - Best for clean integration with your application's design system
  - Provides the most control over the final HTML output
  - Recommended for new projects with custom styling needs

- **preserve-attrs mode**: When you want to keep WordPress attributes but add your own classes
  - Useful when WordPress provides important attributes you want to preserve
  - Good for progressive enhancement of WordPress content
  - Helpful for SEO and accessibility attributes that should be maintained 