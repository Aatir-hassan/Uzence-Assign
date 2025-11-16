import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { KanbanBoard } from './KanbanBoard';
import { sampleColumns, sampleTasks, generateLargeDataset } from './sampleData';
import { KanbanColumn, KanbanTask } from './KanbanBoard.types';
import { useState } from 'react';

const meta: Meta<typeof KanbanBoard> = {
  title: 'Components/KanbanBoard',
  component: KanbanBoard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A fully functional Kanban Board component with drag-and-drop, task management, and responsive design.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof KanbanBoard>;

// Wrapper component to manage state
const KanbanBoardWrapper = (args: React.ComponentProps<typeof KanbanBoard>) => {
  const [columns, setColumns] = useState(args.columns);
  const [tasks, setTasks] = useState(args.tasks);
  
  const handleTaskMove = (taskId: string, fromColumn: string, toColumn: string, newIndex: number) => {
    const task = tasks[taskId];
    if (!task) return;
    
    const fromCol = columns.find(col => col.id === fromColumn);
    const toCol = columns.find(col => col.id === toColumn);
    
    if (!fromCol || !toCol) return;
    
    const fromIndex = fromCol.taskIds.indexOf(taskId);
    if (fromIndex === -1) return;
    
    let newColumns: KanbanColumn[];
    
    if (fromColumn === toColumn) {
      const newTaskIds = [...fromCol.taskIds];
      const [removed] = newTaskIds.splice(fromIndex, 1);
      newTaskIds.splice(newIndex, 0, removed);
      
      newColumns = columns.map(col =>
        col.id === fromColumn ? { ...col, taskIds: newTaskIds } : col
      );
    } else {
      const sourceTaskIds = [...fromCol.taskIds];
      const destTaskIds = [...toCol.taskIds];
      const [removed] = sourceTaskIds.splice(fromIndex, 1);
      destTaskIds.splice(newIndex, 0, removed);
      
      newColumns = columns.map(col => {
        if (col.id === fromColumn) return { ...col, taskIds: sourceTaskIds };
        if (col.id === toColumn) return { ...col, taskIds: destTaskIds };
        return col;
      });
      
      setTasks(prev => ({
        ...prev,
        [taskId]: { ...prev[taskId], status: toColumn },
      }));
    }
    
    setColumns(newColumns);
    args.onTaskMove(taskId, fromColumn, toColumn, newIndex);
  };
  
  const handleTaskCreate = (columnId: string, task: KanbanTask) => {
    setTasks(prev => ({ ...prev, [task.id]: task }));
    setColumns(prev =>
      prev.map(col =>
        col.id === columnId ? { ...col, taskIds: [...col.taskIds, task.id] } : col
      )
    );
    args.onTaskCreate(columnId, task);
  };
  
  const handleTaskUpdate = (taskId: string, updates: Partial<KanbanTask>) => {
    setTasks(prev => ({
      ...prev,
      [taskId]: { ...prev[taskId], ...updates },
    }));
    args.onTaskUpdate(taskId, updates);
  };
  
  const handleTaskDelete = (taskId: string) => {
    const task = tasks[taskId];
    if (!task) return;
    
    setTasks(prev => {
      const newTasks = { ...prev };
      delete newTasks[taskId];
      return newTasks;
    });
    
    setColumns(prev =>
      prev.map(col => ({
        ...col,
        taskIds: col.taskIds.filter(id => id !== taskId),
      }))
    );
    
    args.onTaskDelete(taskId);
  };
  
  return (
    <div style={{ height: '100vh' }}>
      <KanbanBoard
        columns={columns}
        tasks={tasks}
        onTaskMove={handleTaskMove}
        onTaskCreate={handleTaskCreate}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
      />
    </div>
  );
};

// Default Story
export const Default: Story = {
  args: {
    columns: sampleColumns,
    tasks: sampleTasks,
    onTaskMove: fn(),
    onTaskCreate: fn(),
    onTaskUpdate: fn(),
    onTaskDelete: fn(),
  },
  render: (args) => <KanbanBoardWrapper {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Default Kanban board with sample tasks across multiple columns. Drag and drop tasks between columns or reorder within the same column.',
      },
    },
  },
};

// Empty State Story
export const Empty: Story = {
  args: {
    columns: sampleColumns.map(col => ({ ...col, taskIds: [] })),
    tasks: {},
    onTaskMove: fn(),
    onTaskCreate: fn(),
    onTaskUpdate: fn(),
    onTaskDelete: fn(),
  },
  render: (args) => <KanbanBoardWrapper {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Empty Kanban board with no tasks. Click "Add Task" buttons to create new tasks.',
      },
    },
  },
};

// Large Dataset Story
export const LargeDataset: Story = {
  args: (() => {
    const { columns, tasks } = generateLargeDataset();
    return {
      columns,
      tasks,
      onTaskMove: fn(),
      onTaskCreate: fn(),
      onTaskUpdate: fn(),
      onTaskDelete: fn(),
    };
  })(),
  render: (args) => <KanbanBoardWrapper {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Kanban board with 30+ tasks to demonstrate performance with large datasets. All drag-and-drop and interactions remain smooth.',
      },
    },
  },
};

// Different Priorities Story
export const DifferentPriorities: Story = {
  args: {
    columns: sampleColumns,
    tasks: {
      'task-1': {
        id: 'task-1',
        title: 'Urgent Task',
        description: 'This task has urgent priority',
        status: 'todo',
        priority: 'urgent',
        assignee: 'John Doe',
        tags: ['critical'],
        createdAt: new Date(),
        dueDate: new Date(Date.now() + 86400000),
      },
      'task-2': {
        id: 'task-2',
        title: 'High Priority Task',
        description: 'This task has high priority',
        status: 'todo',
        priority: 'high',
        assignee: 'Jane Smith',
        tags: ['important'],
        createdAt: new Date(),
      },
      'task-3': {
        id: 'task-3',
        title: 'Medium Priority Task',
        description: 'This task has medium priority',
        status: 'in-progress',
        priority: 'medium',
        assignee: 'Bob Johnson',
        tags: ['normal'],
        createdAt: new Date(),
      },
      'task-4': {
        id: 'task-4',
        title: 'Low Priority Task',
        description: 'This task has low priority',
        status: 'review',
        priority: 'low',
        assignee: 'Alice Williams',
        tags: ['nice-to-have'],
        createdAt: new Date(),
      },
      'task-5': {
        id: 'task-5',
        title: 'Task Without Priority',
        description: 'This task has no priority set',
        status: 'done',
        assignee: 'John Doe',
        tags: ['completed'],
        createdAt: new Date(),
      },
    },
    onTaskMove: fn(),
    onTaskCreate: fn(),
    onTaskUpdate: fn(),
    onTaskDelete: fn(),
  },
  render: (args) => <KanbanBoardWrapper {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Kanban board showcasing all priority levels: urgent (red), high (orange), medium (yellow), low (blue), and tasks without priority.',
      },
    },
  },
};

// Interactive Demo Story
export const InteractiveDemo: Story = {
  args: {
    columns: sampleColumns,
    tasks: sampleTasks,
    onTaskMove: fn(),
    onTaskCreate: fn(),
    onTaskUpdate: fn(),
    onTaskDelete: fn(),
  },
  render: (args) => <KanbanBoardWrapper {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Fully interactive Kanban board. Try dragging tasks, creating new tasks, editing existing ones, and using the search functionality.',
      },
    },
  },
};

// Mobile View Story
export const MobileView: Story = {
  args: {
    columns: sampleColumns,
    tasks: sampleTasks,
    onTaskMove: fn(),
    onTaskCreate: fn(),
    onTaskUpdate: fn(),
    onTaskDelete: fn(),
  },
  render: (args) => <KanbanBoardWrapper {...args} />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Kanban board optimized for mobile devices. Columns stack vertically and can be scrolled horizontally.',
      },
    },
  },
};

// Accessibility Story
export const Accessibility: Story = {
  args: {
    columns: sampleColumns,
    tasks: sampleTasks,
    onTaskMove: fn(),
    onTaskCreate: fn(),
    onTaskUpdate: fn(),
    onTaskDelete: fn(),
  },
  render: (args) => <KanbanBoardWrapper {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Accessibility demonstration. Use keyboard navigation: Tab to move between elements, Space/Enter to activate, Arrow keys to navigate cards, Escape to close modals.',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
};


