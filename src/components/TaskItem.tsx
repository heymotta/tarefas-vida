
import React, { useState } from 'react';
import { Check, Trash2, Calendar, Star, Clock } from 'lucide-react';
import { Task } from '@/utils/localStorage';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onRemove: (taskId: string) => void;
  onToggleImportance: (taskId: string) => void;
  onUpdateDueDate: (taskId: string, dueDate?: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onToggleComplete, 
  onRemove,
  onToggleImportance,
  onUpdateDueDate
}) => {
  const [date, setDate] = useState<Date | undefined>(
    task.dueDate ? new Date(task.dueDate) : undefined
  );

  const isOverdue = !task.completed && task.dueDate && task.dueDate < Date.now();
  
  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    onUpdateDueDate(task.id, date ? date.getTime() : undefined);
  };

  return (
    <div 
      className={cn(
        "task-card p-4 mb-3 flex items-center gap-3 animate-slide-in group/task",
        task.completed && "bg-secondary/50",
        isOverdue && "border-destructive/50",
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
            task.completed && "text-muted-foreground line-through",
            isOverdue && !task.completed && "text-destructive font-medium"
          )}
        >
          {task.text}
          {task.important && !task.completed && (
            <Star className="w-3 h-3 inline-block ml-1 text-primary" />
          )}
        </p>
        
        {task.dueDate && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {format(new Date(task.dueDate), "dd 'de' MMMM", { locale: ptBR })}
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0 rounded-full">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Definir data</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
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
