
import React from 'react';
import { Check, Trash2, Star } from 'lucide-react';
import { Task } from '@/utils/localStorage';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onRemove: (taskId: string) => void;
  onToggleImportance: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onToggleComplete, 
  onRemove,
  onToggleImportance
}) => {
  return (
    <div 
      className={cn(
        "task-card p-4 mb-3 flex items-center gap-3 animate-slide-in group/task",
        task.completed && "bg-secondary/50",
        task.important && !task.completed && "border-primary"
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
      
      <div className="flex-grow">
        <p 
          className={cn(
            "text-sm sm:text-base transition-all duration-300",
            task.completed && "text-muted-foreground line-through"
          )}
        >
          {task.text}
          {task.important && !task.completed && (
            <Star className="w-3 h-3 inline-block ml-1 text-primary" />
          )}
        </p>
      </div>
      
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 p-0 rounded-full",
            task.important ? "text-primary" : "text-muted-foreground"
          )}
          onClick={() => onToggleImportance(task.id)}
        >
          <Star className="h-4 w-4" />
          <span className="sr-only">
            {task.important ? "Remover importância" : "Marcar como importante"}
          </span>
        </Button>
        
        <button
          onClick={() => onRemove(task.id)}
          className="text-muted-foreground/50 hover:text-destructive focus-ring rounded p-1 
                     opacity-0 group-hover/task:opacity-100 transition-opacity duration-200"
          aria-label="Remove task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
