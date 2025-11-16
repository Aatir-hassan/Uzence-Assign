import React, { useState, useRef } from 'react';
import { KanbanColumn as KanbanColumnType, KanbanTask } from './KanbanBoard.types';
import { KanbanCard } from './KanbanCard';
import { Button } from '../primitives/Button';
import { getWipWarningLevel } from '@/utils/column.utils';
import clsx from 'clsx';

interface KanbanColumnProps {
  column: KanbanColumnType;
  tasks: KanbanTask[];
  isDragging: boolean;
  draggedTaskId: string | null;
  dropTargetId: string | null;
  onTaskEdit: (task: KanbanTask) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskCreate: (columnId: string) => void;
  onDragStart: (e: React.DragEvent, task: KanbanTask, columnId: string, index: number) => void;
  onDragOver: (e: React.DragEvent, columnId: string, index: number) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, columnId: string, index: number) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = React.memo(({
  column,
  tasks,
  isDragging,
  draggedTaskId,
  dropTargetId,
  onTaskEdit,
  onTaskDelete,
  onTaskCreate,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const columnRef = useRef<HTMLDivElement>(null);
  
  const taskCount = tasks.length;
  const wipWarning = getWipWarningLevel(taskCount, column.maxTasks);
  const isWipLimitReached = column.maxTasks && taskCount >= column.maxTasks;
  
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    onDragOver(e, column.id, index);
  };
  
  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    onDrop(e, column.id, index);
  };
  
  // Handle dropping at the end of the column (empty area)
  const handleColumnDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDragging && draggedTaskId) {
      // Drop at the end of the column
      onDrop(e, column.id, tasks.length);
    }
  };
  
  // Check if this column is the current drop target
  const isDropTarget = column.id === dropTargetId;
  
  return (
    <div
      ref={columnRef}
      role="region"
      aria-label={`${column.title} column. ${taskCount} tasks.`}
      className={clsx(
        'flex flex-col h-full bg-neutral-50 rounded-lg border border-neutral-200',
        'min-w-[280px] max-w-[320px] w-full',
        isDropTarget && 'ring-2 ring-primary-500 ring-offset-2'
      )}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 bg-neutral-50 rounded-t-lg border-b border-neutral-200 p-4"
        style={{ borderTopColor: column.color, borderTopWidth: '4px' }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-neutral-900 text-sm">{column.title}</h3>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label={isCollapsed ? 'Expand column' : 'Collapse column'}
          >
            <svg
              className={clsx('w-4 h-4 text-neutral-600 transition-transform', isCollapsed && 'rotate-180')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        {/* Task count and WIP limit */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-600">
            {taskCount} {column.maxTasks ? `/ ${column.maxTasks}` : ''} task{taskCount !== 1 ? 's' : ''}
          </span>
          {column.maxTasks && (
            <span
              className={clsx(
                'px-2 py-0.5 rounded font-medium',
                wipWarning === 'error' && 'bg-error-100 text-error-700',
                wipWarning === 'warning' && 'bg-warning-100 text-warning-700',
                wipWarning === 'none' && 'bg-neutral-100 text-neutral-600'
              )}
            >
              {isWipLimitReached ? 'Limit Reached' : `${column.maxTasks - taskCount} remaining`}
            </span>
          )}
        </div>
      </div>
      
      {/* Task List */}
      {!isCollapsed && (
        <div
          className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]"
          onDragOver={handleColumnDrop}
          onDrop={handleColumnDrop}
        >
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-neutral-400 text-sm">
              <p>No tasks yet</p>
              <p className="text-xs mt-1">Drop tasks here or click "Add Task"</p>
            </div>
          ) : (
            tasks.map((task, index) => (
              <div key={task.id}>
                <div
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  className={clsx(
                    'transition-all',
                    isDropTarget && index === (tasks.length - 1) && 'pb-2'
                  )}
                >
                  {isDropTarget && index === 0 && (
                    <div className="h-1 bg-primary-500 rounded mb-2 animate-pulse" />
                  )}
                  <KanbanCard
                    task={task}
                    isDragging={isDragging && draggedTaskId === task.id}
                    onEdit={onTaskEdit}
                    onDelete={onTaskDelete}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    columnId={column.id}
                    index={index}
                  />
                  {isDropTarget && index < tasks.length - 1 && (
                    <div className="h-1 bg-primary-500 rounded mt-2 animate-pulse" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      {/* Add Task Button */}
      {!isCollapsed && (
        <div className="p-4 border-t border-neutral-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onTaskCreate(column.id)}
            className="w-full"
            disabled={isWipLimitReached}
          >
            + Add Task
          </Button>
        </div>
      )}
    </div>
  );
});

KanbanColumn.displayName = 'KanbanColumn';

