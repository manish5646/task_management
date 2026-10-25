import { describe, expect, it, vi } from 'vitest';
import type { Task, TaskFilters } from '../types/task';
import { filterAndSortTasks, getTaskStats, isValidDueDate, readStoredTasks, STORAGE_KEY } from './taskHelpers';

const task = (id: string, overrides: Partial<Task> = {}): Task => ({
  id,
  title: `Task ${id}`,
  description: '',
  status: 'Todo',
  priority: 'Medium',
  dueDate: '',
  assignee: '',
  category: 'Design',
  createdAt: `2026-01-0${id}T00:00:00.000Z`,
  updatedAt: `2026-01-0${id}T00:00:00.000Z`,
  ...overrides,
});

const filters: TaskFilters = {
  search: '',
  status: 'All',
  priority: 'All',
  category: '',
  sortBy: 'createdAt',
};

describe('filterAndSortTasks', () => {
  it('combines search and filters, then sorts by the selected field', () => {
    const tasks = [
      task('1', { title: 'Design a dashboard', priority: 'High', category: 'Design', dueDate: '2026-04-05' }),
      task('2', { title: 'Write help docs', priority: 'High', category: 'Writing', dueDate: '2026-04-10' }),
      task('3', { title: 'Dashboard polish', status: 'Done', priority: 'Low', category: 'Design', dueDate: '2026-04-01' }),
    ];
    const result = filterAndSortTasks(tasks, {
      ...filters,
      search: 'DASHBOARD',
      status: 'Todo',
      priority: 'High',
      category: 'design',
      sortBy: 'dueDate',
    });
    expect(result.map((item) => item.id)).toEqual(['1']);
  });

  it('searches descriptions and returns newest creation date first', () => {
    const tasks = [
      task('1', { description: 'Coordinate the release' }),
      task('3', { description: 'Release checklist' }),
      task('2', { description: 'No match' }),
    ];
    expect(filterAndSortTasks(tasks, { ...filters, search: 'release' }).map((item) => item.id)).toEqual(['3', '1']);
  });

  it('sorts due dates soonest first and puts undated tasks last', () => {
    const tasks = [
      task('1', { dueDate: '' }),
      task('2', { dueDate: '2026-05-12' }),
      task('3', { dueDate: '2026-04-03' }),
    ];
    expect(filterAndSortTasks(tasks, { ...filters, sortBy: 'dueDate' }).map((item) => item.id)).toEqual(['3', '2', '1']);
  });
});

describe('task statistics and dates', () => {
  it('derives all dashboard counts and completion from the task list', () => {
    const stats = getTaskStats([
      task('1', { status: 'Done', dueDate: '2026-02-01' }),
      task('2', { status: 'In Progress', dueDate: '2026-02-02' }),
      task('3', { dueDate: '2026-02-04' }),
    ], '2026-02-03');
    expect(stats).toEqual({ total: 3, completed: 1, inProgress: 1, pending: 1, overdue: 1, completion: 33 });
    expect(getTaskStats([]).completion).toBe(0);
  });

  it('accepts empty optional due dates and rejects malformed calendar dates', () => {
    expect(isValidDueDate('')).toBe(true);
    expect(isValidDueDate('2026-02-28')).toBe(true);
    expect(isValidDueDate('2026-02-30')).toBe(false);
    expect(isValidDueDate('not-a-date')).toBe(false);
  });
});

describe('readStoredTasks', () => {
  it('uses demo tasks when storage is empty and restores valid saved tasks', () => {
    const storage = window.localStorage;
    storage.clear();
    expect(readStoredTasks(storage).length).toBeGreaterThan(0);
    const saved = [task('1')];
    storage.setItem(STORAGE_KEY, JSON.stringify(saved));
    expect(readStoredTasks(storage)).toEqual(saved);
  });

  it('falls back to demo tasks when stored JSON is invalid', () => {
    const storage = window.localStorage;
    storage.setItem(STORAGE_KEY, '{invalid');
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(readStoredTasks(storage).length).toBeGreaterThan(0);
    vi.restoreAllMocks();
  });
});
