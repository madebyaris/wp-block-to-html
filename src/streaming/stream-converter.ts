import { Transform, TransformCallback } from 'stream';
import { Block, BlockList, ConversionOptions, DEFAULT_OPTIONS } from '../types';
import { convertBlock } from '../core/converter';
import { mergeOptions, enhanceRenderedHTML } from '../core/utils';

/**
 * Stream transformer for processing WordPress blocks
 * Processes blocks in chunks to avoid memory issues with large content
 */
export class BlockTransformStream extends Transform {
  private options: ConversionOptions;
  private buffer: string = '';
  private isFirstChunk: boolean = true;
  private isProcessingBlocks: boolean = false;

  /**
   * Create a new BlockTransformStream
   * @param options Options for the block conversion
   */
  constructor(options: ConversionOptions = {}) {
    // Call the Transform constructor with objectMode: true
    super({
      objectMode: true,
      highWaterMark: options.streamingOptions?.highWaterMark || 16, // Default high water mark
    });

    this.options = mergeOptions(DEFAULT_OPTIONS, options);
  }

  /**
   * Process a chunk of data
   * @param chunk The chunk to process (a block or array of blocks)
   * @param encoding The encoding of the chunk (ignored in object mode)
   * @param callback The callback to call when done
   */
  _transform(
    chunk: Block | Block[] | BlockList | string,
    encoding: BufferEncoding,
    callback: TransformCallback,
  ): void {
    try {
      // If this is a string, assume it's rendered HTML
      if (typeof chunk === 'string') {
        this.processRenderedHTML(chunk, callback);
        return;
      }

      // Handle block data
      this.processBlockData(chunk, callback);
    } catch (error) {
      callback(error as Error);
    }
  }

  /**
   * Process rendered HTML content
   * @param chunk The HTML string
   * @param callback The callback to call when done
   */
  private processRenderedHTML(chunk: string, callback: TransformCallback): void {
    if (this.options.contentHandling === 'rendered') {
      // Pass through rendered HTML directly
      this.push(chunk);
      callback();
    } else if (this.options.contentHandling === 'hybrid') {
      // Enhance rendered HTML with framework classes
      const enhanced = enhanceRenderedHTML(chunk, this.options);
      this.push(enhanced);
      callback();
    } else {
      // Cannot process raw HTML as blocks
      callback(
        new Error(
          'Cannot process raw HTML in "raw" content handling mode. Provide block data instead.',
        ),
      );
    }
  }

  /**
   * Process block data
   * @param chunk Block data to process
   * @param callback The callback to call when done
   */
  private processBlockData(chunk: Block | Block[] | BlockList, callback: TransformCallback): void {
    // Set flag that we're processing blocks
    this.isProcessingBlocks = true;

    // Normalize input format
    let blocks: Block[];
    if (Array.isArray(chunk)) {
      blocks = chunk;
    } else if ('blocks' in chunk) {
      blocks = chunk.blocks;

      // If we have rendered content and the appropriate mode, use that
      if (
        this.options.contentHandling === 'rendered' &&
        'rendered' in chunk &&
        typeof chunk.rendered === 'string'
      ) {
        this.push(chunk.rendered);
        callback();
        return;
      }

      // Handle hybrid mode for rendered content
      if (
        this.options.contentHandling === 'hybrid' &&
        'rendered' in chunk &&
        typeof chunk.rendered === 'string'
      ) {
        this.push(enhanceRenderedHTML(chunk.rendered, this.options));
        callback();
        return;
      }
    } else {
      blocks = [chunk as Block];
    }

    // If no blocks, just call the callback
    if (blocks.length === 0) {
      callback();
      return;
    }

    // Process each block
    const chunkSize = this.options.streamingOptions?.chunkSize || 10;

    // Process blocks in chunks of the specified size
    for (let i = 0; i < blocks.length; i += chunkSize) {
      const blockChunk = blocks.slice(i, i + chunkSize);

      // Process this chunk of blocks
      const html = blockChunk.map((block) => convertBlock(block, this.options)).join('');

      // Push the transformed chunk
      this.push(html);
    }

    // Signal that we're done with this chunk
    callback();
  }

  /**
   * Called when all data has been processed
   * @param callback The callback to call when done
   */
  _flush(callback: TransformCallback): void {
    // Push any remaining buffered content
    if (this.buffer.length > 0) {
      this.push(this.buffer);
      this.buffer = '';
    }

    callback();
  }
}

/**
 * Create a transform stream for processing WordPress blocks
 * @param options Options for the conversion
 * @returns A transform stream that processes blocks
 */
export function createBlockStream(options: ConversionOptions = {}): Transform {
  return new BlockTransformStream(options);
}
