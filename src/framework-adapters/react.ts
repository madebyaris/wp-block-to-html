import { Block, BlockList, ConversionOptions } from '../types';
import { convertBlocks as coreConvertBlocks } from '../core/converter';
import { mergeOptions } from '../core/utils';

/**
 * Convert WordPress blocks to React-compatible format
 * This function generates a string representation of React JSX
 * for use with dangerouslySetInnerHTML or similar approaches
 * 
 * @param blockData WordPress block data
 * @param options Conversion options
 * @returns HTML string for use with React
 */
export function convertBlocksToReact(
  blockData: BlockList | Block[],
  options: ConversionOptions = {}
): string {
  // Set output format to HTML since we're generating a string
  const reactOptions = mergeOptions(options, { outputFormat: 'html' });
  
  // Use the standard converter which will return HTML string
  return coreConvertBlocks(blockData, reactOptions) as string;
}

/**
 * Interface for props that include WordPress blocks
 */
export interface WordPressBlocksProps {
  blocks: BlockList | Block[];
  options?: ConversionOptions;
  className?: string;
}

/**
 * Type for React component function
 * This is defined here to avoid direct dependency on React types
 */
type ReactComponent<P = any> = (props: P) => any;

/**
 * Create a React component that renders WordPress blocks
 * Note: This function requires React to be available in the consumer's project
 * 
 * @returns React component that renders WordPress blocks
 */
export function createReactComponent(): ReactComponent<WordPressBlocksProps> {
  return (props: WordPressBlocksProps) => {
    // This implementation is intentionally abstract to avoid direct 
    // React dependency in the main package
    
    // In a real implementation, this would:
    // 1. Import React hooks from the consumer's React instance
    // 2. Convert blocks to HTML using convertBlocksToReact
    // 3. Use dangerouslySetInnerHTML to render the content
    
    // This function is meant to be "completed" by the consumer
    // with the actual React implementation
    
    // Example implementation that consumer would use:
    // const html = convertBlocksToReact(props.blocks, props.options);
    // return React.createElement('div', { 
    //   className: props.className,
    //   dangerouslySetInnerHTML: { __html: html }
    // });
    
    throw new Error(
      'createReactComponent() requires React to be available. ' +
      'Please use this function in a React environment.'
    );
  };
}

/**
 * Convert blocks using standard HTML converter
 * This is an alias for the main convertBlocks function
 * that enforces HTML output format for React
 */
export const convertBlocksForReact = convertBlocksToReact; 