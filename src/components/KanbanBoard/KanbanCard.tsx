import React from 'react';
import { KanbanTask } from './KanbanBoard.types';
import { Avatar } from '../primitives/Avatar';
import { isOverdue, formatRelativeDate, getPriorityBadgeColor } from '@/utils/task.utils';
import clsx from 'clsx';

interface KanbanCardProps {
  task: KanbanTask;
  isDragging: boolean;
  onEdit: (task: KanbanTask) => void;
  onDelete: (taskId: string) => void;
  onDragStart: (e: React.DragEvent, task: KanbanTask, columnId: string, index: number) => void;
  onDragEnd: (e: React.DragEvent) => void;
  columnId: string;
  index: number;
}

export const KanbanCard: React.FC<KanbanCardProps> = React.memo(({
  task,
  isDragging,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  columnId,
  index,
}) => {
  const handleClick = () => {
    onEdit(task);
  };
  
  // Handle keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Space or Enter to open task for editing
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onEdit(task);
    }
    // TODO: Add arrow key navigation between cards
  };
  
  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(e, task, columnId, index);
  };
  
  const priorityLabel = task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : '';
  
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${task.title}. Status: ${columnId}. Priority: ${task.priority || 'none'}. Press space to grab.`}
      className={clsx(
        'bg-white border border-neutral-200 rounded-lg p-3 shadow-card',
        'hover:shadow-card-hover transition-all cursor-grab active:cursor-grabbing',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        isDragging && 'opacity-50 scale-95',
        task.priority && 'border-l-4'
      )}
      style={{
        borderLeftColor: task.priority === 'urgent' ? '#ef4444' :
                        task.priority === 'high' ? '#f97316' :
                        task.priority === 'medium' ? '#f59e0b' :
                        task.priority === 'low' ? '#3b82f6' : undefined,
        borderLeftWidth: task.priority ? '4px' : undefined,
      }}
    >
      {/* Header with title and priority */}
      <div className="flex items-start justify-between mb-2 gap-2">
        <h4 className="font-medium text-sm text-neutral-900 line-clamp-2 flex-1">
          {task.title}
        </h4>
        {task.priority && (
          <span className={clsx(
            'text-xs px-2 py-0.5 rounded font-medium flex-shrink-0',
            getPriorityBadgeColor(task.priority)
          )}>
            {priorityLabel}
          </span>
        )}
      </div>
      
      {/* Description */}
      {task.description && (
        <p className="text-xs text-neutral-600 mb-2 line-clamp-2">
          {task.description}
        </p>
      )}
      
      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex gap-1 flex-wrap mb-2">
          {task.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-xs bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="text-xs text-neutral-500 px-2 py-0.5">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}
      
      {/* Footer with assignee and due date */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100">
        <div className="flex items-center gap-2">
          {task.assignee && (
            <Avatar name={task.assignee} size="sm" />
          )}
        </div>
        
        {task.dueDate && (
          <div
            className={clsx(
              'text-xs font-medium',
              isOverdue(task.dueDate) ? 'text-error-600' : 'text-neutral-500'
            )}
          >
            {formatRelativeDate(task.dueDate)}
          </div>
        )}
      </div>
    </div>
  );
});

KanbanCard.displayName = 'KanbanCard';

