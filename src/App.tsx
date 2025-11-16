import React from 'react';
import { KanbanBoard } from './components/KanbanBoard/KanbanBoard';
import { sampleColumns, sampleTasks } from './components/KanbanBoard/sampleData';

function App() {
  const handleTaskMove = (
    taskId: string,
    fromColumn: string,
    toColumn: string,
    newIndex: number
  ) => {
    console.log('Task moved:', { taskId, fromColumn, toColumn, newIndex });
  };
  
  const handleTaskCreate = (columnId: string, task: any) => {
    console.log('Task created:', { columnId, task });
  };
  
  const handleTaskUpdate = (taskId: string, updates: any) => {
    console.log('Task updated:', { taskId, updates });
  };
  
  const handleTaskDelete = (taskId: string) => {
    console.log('Task deleted:', { taskId });
  };
  
  return (
    <div style={{ height: '100vh' }}>
      <KanbanBoard
        columns={sampleColumns}
        tasks={sampleTasks}
        onTaskMove={handleTaskMove}
        onTaskCreate={handleTaskCreate}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
      />
    </div>
  );
}

export default App;


