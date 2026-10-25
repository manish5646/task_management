import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TaskFormDialog } from '../tasks/TaskFormDialog';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useTasks } from '../../hooks/useTasks';
import { defaultTaskFormValues } from '../../utils/taskHelpers';
import type { TaskFormValues, Theme } from '../../types/task';

const THEME_KEY = 'orbit.theme.v1';

export const AppLayout = () => {
  const { addTask } = useTasks();
  const [formOpen, setFormOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return window.localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
    } catch (error) {
      console.error('Unable to read the saved theme preference.', error);
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      console.error('Unable to save the theme preference.', error);
    }
  }, [theme]);

  const closeForm = () => setFormOpen(false);
  const submitNewTask = (values: TaskFormValues) => {
    addTask(values);
    closeForm();
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-shell">
        <Header onCreateTask={() => setFormOpen(true)} />
        <main className="page-content"><Outlet context={{ theme, setTheme }} /></main>
      </div>
      {formOpen && (
        <TaskFormDialog
          title="Create a task"
          initialValues={defaultTaskFormValues()}
          onClose={closeForm}
          onSubmit={submitNewTask}
        />
      )}
    </div>
  );
};
