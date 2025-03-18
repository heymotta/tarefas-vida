
import { supabase } from '@/integrations/supabase/client';
import { Task, TasksState } from './localStorage';

export const fetchTasks = async (): Promise<TasksState> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching tasks:', error);
    return { matheus: [], ana: [] };
  }
  
  const matheusTasksArray = data
    .filter(task => task.owner === 'matheus')
    .map(task => ({
      id: task.id,
      text: task.text,
      completed: task.completed,
      owner: 'matheus',
      createdAt: new Date(task.created_at).getTime(),
      important: task.important
    }));
    
  const anaTasksArray = data
    .filter(task => task.owner === 'ana')
    .map(task => ({
      id: task.id,
      text: task.text,
      completed: task.completed,
      owner: 'ana',
      createdAt: new Date(task.created_at).getTime(),
      important: task.important
    }));
  
  return {
    matheus: matheusTasksArray,
    ana: anaTasksArray
  };
};

export const addTaskToSupabase = async (
  task: Omit<Task, 'id' | 'createdAt'> & { createdAt: number }
): Promise<Task | null> => {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      text: task.text,
      completed: task.completed,
      owner: task.owner,
      created_at: new Date(task.createdAt).toISOString(),
      important: task.important
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding task:', error);
    return null;
  }
  
  return {
    id: data.id,
    text: data.text,
    completed: data.completed,
    owner: data.owner as 'matheus' | 'ana',
    createdAt: new Date(data.created_at).getTime(),
    important: data.important
  };
};

export const updateTaskInSupabase = async (
  taskId: string,
  updates: Partial<Omit<Task, 'id' | 'owner' | 'createdAt'>>
): Promise<boolean> => {
  const { error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId);
  
  if (error) {
    console.error('Error updating task:', error);
    return false;
  }
  
  return true;
};

export const deleteTaskFromSupabase = async (taskId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);
  
  if (error) {
    console.error('Error deleting task:', error);
    return false;
  }
  
  return true;
};
