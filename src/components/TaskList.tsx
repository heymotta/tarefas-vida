
import React from 'react';
import { Task } from '@/utils/localStorage';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onRemove: (taskId: string) => void;
  onToggleImportance: (taskId: string) => void;
  showCompleted?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onToggleComplete, 
  onRemove,
  onToggleImportance,
  showCompleted = false
}) => {
  // Filter tasks based on showCompleted flag
  const filteredTasks = showCompleted 
    ? tasks.filter(task => task.completed)
    : tasks.filter(task => !task.completed);

  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground animate-fade-in">
        <p className="text-sm">
          {showCompleted 
            ? "Nenhuma tarefa concluída" 
            : "Nenhuma tarefa adicionada"}
        </p>
      </div>
    );
  }

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // If we're showing completed tasks, sort by completion date (newest first)
    if (showCompleted) {
      return b.createdAt - a.createdAt;
    }
    
    // If not showing completed tasks:
    // First by importance (important first)
    if (a.important !== b.important) {
      return a.important ? -1 : 1;
    }
    
    // Finally by creation date (newest first)
    return b.createdAt - a.createdAt;
  });

  return (
    <div className="space-y-1">
      {sortedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onRemove={onRemove}
          onToggleImportance={onToggleImportance}
        />
      ))}
    </div>
  );
};

export default TaskList;
