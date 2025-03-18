
import React from 'react';
import { Task } from '@/utils/localStorage';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onRemove: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onToggleComplete, 
  onRemove 
}) => {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground animate-fade-in">
        <p className="text-sm">Nenhuma tarefa adicionada</p>
      </div>
    );
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    // First by completion status (incomplete first)
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // Then by creation date (newest first)
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
        />
      ))}
    </div>
  );
};

export default TaskList;
