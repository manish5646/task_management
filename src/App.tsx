import { Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { KanbanPage } from './pages/KanbanPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SettingsPage } from './pages/SettingsPage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { TasksPage } from './pages/TasksPage';

export const App = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route index element={<DashboardPage />} />
      <Route path="tasks" element={<TasksPage />} />
      <Route path="tasks/:taskId" element={<TaskDetailPage />} />
      <Route path="board" element={<KanbanPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
);
