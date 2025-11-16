import { KanbanColumn, KanbanTask } from './KanbanBoard.types';

export const sampleColumns: KanbanColumn[] = [
  { id: 'todo', title: 'To Do', color: '#6b7280', taskIds: ['task-1', 'task-2'], maxTasks: 10 },
  { id: 'in-progress', title: 'In Progress', color: '#3b82f6', taskIds: ['task-3'], maxTasks: 5 },
  { id: 'review', title: 'Review', color: '#f59e0b', taskIds: [], maxTasks: 3 },
  { id: 'done', title: 'Done', color: '#10b981', taskIds: ['task-4', 'task-5'] },
];

export const sampleTasks: Record<string, KanbanTask> = {
  'task-1': {
    id: 'task-1',
    title: 'Implement drag and drop',
    description: 'Add D&D functionality to kanban cards',
    status: 'todo',
    priority: 'high',
    assignee: 'John Doe',
    tags: ['frontend', 'feature'],
    createdAt: new Date(2024, 0, 10),
    dueDate: new Date(2024, 0, 20),
  },
  'task-2': {
    id: 'task-2',
    title: 'Design task modal',
    description: 'Create modal for editing task details',
    status: 'todo',
    priority: 'medium',
    assignee: 'Jane Smith',
    tags: ['design', 'ui'],
    createdAt: new Date(2024, 0, 11),
    dueDate: new Date(2024, 0, 18),
  },
  'task-3': {
    id: 'task-3',
    title: 'Setup TypeScript',
    status: 'in-progress',
    priority: 'urgent',
    assignee: 'John Doe',
    tags: ['setup', 'typescript'],
    createdAt: new Date(2024, 0, 9),
  },
  'task-4': {
    id: 'task-4',
    title: 'Create project structure',
    description: 'Setup folder structure and initial files',
    status: 'done',
    priority: 'low',
    assignee: 'Jane Smith',
    tags: ['setup'],
    createdAt: new Date(2024, 0, 8),
    dueDate: new Date(2024, 0, 9),
  },
  'task-5': {
    id: 'task-5',
    title: 'Install dependencies',
    status: 'done',
    priority: 'low',
    assignee: 'John Doe',
    tags: ['setup'],
    createdAt: new Date(2024, 0, 8),
  },
};

export const generateLargeDataset = (): { columns: KanbanColumn[]; tasks: Record<string, KanbanTask> } => {
  const columns: KanbanColumn[] = [
    { id: 'todo', title: 'To Do', color: '#6b7280', taskIds: [], maxTasks: 20 },
    { id: 'in-progress', title: 'In Progress', color: '#3b82f6', taskIds: [], maxTasks: 10 },
    { id: 'review', title: 'Review', color: '#f59e0b', taskIds: [], maxTasks: 5 },
    { id: 'done', title: 'Done', color: '#10b981', taskIds: [] },
  ];
  
  const tasks: Record<string, KanbanTask> = {};
  const priorities: Array<'low' | 'medium' | 'high' | 'urgent'> = ['low', 'medium', 'high', 'urgent'];
  const assignees = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams'];
  const tags = ['frontend', 'backend', 'design', 'testing', 'documentation', 'bugfix', 'feature'];
  
  // Generate 30 tasks
  for (let i = 1; i <= 30; i++) {
    const taskId = `task-${i}`;
    const columnIndex = Math.floor(Math.random() * columns.length);
    const column = columns[columnIndex];
    
    tasks[taskId] = {
      id: taskId,
      title: `Task ${i}: ${['Implement', 'Design', 'Fix', 'Update', 'Refactor'][Math.floor(Math.random() * 5)]} ${['feature', 'bug', 'component', 'API', 'UI'][Math.floor(Math.random() * 5)]}`,
      description: Math.random() > 0.3 ? `This is a detailed description for task ${i}. It includes multiple lines of text to test the card layout.` : undefined,
      status: column.id,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      assignee: Math.random() > 0.2 ? assignees[Math.floor(Math.random() * assignees.length)] : undefined,
      tags: tags.slice(0, Math.floor(Math.random() * 4) + 1),
      createdAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1),
      dueDate: Math.random() > 0.4 ? new Date(2024, 1, Math.floor(Math.random() * 28) + 1) : undefined,
    };
    
    column.taskIds.push(taskId);
  }
  
  return { columns, tasks };
};


