import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Task, TaskFormValues, TaskStatus } from '../types/task';
import { createDemoTasks, readStoredTasks, STORAGE_KEY } from '../utils/taskHelpers';

interface TasksContextValue {
  tasks: Task[];
  addTask: (values: TaskFormValues) => void;
  updateTask: (id: string, values: TaskFormValues) => void;
  deleteTask: (id: string) => void;
  updateStatus: (id: string, status: TaskStatus) => void;
  resetTasks: () => void;
  clearTasks: () => void;
}

const TasksContext = createContext<TasksContextValue | null>(null);

const loadTasks = (): Task[] => {
  try {
    return readStoredTasks(window.localStorage);
  } catch (error) {
    console.error('Unable to access local storage; loading the sample tasks instead.', error);
    return createDemoTasks();
  }
};

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Unable to save tasks to local storage.', error);
    }
  }, [tasks]);

  const addTask = useCallback((values: TaskFormValues) => {
    const now = new Date().toISOString();
    const task: Task = { ...values, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
    setTasks((current) => [task, ...current]);
  }, []);

  const updateTask = useCallback((id: string, values: TaskFormValues) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, ...values, updatedAt: new Date().toISOString() } : task,
      ),
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  }, []);

  const updateStatus = useCallback((id: string, status: TaskStatus) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, status, updatedAt: new Date().toISOString() } : task,
      ),
    );
  }, []);

  const resetTasks = useCallback(() => setTasks(createDemoTasks()), []);
  const clearTasks = useCallback(() => setTasks([]), []);

  const value = useMemo(
    () => ({ tasks, addTask, updateTask, deleteTask, updateStatus, resetTasks, clearTasks }),
    [tasks, addTask, updateTask, deleteTask, updateStatus, resetTasks, clearTasks],
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};

export const useTasks = (): TasksContextValue => {
  const context = useContext(TasksContext);
  if (!context) throw new Error('useTasks must be used within a TasksProvider.');
  return context;
};
