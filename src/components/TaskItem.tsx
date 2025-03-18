
import React from 'react';
import { Check, Trash2 } from 'lucide-react';
import { Task } from '@/utils/localStorage';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onRemove: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onToggleComplete, 
  onRemove 
}) => {
  return (
    <div 
      className={cn(
        "task-card p-4 mb-3 flex items-center gap-3 animate-slide-in group/task",
        task.completed && "bg-secondary/50"
      )}
    >
      <button
        onClick={() => onToggleComplete(task.id)}
        className={cn(
          "w-6 h-6 flex-shrink-0 rounded-full border-2 focus-ring",
          "flex items-center justify-center transition-all duration-300",
          task.completed 
            ? "bg-primary border-primary text-primary-foreground" 
            : "border-muted-foreground/30 hover:border-primary/70"
        )}
        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {task.completed && <Check className="w-4 h-4" />}
      </button>
      
      <p 
        className={cn(
          "flex-grow text-sm sm:text-base transition-all duration-300",
          task.completed && "text-muted-foreground line-through"
        )}
      >
        {task.text}
      </p>
      
      <button
        onClick={() => onRemove(task.id)}
        className="text-muted-foreground/50 hover:text-destructive focus-ring rounded p-1 
                  opacity-0 group-hover/task:opacity-100 transition-opacity duration-200"
        aria-label="Remove task"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default TaskItem;
