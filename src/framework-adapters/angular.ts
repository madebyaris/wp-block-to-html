import { Block, BlockList, ConversionOptions } from '../types';
import { convertBlocks as coreConvertBlocks } from '../core/converter';
import { mergeOptions } from '../core/utils';

/**
 * Convert WordPress blocks to Angular-compatible format
 * This function generates an HTML string for use with [innerHTML] property
 *
 * @param blockData WordPress block data
 * @param options Conversion options
 * @returns HTML string for use with Angular
 */
export function convertBlocksToAngular(
  blockData: BlockList | Block[],
  options: ConversionOptions = {},
): string {
  // Set output format to HTML since we're generating a string
  const angularOptions = mergeOptions(options, { outputFormat: 'html' });

  // Use the standard converter which will return HTML string
  return coreConvertBlocks(blockData, angularOptions) as string;
}

/**
 * Create an Angular injectable service for WordPress blocks
 * This is a factory function that describes how to create an Angular service
 *
 * @returns Angular service factory description
 */
export function createAngularService() {
  // This implementation is intentionally abstract to avoid direct
  // Angular dependency in the main package

  // In a real implementation, this would:
  // 1. Define an @Injectable() service class
  // 2. Provide methods to convert and render blocks

  // Example implementation that consumer would use:
  // @Injectable({
  //   providedIn: 'root'
  // })
  // export class WordPressBlocksService {
  //   convertBlocks(blocks: any[], options?: any): string {
  //     return convertBlocksToAngular(blocks, options);
  //   }
  // }

  throw new Error(
    'createAngularService() requires Angular to be available. ' +
      'Please use this function in an Angular environment.',
  );
}

/**
 * Create an Angular directive for WordPress blocks
 * This is a factory function that describes how to create an Angular directive
 *
 * @returns Angular directive factory description
 */
export function createAngularDirective() {
  // This implementation is intentionally abstract to avoid direct
  // Angular dependency in the main package

  // In a real implementation, this would:
  // 1. Define a @Directive() class
  // 2. Use Angular's ElementRef and Renderer2 to render blocks

  // Example implementation that consumer would use:
  // @Directive({
  //   selector: '[wpBlocks]'
  // })
  // export class WordPressBlocksDirective implements OnChanges {
  //   @Input() wpBlocks: any[];
  //   @Input() wpBlocksOptions: any;
  //
  //   constructor(
  //     private el: ElementRef,
  //     private renderer: Renderer2
  //   ) {}
  //
  //   ngOnChanges() {
  //     const html = convertBlocksToAngular(this.wpBlocks, this.wpBlocksOptions);
  //     this.renderer.setProperty(this.el.nativeElement, 'innerHTML', html);
  //   }
  // }

  throw new Error(
    'createAngularDirective() requires Angular to be available. ' +
      'Please use this function in an Angular environment.',
  );
}
