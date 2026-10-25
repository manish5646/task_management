export const TASK_STATUSES = ['Todo', 'In Progress', 'Done'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignee: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskFormValues = Pick<
  Task,
  'title' | 'description' | 'status' | 'priority' | 'dueDate' | 'assignee' | 'category'
>;

export interface TaskFilters {
  search: string;
  status: TaskStatus | 'All';
  priority: TaskPriority | 'All';
  category: string;
  sortBy: 'createdAt' | 'dueDate';
}

export type Theme = 'light' | 'dark';
