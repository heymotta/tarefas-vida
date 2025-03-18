
import React, { useEffect, useState } from 'react';
import { Task } from '@/utils/localStorage';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface NotificationOverlayProps {
  tasks: Task[];
  onToggleComplete: (owner: 'matheus' | 'ana', taskId: string) => void;
}

const NotificationOverlay: React.FC<NotificationOverlayProps> = ({ tasks, onToggleComplete }) => {
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);
  const [importantTasks, setImportantTasks] = useState<Task[]>([]);
  const [showImportantDialog, setShowImportantDialog] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  // Check for overdue tasks when tasks change
  useEffect(() => {
    const now = Date.now();
    const allTasks = [...tasks];
    
    const overdueItems = allTasks.filter(task => 
      !task.completed && 
      task.dueDate !== undefined && 
      task.dueDate < now
    );
    
    setOverdueTasks(overdueItems);
    
    // Show toasts for newly overdue tasks
    if (overdueItems.length > 0) {
      overdueItems.forEach(task => {
        // Only show toast for tasks that have become overdue in the last minute
        // to avoid spamming the user with notifications on load
        if (now - task.dueDate! < 60000) {
          toast({
            title: "Tarefa atrasada",
            description: `"${task.text}" está atrasada.`,
            variant: "destructive",
          });
        }
      });
    }
    
    // Check for important tasks
    const importantItems = allTasks.filter(task => 
      !task.completed && 
      task.important === true
    );
    
    setImportantTasks(importantItems);
    
  }, [tasks]);
  
  // Set up interval to check for important tasks to remind about
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (importantTasks.length > 0 && !showImportantDialog) {
        // Select a random important task to remind about
        const randomIndex = Math.floor(Math.random() * importantTasks.length);
        setCurrentTask(importantTasks[randomIndex]);
        setShowImportantDialog(true);
      }
    }, 30 * 60 * 1000); // Check every 30 minutes
    
    return () => clearInterval(intervalId);
  }, [importantTasks, showImportantDialog]);
  
  const handleCompleteTask = () => {
    if (currentTask) {
      onToggleComplete(currentTask.owner, currentTask.id);
      setShowImportantDialog(false);
      setCurrentTask(null);
    }
  };
  
  return (
    <>
      {currentTask && (
        <AlertDialog open={showImportantDialog} onOpenChange={setShowImportantDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Lembrete de Tarefa Importante</AlertDialogTitle>
              <AlertDialogDescription>
                Você tem uma tarefa importante: <strong>{currentTask.text}</strong>
                {currentTask.dueDate && (
                  <p className="mt-2">
                    Data limite: {format(new Date(currentTask.dueDate), "dd 'de' MMMM", { locale: ptBR })}
                  </p>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Ignorar</AlertDialogCancel>
              <AlertDialogAction onClick={handleCompleteTask}>Completar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default NotificationOverlay;
