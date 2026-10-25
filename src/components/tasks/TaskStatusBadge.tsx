import type { TaskStatus } from '../../types/task';

export const TaskStatusBadge = ({ status }: { status: TaskStatus }) => (
  <span className={`badge status-badge status-${status.toLowerCase().replace(' ', '-')}`}>
    <span className="badge-dot" />{status}
  </span>
);
