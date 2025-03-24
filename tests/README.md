# WP Block to HTML Tests

This directory contains automated tests for the WP Block to HTML library, focusing on core functionality and optimization features.

## Running Tests

To run the tests, use the following command:

```bash
npm test
```

This will run all tests using Jest. To run a specific test file, you can use:

```bash
npm test -- tests/ssr-optimizations.test.js
```

## Test Structure

The test suite is organized into the following categories:

### Core Functionality Tests

Tests that verify the basic functionality of converting WordPress blocks to HTML.

### SSR Optimization Tests

Tests that verify the server-side rendering optimization features:

- `lazyLoadMedia`: Verifies that images and iframes are properly lazy-loaded
- `preserveFirstImage`: Confirms that the first image is not lazy-loaded when this option is enabled
- `optimizationDepth`: Tests that the optimization is applied to the correct depth of nested blocks
- `prioritizeAboveTheFold`: Checks that content is properly prioritized
- `criticalPathOnly` and `deferNonCritical`: Verifies critical path rendering and deferral
- `preconnect`: Tests that preconnect links are properly generated
- `removeDuplicateStyles`: Confirms that duplicate styles are consolidated
- `minifyOutput`: Verifies HTML minification

### Framework Integration Tests

Tests for framework-specific integrations and optimizations.

## Adding New Tests

When adding new tests, follow these guidelines:

1. Create a new test file with a descriptive name ending in `.test.js`
2. Import the necessary functions from the library
3. Structure tests using `describe` and `test` blocks
4. Use meaningful test descriptions that explain what is being tested
5. Include both positive tests (feature works) and negative tests (feature disabled)
6. For SSR features, test both the individual feature and interactions with other features

Example test structure:

```javascript
const { convertBlocksToHTML } = require('../dist/index.js');

describe('Feature Name', () => {
  test('should work when enabled', () => {
    // Test implementation
    expect(result).toContain('expected-output');
  });
  
  test('should not be applied when disabled', () => {
    // Test implementation
    expect(result).not.toContain('expected-output');
  });
});
```

## Test Data

Test data is typically shared with the benchmarking suite and located in the `benchmarks/data` directory. This includes:

- `small-post.json`: A simple post with a few blocks
- `medium-post.json`: A moderately complex post with more blocks
- `large-post.json`: A complex post with many nested blocks

For specialized tests, you can create additional test data directly in the test file or add new files to the `tests/data` directory if needed.

## Test Coverage

We aim to maintain high test coverage for all features. When adding new features, please ensure:

1. Each feature has dedicated test cases
2. Edge cases are covered
3. Interactions with other features are tested where relevant

To check test coverage, run:

```bash
npm run test:coverage
``` 