import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  type Task,
  type TaskFilters,
  type TaskFormValues,
  type TaskPriority,
  type TaskStatus,
} from '../types/task';

export const STORAGE_KEY = 'orbit.tasks.v1';

const localDateString = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

const dateOffset = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return localDateString(date);
};

export const createDemoTasks = (): Task[] => {
  const now = new Date().toISOString();
  return [
    {
      id: 'demo-1',
      title: 'Refresh the onboarding flow',
      description: 'Review the first-run experience and simplify the steps for new workspace members.',
      status: 'In Progress',
      priority: 'High',
      dueDate: dateOffset(2),
      assignee: 'Maya Chen',
      category: 'Design',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'demo-2',
      title: 'Write release notes',
      description: 'Collect the changes for the upcoming product release and prepare a clear summary.',
      status: 'Todo',
      priority: 'Medium',
      dueDate: dateOffset(5),
      assignee: 'Alex Morgan',
      category: 'Marketing',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'demo-3',
      title: 'Resolve mobile navigation issue',
      description: 'Check the compact navigation menu on smaller screens and verify keyboard access.',
      status: 'Todo',
      priority: 'Critical',
      dueDate: dateOffset(-1),
      assignee: 'Jordan Lee',
      category: 'Engineering',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'demo-4',
      title: 'Share customer interview themes',
      description: 'Summarize the recurring themes from this month’s customer conversations.',
      status: 'Done',
      priority: 'Low',
      dueDate: dateOffset(-2),
      assignee: 'Sam Rivera',
      category: 'Research',
      createdAt: now,
      updatedAt: now,
    },
  ];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isTask = (value: unknown): value is Task => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.description === 'string' &&
    TASK_STATUSES.includes(value.status as TaskStatus) &&
    TASK_PRIORITIES.includes(value.priority as TaskPriority) &&
    typeof value.dueDate === 'string' &&
    typeof value.assignee === 'string' &&
    typeof value.category === 'string' &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string'
  );
};

export const readStoredTasks = (storage: Storage): Task[] => {
  let stored: string | null;
  try {
    stored = storage.getItem(STORAGE_KEY);
  } catch (error) {
    console.error('Unable to read saved tasks; loading the sample tasks instead.', error);
    return createDemoTasks();
  }
  if (stored === null) return createDemoTasks();

  try {
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed) || !parsed.every(isTask)) {
      throw new Error('Stored task data has an invalid shape.');
    }
    return parsed;
  } catch (error) {
    console.error('Unable to restore saved tasks; loading the sample tasks instead.', error);
    return createDemoTasks();
  }
};

export const filterAndSortTasks = (tasks: Task[], filters: TaskFilters): Task[] => {
  const search = filters.search.trim().toLocaleLowerCase();
  return tasks
    .filter((task) => {
      const matchesSearch =
        !search ||
        task.title.toLocaleLowerCase().includes(search) ||
        task.description.toLocaleLowerCase().includes(search);
      const matchesStatus = filters.status === 'All' || task.status === filters.status;
      const matchesPriority = filters.priority === 'All' || task.priority === filters.priority;
      const matchesCategory =
        !filters.category || task.category.toLocaleLowerCase() === filters.category.toLocaleLowerCase();
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'dueDate') {
        if (!a.dueDate) return b.dueDate ? 1 : 0;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      return b.createdAt.localeCompare(a.createdAt);
    });
};

export const isValidDueDate = (value: string): boolean => {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day;
};

export const getTaskStats = (tasks: Task[], today = localDateString(new Date())) => {
  const completed = tasks.filter((task) => task.status === 'Done').length;
  return {
    total: tasks.length,
    completed,
    inProgress: tasks.filter((task) => task.status === 'In Progress').length,
    pending: tasks.filter((task) => task.status === 'Todo').length,
    overdue: tasks.filter((task) => task.status !== 'Done' && task.dueDate !== '' && task.dueDate < today).length,
    completion: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
  };
};

export const emptyTaskFilters = (): TaskFilters => ({
  search: '',
  status: 'All',
  priority: 'All',
  category: '',
  sortBy: 'createdAt',
});

export const defaultTaskFormValues = (): TaskFormValues => ({
  title: '',
  description: '',
  status: 'Todo',
  priority: 'Medium',
  dueDate: '',
  assignee: '',
  category: '',
});
