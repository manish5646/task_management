import { ArrowDown, ArrowUpRight, CalendarDays, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Task } from '../../types/task';
import { TaskPriorityBadge } from './TaskPriorityBadge';
import { TaskStatusBadge } from './TaskStatusBadge';

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const formatDueDate = (value: string): string => {
  if (!value) return 'No due date';
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? 'Invalid date'
    : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');

export const TaskTable = ({ tasks, onEdit, onDelete }: TaskTableProps) => (
  <div className="table-wrap" role="region" aria-label="Task list" tabIndex={0}>
    <table className="task-table">
      <caption className="sr-only">Tasks in this workspace</caption>
      <thead>
        <tr>
          <th>Task</th><th>Assignee</th><th>Priority</th><th>Status</th><th>Due date</th><th>Category</th><th><span className="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td>
              <Link className="task-title-link" to={`/tasks/${task.id}`}>{task.title}<ArrowUpRight size={13} /></Link>
              <div className="table-description">{task.description || 'No description added'}</div>
            </td>
            <td>
              {task.assignee ? <span className="assignee-cell"><span className="avatar avatar-small">{initials(task.assignee)}</span>{task.assignee}</span> : <span className="muted">Unassigned</span>}
            </td>
            <td><TaskPriorityBadge priority={task.priority} /></td>
            <td><TaskStatusBadge status={task.status} /></td>
            <td><span className="due-cell"><CalendarDays size={14} />{formatDueDate(task.dueDate)}</span></td>
            <td>{task.category ? <span className="category-tag">{task.category}</span> : <span className="muted">—</span>}</td>
            <td>
              <div className="row-actions">
                <button className="icon-button" aria-label={`Edit ${task.title}`} onClick={() => onEdit(task)}><Pencil size={15} /></button>
                <button className="icon-button danger-hover" aria-label={`Delete ${task.title}`} onClick={() => onDelete(task)}><Trash2 size={15} /></button>
                <MoreHorizontal className="row-more" size={16} aria-hidden="true" />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const SortDirectionIcon = ({ descending }: { descending: boolean }) =>
  descending ? <ArrowDown size={14} aria-hidden="true" /> : <ArrowUpRight size={14} aria-hidden="true" />;
