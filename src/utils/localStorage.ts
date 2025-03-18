
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  owner: 'matheus' | 'ana';
  createdAt: number;
  important?: boolean;
}

export type TasksState = {
  matheus: Task[];
  ana: Task[];
};

const STORAGE_KEY = 'couple-tasks';

export const loadTasks = (): TasksState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Error loading tasks from localStorage:', err);
  }
  
  return { matheus: [], ana: [] };
};

export const saveTasks = (tasks: TasksState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Error saving tasks to localStorage:', err);
  }
};

export const addTask = (
  tasks: TasksState,
  owner: 'matheus' | 'ana',
  text: string,
  important: boolean = false
): TasksState => {
  if (!text.trim()) return tasks;
  
  const newTask: Task = {
    id: Date.now().toString(),
    text: text.trim(),
    completed: false,
    owner,
    createdAt: Date.now(),
    important
  };
  
  return {
    ...tasks,
    [owner]: [...tasks[owner], newTask],
  };
};

export const removeTask = (
  tasks: TasksState,
  owner: 'matheus' | 'ana',
  taskId: string
): TasksState => {
  return {
    ...tasks,
    [owner]: tasks[owner].filter(task => task.id !== taskId),
  };
};

export const toggleTaskCompletion = (
  tasks: TasksState,
  owner: 'matheus' | 'ana',
  taskId: string
): TasksState => {
  return {
    ...tasks,
    [owner]: tasks[owner].map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed } 
        : task
    ),
  };
};

export const toggleTaskImportance = (
  tasks: TasksState,
  owner: 'matheus' | 'ana',
  taskId: string
): TasksState => {
  return {
    ...tasks,
    [owner]: tasks[owner].map(task => 
      task.id === taskId 
        ? { ...task, important: !task.important } 
        : task
    ),
  };
};

export const getImportantTasks = (tasks: TasksState): Task[] => {
  const allTasks = [...tasks.matheus, ...tasks.ana];
  
  return allTasks.filter(task => 
    !task.completed && 
    task.important === true
  );
};
