import React from 'react';
import { KanbanBoard } from './components/KanbanBoard/KanbanBoard';
import { sampleColumns, sampleTasks } from './components/KanbanBoard/sampleData';
import { useKanbanBoard } from './hooks/useKanbanBoard';

function App() {
  const {
    columns,
    tasks,
    moveTask,
    createTask,
    updateTask,
    deleteTask,
  } = useKanbanBoard({
    initialColumns: sampleColumns,
    initialTasks: sampleTasks,
  });

  return (
    <div style={{ height: '100vh' }}>
      <KanbanBoard
        columns={columns}
        tasks={tasks}
        onTaskMove={moveTask}
        onTaskCreate={createTask}
        onTaskUpdate={updateTask}
        onTaskDelete={deleteTask}
      />
    </div>
  );
}

export default App;
