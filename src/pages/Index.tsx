
import React, { useEffect, useState } from 'react';
import { addTask, loadTasks, removeTask, saveTasks, TasksState, toggleTaskCompletion, toggleTaskImportance } from '@/utils/localStorage';
import TaskList from '@/components/TaskList';
import AddTaskForm from '@/components/AddTaskForm';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import TaskTabs from '@/components/TaskTabs';
import NotificationOverlay from '@/components/NotificationOverlay';

const Index = () => {
  const [tasks, setTasks] = useState<TasksState>({ matheus: [], ana: [] });
  const [initialLoad, setInitialLoad] = useState(true);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = loadTasks();
    setTasks(savedTasks);
    setInitialLoad(false);
  }, []);

  // Save tasks to localStorage whenever they change (except on initial load)
  useEffect(() => {
    if (!initialLoad) {
      saveTasks(tasks);
    }
  }, [tasks, initialLoad]);

  const handleAddTask = (owner: 'matheus' | 'ana', text: string, important: boolean = false) => {
    const updatedTasks = addTask(tasks, owner, text, important);
    setTasks(updatedTasks);
    toast({
      description: `Tarefa adicionada para ${owner === 'matheus' ? 'Matheus' : 'Ana'}.`,
    });
  };

  const handleRemoveTask = (owner: 'matheus' | 'ana', taskId: string) => {
    const updatedTasks = removeTask(tasks, owner, taskId);
    setTasks(updatedTasks);
    toast({
      description: 'Tarefa removida.',
      variant: 'destructive',
    });
  };

  const handleToggleComplete = (owner: 'matheus' | 'ana', taskId: string) => {
    const updatedTasks = toggleTaskCompletion(tasks, owner, taskId);
    setTasks(updatedTasks);
  };
  
  const handleToggleImportance = (owner: 'matheus' | 'ana', taskId: string) => {
    const updatedTasks = toggleTaskImportance(tasks, owner, taskId);
    setTasks(updatedTasks);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/50 px-4 dark:from-background dark:to-secondary/10">
      <div className="max-w-4xl mx-auto py-8 sm:py-12">
        <header className="text-center mb-12 animate-fade-in flex flex-col items-center">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Tarefas do Casal
          </h1>
        </header>
        
        <NotificationOverlay 
          tasks={[...tasks.matheus, ...tasks.ana]}
          onToggleComplete={handleToggleComplete}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Matheus's section */}
          <PersonSection 
            name="matheus"
            displayName="Matheus"
            tasks={tasks.matheus}
            onAddTask={(text, important) => handleAddTask('matheus', text, important)}
            onRemoveTask={(taskId) => handleRemoveTask('matheus', taskId)}
            onToggleComplete={(taskId) => handleToggleComplete('matheus', taskId)}
            onToggleImportance={(taskId) => handleToggleImportance('matheus', taskId)}
          />
          
          {/* Ana's section */}
          <PersonSection 
            name="ana"
            displayName="Ana"
            tasks={tasks.ana}
            onAddTask={(text, important) => handleAddTask('ana', text, important)}
            onRemoveTask={(taskId) => handleRemoveTask('ana', taskId)}
            onToggleComplete={(taskId) => handleToggleComplete('ana', taskId)}
            onToggleImportance={(taskId) => handleToggleImportance('ana', taskId)}
          />
        </div>

        <footer className="mt-16 text-center text-xs text-muted-foreground/60">
          <p>Matheus e Ana ❤️</p>
        </footer>
      </div>
    </div>
  );
};

interface PersonSectionProps {
  name: 'matheus' | 'ana';
  displayName: string;
  tasks: any[];
  onAddTask: (text: string, important?: boolean) => void;
  onRemoveTask: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  onToggleImportance: (taskId: string) => void;
}

const PersonSection: React.FC<PersonSectionProps> = ({
  name,
  displayName,
  tasks,
  onAddTask,
  onRemoveTask,
  onToggleComplete,
  onToggleImportance
}) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  
  return (
    <section 
      className={cn(
        "glass-panel rounded-2xl p-6 transition-all duration-500",
        "animate-slide-in"
      )}
    >
      <div className="mb-6">
        <div className="inline-block bg-secondary/80 rounded-full px-3 py-1 text-xs 
                      font-medium text-secondary-foreground mb-2 dark:bg-secondary/30">
          {totalTasks === 0 ? (
            'Sem tarefas'
          ) : completedTasks === totalTasks ? (
            'Tudo concluído!'
          ) : (
            `${completedTasks}/${totalTasks} concluídas`
          )}
        </div>
        <h2 className="text-xl font-bold mb-2">{displayName}</h2>
      </div>
      
      <AddTaskForm onAddTask={onAddTask} owner={name} />
      
      <div className="overflow-hidden">
        <TaskTabs 
          tasks={tasks}
          onToggleComplete={onToggleComplete}
          onRemove={onRemoveTask}
          onToggleImportance={onToggleImportance}
        />
      </div>
    </section>
  );
};

export default Index;
