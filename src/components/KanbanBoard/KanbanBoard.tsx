import React, { useState, useCallback } from 'react';
import { KanbanViewProps, KanbanTask } from './KanbanBoard.types';
import { KanbanColumn } from './KanbanColumn';
import { TaskModal } from './TaskModal';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import clsx from 'clsx';

export const KanbanBoard: React.FC<KanbanViewProps> = ({
  columns,
  tasks,
  onTaskMove,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
}) => {
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createColumnId, setCreateColumnId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    isDragging,
    draggedId,
    draggedFromColumn,
    draggedIndex,
    dropTargetId,
    dropIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,
  } = useDragAndDrop();
  
  const handleTaskEdit = useCallback((task: KanbanTask) => {
    setSelectedTask(task);
    setCreateColumnId(null);
    setIsModalOpen(true);
  }, []);
  
  const handleTaskCreate = useCallback((columnId: string) => {
    setSelectedTask(null);
    setCreateColumnId(columnId);
    setIsModalOpen(true);
  }, []);
  
  const handleTaskSave = useCallback((task: KanbanTask) => {
    if (selectedTask) {
      
      onTaskUpdate(task.id, task);

      
//       onTaskUpdate(task.id, {
//   title: task.title,
//   description: task.description,
//   priority: task.priority,
//   status: task.status,
//   assignee: task.assignee,
//   tags: task.tags,
//   dueDate: task.dueDate,
// });

      
    } else {
      onTaskCreate(createColumnId || columns[0].id, task);
    }
    setIsModalOpen(false);
    setSelectedTask(null);
    setCreateColumnId(null);
  }, [selectedTask, createColumnId, columns, onTaskCreate, onTaskUpdate]);
  
  const handleTaskDelete = useCallback((taskId: string) => {
    onTaskDelete(taskId);
    setIsModalOpen(false);
    setSelectedTask(null);
  }, [onTaskDelete]);
  
  const handleDragStartWrapper = useCallback((
    e: React.DragEvent,
    task: KanbanTask,
    columnId: string,
    index: number
  ) => {
    handleDragStart(task.id, columnId, index, e);
  }, [handleDragStart]);
  
  const handleDragOverWrapper = useCallback((
    e: React.DragEvent,
    columnId: string,
    index: number
  ) => {
    handleDragOver(columnId, index, e);
  }, [handleDragOver]);
  
  const handleDropWrapper = useCallback((
    e: React.DragEvent,
    columnId: string,
    index: number
  ) => {
    handleDrop(e);
    
    // Only move if we have valid drag state
    if (draggedId && draggedFromColumn !== null && draggedIndex !== null) {
      // Use the drop index if we're dropping in the target column, otherwise use the provided index
      const targetIndex = dropTargetId === columnId && dropIndex !== null ? dropIndex : index;
      onTaskMove(draggedId, draggedFromColumn, columnId, targetIndex);
    }
  }, [handleDrop, draggedId, draggedFromColumn, draggedIndex, dropTargetId, dropIndex, onTaskMove]);
  
  // Filter tasks based on search query
  // Search across title, description, tags, and assignee
  const filteredTasks = searchQuery.trim()
    ? Object.values(tasks).filter(task => {
        const query = searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query) ||
          task.tags?.some(tag => tag.toLowerCase().includes(query)) ||
          task.assignee?.toLowerCase().includes(query)
        );
      })
    : Object.values(tasks);
  
  // Get tasks for a specific column, respecting search filter
  const getTasksForColumn = useCallback((columnId: string): KanbanTask[] => {
    const column = columns.find(col => col.id === columnId);
    if (!column) return [];
    
    // Map task IDs to actual task objects
    const columnTasks = column.taskIds
      .map(id => tasks[id])
      .filter((task): task is KanbanTask => task !== undefined);
    
    // Apply search filter if active
    if (!searchQuery.trim()) {
      return columnTasks;
    }
    
    return columnTasks.filter(task => 
      filteredTasks.some(ft => ft.id === task.id)
    );
  }, [columns, tasks, searchQuery, filteredTasks]);
  
  return (
    <div className="h-full flex flex-col bg-neutral-50">
      {/* Search Bar */}
      <div className="p-4 border-b border-neutral-200 bg-white">
        <div className="max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search tasks by title, description, tags, or assignee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Search tasks"
          />
        </div>
      </div>
      
      {/* Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
        <div className="flex gap-4 h-full min-w-fit">
          {columns.map(column => {
            const columnTasks = getTasksForColumn(column.id);
            
            return (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={columnTasks}
                isDragging={isDragging}
                draggedTaskId={draggedId}
                dropTargetId={dropTargetId}
                onTaskEdit={handleTaskEdit}
                onTaskDelete={handleTaskDelete}
                onTaskCreate={handleTaskCreate}
                onDragStart={handleDragStartWrapper}
                onDragOver={handleDragOverWrapper}
                onDragEnd={handleDragEnd}
                onDrop={handleDropWrapper}
              />
            );
          })}
        </div>
      </div>
      
      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
          setCreateColumnId(null);
        }}
        task={selectedTask}
        columns={columns}
        onSave={handleTaskSave}
        onDelete={selectedTask ? handleTaskDelete : undefined}
      />
    </div>
  );
};

