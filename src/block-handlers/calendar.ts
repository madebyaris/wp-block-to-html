import { Block, BlockHandler, ConversionOptions } from '../types';
import { getBlockClasses, createElement } from '../core/utils';

/**
 * Handler for the 'core/calendar' block
 */
export const calendarBlockHandler: BlockHandler = {
  /**
   * Transform a calendar block to HTML
   * @param block Calendar block data
   * @param options Conversion options
   * @returns HTML string or component based on options
   */
  transform(block: Block, options: ConversionOptions): string | unknown {
    // Get CSS classes based on framework
    const classes = getBlockClasses(block, this, options);
    
    // Extract calendar attributes
    const month = block.attrs?.month || new Date().getMonth() + 1;
    const year = block.attrs?.year || new Date().getFullYear();
    
    // Create a placeholder for the calendar
    // In a real implementation, this would be replaced with actual calendar data
    let content = '';
    
    // Check if we have a custom calendar processor in options
    if (options.customCalendarProcessor && typeof options.customCalendarProcessor === 'function') {
      try {
        const processedContent = options.customCalendarProcessor(block, options);
        if (processedContent) {
          return processedContent;
        }
      } catch (error) {
        console.error('Error processing calendar:', error);
      }
    }
    
    // If no custom processor or it failed, return a placeholder calendar
    content = generateCalendarPlaceholder(month, year, options.cssFramework);
    
    // Create the calendar container
    return createElement('div', { 
      class: classes,
      'data-month': month,
      'data-year': year
    }, content);
  },
  
  // CSS framework mappings
  cssMapping: {
    // Tailwind CSS mappings
    tailwind: {
      block: 'my-6',
      align: {
        left: 'mr-auto',
        center: 'mx-auto',
        right: 'ml-auto',
        wide: 'max-w-screen-xl mx-auto',
        full: 'w-full',
      },
    },
    
    // Bootstrap mappings
    bootstrap: {
      block: 'my-4',
      align: {
        left: 'float-start',
        center: 'd-block mx-auto',
        right: 'float-end',
        wide: 'container-lg',
        full: 'container-fluid',
      },
    },
  },
};

/**
 * Generate a placeholder calendar
 */
function generateCalendarPlaceholder(month: number, year: number, cssFramework?: string): string {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  
  // Get CSS classes based on framework
  const tableClass = getCalendarTableClass(cssFramework);
  const captionClass = getCalendarCaptionClass(cssFramework);
  const headerClass = getCalendarHeaderClass(cssFramework);
  const dayClass = getCalendarDayClass(cssFramework);
  const todayClass = getCalendarTodayClass(cssFramework);
  
  // Generate the calendar table
  let calendar = `
    <table class="${tableClass}">
      <caption class="${captionClass}">
        ${monthNames[month - 1]} ${year}
      </caption>
      <thead>
        <tr>
          <th class="${headerClass}">Sun</th>
          <th class="${headerClass}">Mon</th>
          <th class="${headerClass}">Tue</th>
          <th class="${headerClass}">Wed</th>
          <th class="${headerClass}">Thu</th>
          <th class="${headerClass}">Fri</th>
          <th class="${headerClass}">Sat</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  // Create the calendar days
  let day = 1;
  const today = new Date();
  const isCurrentMonth = today.getMonth() === month - 1 && today.getFullYear() === year;
  const currentDay = today.getDate();
  
  for (let i = 0; i < 6; i++) {
    let row = '<tr>';
    
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        row += `<td class="${dayClass}"></td>`;
      } else if (day > daysInMonth) {
        row += `<td class="${dayClass}"></td>`;
      } else {
        const isToday = isCurrentMonth && day === currentDay;
        const cellClass = isToday ? `${dayClass} ${todayClass}` : dayClass;
        row += `<td class="${cellClass}"><a href="#">${day}</a></td>`;
        day++;
      }
    }
    
    row += '</tr>';
    calendar += row;
    
    if (day > daysInMonth) {
      break;
    }
  }
  
  calendar += `
      </tbody>
    </table>
  `;
  
  return calendar;
}

/**
 * Helper functions for CSS classes
 */
function getCalendarTableClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'w-full border-collapse';
    case 'bootstrap':
      return 'table table-bordered';
    default:
      return 'wp-block-calendar-table';
  }
}

function getCalendarCaptionClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'text-lg font-bold mb-2 text-center';
    case 'bootstrap':
      return 'caption-top text-center fw-bold';
    default:
      return 'wp-block-calendar-caption';
  }
}

function getCalendarHeaderClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'p-2 text-center border border-gray-300 bg-gray-100';
    case 'bootstrap':
      return 'text-center bg-light';
    default:
      return 'wp-block-calendar-header';
  }
}

function getCalendarDayClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'p-2 text-center border border-gray-300';
    case 'bootstrap':
      return 'text-center';
    default:
      return 'wp-block-calendar-day';
  }
}

function getCalendarTodayClass(cssFramework?: string): string {
  switch (cssFramework) {
    case 'tailwind':
      return 'bg-blue-100';
    case 'bootstrap':
      return 'bg-primary bg-opacity-10';
    default:
      return 'wp-block-calendar-today';
  }
} 