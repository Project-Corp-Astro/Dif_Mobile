/**
 * Utility functions for date formatting and manipulation
 */

/**
 * Format a date to a readable string (e.g., "Jan 15, 2023")
 * @param date - Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format a date to include time (e.g., "Jan 15, 2023, 2:30 PM")
 * @param date - Date to format
 * @returns Formatted date and time string
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
};

/**
 * Format a date to show relative time (e.g., "2 hours ago", "Yesterday", "2 days ago")
 * @param date - Date to format
 * @returns Relative time string
 */
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  // Less than a minute
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  // Less than an hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  // Less than a day
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  // Less than 2 days
  if (diffInSeconds < 172800) {
    return 'Yesterday';
  }
  
  // Less than a week
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
  
  // Default to formatted date
  return formatDate(dateObj);
};

/**
 * Get the month name from a date
 * @param date - Date object or string
 * @param short - Whether to return short month name (e.g., "Jan" vs "January")
 * @returns Month name
 */
export const getMonthName = (date: Date | string, short: boolean = false): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('en-US', {
    month: short ? 'short' : 'long',
  });
};

/**
 * Get the first and last day of a month
 * @param year - Year
 * @param month - Month (0-11)
 * @returns Object containing first and last day of month
 */
export const getMonthRange = (year: number, month: number): { firstDay: Date; lastDay: Date } => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  return { firstDay, lastDay };
};

/**
 * Format a date range (e.g., "Jan 15 - Jan 20, 2023")
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Formatted date range string
 */
export const formatDateRange = (startDate: Date | string, endDate: Date | string): string => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  // If same year
  if (start.getFullYear() === end.getFullYear()) {
    // If same month
    if (start.getMonth() === end.getMonth()) {
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' })}`;
    }
    // Different months, same year
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }
  
  // Different years
  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
};

/**
 * Check if a date is today
 * @param date - Date to check
 * @returns Boolean indicating if the date is today
 */
export const isToday = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

/**
 * Get date for the next occurrence of a specific day of week
 * @param dayOfWeek - Day of week (0-6, where 0 is Sunday)
 * @returns Date object for next occurrence
 */
export const getNextDayOfWeek = (dayOfWeek: number): Date => {
  const today = new Date();
  const currentDay = today.getDay();
  const daysUntilNext = (dayOfWeek + 7 - currentDay) % 7;
  
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + (daysUntilNext === 0 ? 7 : daysUntilNext));
  
  return nextDate;
};
