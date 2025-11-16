import React, { useState, useEffect } from 'react';
import { Modal } from '../primitives/Modal';
import { Button } from '../primitives/Button';
import { Avatar } from '../primitives/Avatar';
import { KanbanTask, TaskPriority, KanbanColumn } from './KanbanBoard.types';
import { formatDate } from '@/utils/task.utils';
import clsx from 'clsx';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: KanbanTask | null;
  columns: KanbanColumn[];
  onSave: (task: KanbanTask) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  columns,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState<Partial<KanbanTask>>({
    title: '',
    description: '',
    priority: 'medium',
    status: '',
    assignee: '',
    tags: [],
    dueDate: undefined,
  });
  
  const [tagInput, setTagInput] = useState('');
  
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status,
        assignee: task.assignee || '',
        tags: task.tags || [],
        dueDate: task.dueDate,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: columns[0]?.id || '',
        assignee: '',
        tags: [],
        dueDate: undefined,
      });
    }
  }, [task, columns]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title?.trim() || !formData.status) {
      return; // Could add error message here
    }
    
    // Create task object
    const taskToSave: KanbanTask = {
      id: task?.id || `task-${Date.now()}`,
      title: formData.title.trim(),
      description: formData.description?.trim(),
      priority: formData.priority,
      status: formData.status,
      assignee: formData.assignee?.trim() || undefined,
      tags: formData.tags,
      createdAt: task?.createdAt || new Date(),
      dueDate: formData.dueDate,
    };
    
    onSave(taskToSave);
    onClose();
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || [],
    }));
  };
  
  const priorities: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create New Task'}
      description={task ? 'Update task details below' : 'Fill in the details to create a new task'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
            autoFocus
          />
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        {/* Status and Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-neutral-700 mb-1">
              Status *
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              {columns.map(col => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-neutral-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as TaskPriority }))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Assignee */}
        <div>
          <label htmlFor="assignee" className="block text-sm font-medium text-neutral-700 mb-1">
            Assignee
          </label>
          <input
            id="assignee"
            type="text"
            value={formData.assignee}
            onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
            placeholder="Enter assignee name"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-neutral-700 mb-1">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              id="tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="Add a tag and press Enter"
              className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button type="button" onClick={handleAddTag} variant="secondary">
              Add
            </Button>
          </div>
          {formData.tags && formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-700 px-2 py-1 rounded text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-error-600 focus:outline-none"
                    aria-label={`Remove tag ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Due Date */}
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-neutral-700 mb-1">
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
            onChange={(e) => {
              const date = e.target.value ? new Date(e.target.value) : undefined;
              setFormData(prev => ({ ...prev, dueDate: date }));
            }}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
          <div>
            {task && onDelete && (
              <Button
                type="button"
                variant="danger"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this task?')) {
                    onDelete(task.id);
                    onClose();
                  }
                }}
              >
                Delete Task
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {task ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};


