import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TasksProvider, useTasks } from './useTasks';
import { STORAGE_KEY } from '../utils/taskHelpers';

afterEach(cleanup);

const TaskControls = () => {
  const { tasks, addTask, updateStatus, deleteTask } = useTasks();
  const first = tasks[0];
  return (
    <div>
      <span data-testid="count">{tasks.length}</span>
      <button onClick={() => addTask({ title: 'New task', description: '', status: 'Todo', priority: 'High', dueDate: '', assignee: '', category: '' })}>add</button>
      {first && <><button onClick={() => updateStatus(first.id, 'Done')}>complete</button><button onClick={() => deleteTask(first.id)}>delete</button></>}
    </div>
  );
};

describe('TasksProvider', () => {
  it('adds, updates, deletes, and persists tasks', async () => {
    window.localStorage.clear();
    render(<TasksProvider><TaskControls /></TasksProvider>);
    const initialCount = Number(screen.getByTestId('count').textContent);
    fireEvent.click(screen.getByText('add'));
    expect(screen.getByTestId('count')).toHaveTextContent(String(initialCount + 1));
    await waitFor(() => expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')).toHaveLength(initialCount + 1));
    fireEvent.click(screen.getByText('complete'));
    fireEvent.click(screen.getByText('delete'));
    expect(screen.getByTestId('count')).toHaveTextContent(String(initialCount));
  });

  it('reports a storage write failure without crashing the task UI', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('storage full'); });
    render(<TasksProvider><TaskControls /></TasksProvider>);
    fireEvent.click(screen.getByText('add'));
    await waitFor(() => expect(error).toHaveBeenCalledWith('Unable to save tasks to local storage.', expect.any(Error)));
    setItem.mockRestore();
    error.mockRestore();
  });
});
