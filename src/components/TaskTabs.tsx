
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskList from './TaskList';
import { Task } from '@/utils/localStorage';

interface TaskTabsProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onRemove: (taskId: string) => void;
  onToggleImportance: (taskId: string) => void;
  onUpdateDueDate: (taskId: string, dueDate?: number) => void;
}

const TaskTabs: React.FC<TaskTabsProps> = ({
  tasks,
  onToggleComplete,
  onRemove,
  onToggleImportance,
  onUpdateDueDate,
}) => {
  const completedTasksCount = tasks.filter(task => task.completed).length;
  
  return (
    <Tabs defaultValue="active" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="active">Ativas</TabsTrigger>
        <TabsTrigger value="completed">
          Concluídas
          {completedTasksCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground">
              {completedTasksCount}
            </span>
          )}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="active" className="mt-0">
        <TaskList
          tasks={tasks}
          onToggleComplete={onToggleComplete}
          onRemove={onRemove}
          onToggleImportance={onToggleImportance}
          onUpdateDueDate={onUpdateDueDate}
          showCompleted={false}
        />
      </TabsContent>
      
      <TabsContent value="completed" className="mt-0">
        <TaskList
          tasks={tasks}
          onToggleComplete={onToggleComplete}
          onRemove={onRemove}
          onToggleImportance={onToggleImportance}
          onUpdateDueDate={onUpdateDueDate}
          showCompleted={true}
        />
      </TabsContent>
    </Tabs>
  );
};

export default TaskTabs;
