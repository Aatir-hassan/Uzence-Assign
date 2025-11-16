import { KanbanTask, TaskPriority } from '@/components/KanbanBoard/KanbanBoard.types';

/**
 * Checks if a task is overdue
 */
export const isOverdue = (dueDate: Date): boolean => {
  return new Date() > dueDate;
};

/**
 * Gets initials from a name
 * Example: "John Doe" -> "JD"
 */
export const getInitials = (name: string): string => {
  if (!name || name.trim().length === 0) return '?';
  
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Calculates priority color classes
 */
export const getPriorityColor = (priority?: TaskPriority): string => {
  if (!priority) return '';
  
  const colors: Record<TaskPriority, string> = {
    low: 'bg-blue-100 text-blue-700 border-l-4 border-blue-500',
    medium: 'bg-yellow-100 text-yellow-700 border-l-4 border-yellow-500',
    high: 'bg-orange-100 text-orange-700 border-l-4 border-orange-500',
    urgent: 'bg-red-100 text-red-700 border-l-4 border-red-500',
  };
  
  return colors[priority];
};

/**
 * Gets priority badge color
 */
export const getPriorityBadgeColor = (priority?: TaskPriority): string => {
  if (!priority) return 'bg-neutral-100 text-neutral-600';
  
  const colors: Record<TaskPriority, string> = {
    low: 'bg-blue-50 text-blue-700',
    medium: 'bg-yellow-50 text-yellow-700',
    high: 'bg-orange-50 text-orange-700',
    urgent: 'bg-red-50 text-red-700',
  };
  
  return colors[priority];
};

/**
 * Formats a date for display
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

/**
 * Formats a date relative to now
 */
export const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} overdue`;
  } else if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else if (diffDays <= 7) {
    return `In ${diffDays} days`;
  } else {
    return formatDate(date);
  }
};

