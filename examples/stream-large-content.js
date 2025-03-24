const fs = require('fs');
const { Readable } = require('stream');
const { createBlockStream } = require('../dist/streaming');

/**
 * Example of streaming a large WordPress blocks dataset
 * 
 * This example shows how to:
 * 1. Create a readable stream of blocks
 * 2. Process them in chunks using the streaming API
 * 3. Write the resulting HTML to a file
 */

// Create a function to generate lots of sample blocks
function createSampleBlocks(count) {
  const blocks = [];
  
  for (let i = 0; i < count; i++) {
    // Create alternating paragraph, heading, and image blocks
    if (i % 3 === 0) {
      blocks.push({
        blockName: 'core/paragraph',
        attrs: { align: i % 2 === 0 ? 'left' : 'right' },
        innerBlocks: [],
        innerContent: [`<p>This is paragraph ${i}</p>`],
      });
    } else if (i % 3 === 1) {
      blocks.push({
        blockName: 'core/heading',
        attrs: { level: Math.min(((i % 6) + 1), 6), align: 'center' },
        innerBlocks: [],
        innerContent: [`<h${Math.min(((i % 6) + 1), 6)}>Heading ${i}</h${Math.min(((i % 6) + 1), 6)}>`],
      });
    } else {
      blocks.push({
        blockName: 'core/image',
        attrs: {
          url: `https://picsum.photos/600/400?random=${i}`,
          alt: `Random image ${i}`,
          caption: `Image caption ${i}`,
        },
        innerBlocks: [],
        innerContent: ['<figure class="wp-block-image"><img src="https://picsum.photos/600/400" alt="Sample image" /><figcaption>A random image</figcaption></figure>'],
      });
    }
  }

  return blocks;
}

// Create a custom readable stream that feeds blocks in chunks
class BlockReadableStream extends Readable {
  constructor(blocks, chunkSize = 50) {
    super({ objectMode: true });
    this.blocks = blocks;
    this.chunkSize = chunkSize;
    this.currentPosition = 0;
  }

  _read() {
    if (this.currentPosition >= this.blocks.length) {
      this.push(null); // End of stream
      return;
    }

    const chunk = this.blocks.slice(
      this.currentPosition, 
      this.currentPosition + this.chunkSize
    );
    
    this.currentPosition += this.chunkSize;
    
    // Add small delay to simulate real-world streaming
    setTimeout(() => {
      this.push(chunk);
    }, 10);
  }
}

// Create a large set of blocks (adjust the count as needed)
const blockCount = 10000;
console.log(`Creating ${blockCount} sample blocks...`);
const blocks = createSampleBlocks(blockCount);

// Create output file stream
const outputStream = fs.createWriteStream('large-content-output.html');

// Write HTML header
outputStream.write('<!DOCTYPE html>\n<html>\n<head>\n  <title>Streamed WordPress Content</title>\n');
outputStream.write('  <meta charset="UTF-8">\n');
outputStream.write('  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n');
outputStream.write('  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">\n');
outputStream.write('</head>\n<body>\n<div class="container py-4">\n');

// Create block stream with Bootstrap styling
const blockStream = createBlockStream({
  cssFramework: 'bootstrap',
  streamingOptions: {
    chunkSize: 50, // Process 50 blocks at a time
    highWaterMark: 10, // Keep 10 objects in the buffer
  }
});

// Create and pipe the streams
console.log(`Streaming ${blockCount} blocks with a chunk size of 50...`);
console.time('Streaming completed in');

const readableBlockStream = new BlockReadableStream(blocks, 100);

// Add event listeners for progress monitoring
let processedChunks = 0;

blockStream.on('data', (chunk) => {
  processedChunks++;
  if (processedChunks % 10 === 0) {
    console.log(`Processed ${processedChunks * 50} blocks...`);
  }
});

blockStream.on('end', () => {
  // Write HTML footer
  outputStream.write('</div>\n</body>\n</html>');
  outputStream.end();
  
  console.timeEnd('Streaming completed in');
  console.log(`Output written to large-content-output.html`);
});

// Pipe everything together
readableBlockStream
  .pipe(blockStream)
  .pipe(outputStream);

// Track memory usage
const memoryInterval = setInterval(() => {
  const memoryUsage = process.memoryUsage();
  console.log(`Memory usage: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`);
}, 1000);

// Clear interval when done
blockStream.on('end', () => {
  clearInterval(memoryInterval);
}); 