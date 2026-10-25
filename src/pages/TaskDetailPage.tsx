import { ArrowLeft, CalendarDays, Clock3, Pencil, Trash2, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { TaskFormDialog } from '../components/tasks/TaskFormDialog';
import { TaskPriorityBadge } from '../components/tasks/TaskPriorityBadge';
import { TaskStatusBadge } from '../components/tasks/TaskStatusBadge';
import { useTasks } from '../hooks/useTasks';
import { TASK_STATUSES, type TaskStatus } from '../types/task';
import { formatDueDate } from '../components/tasks/TaskTable';

export const TaskDetailPage = () => {
  const { taskId } = useParams();
  const { tasks, updateTask, updateStatus, deleteTask } = useTasks();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return <div className="panel detail-not-found"><h2>We couldn’t find that task.</h2><p>It may have been deleted or the link may be incorrect.</p><Link className="button button-quiet" to="/tasks"><ArrowLeft size={15} />Back to all tasks</Link></div>;
  }

  const removeTask = () => {
    if (window.confirm(`Delete "${task.title}"? This action cannot be undone.`)) {
      deleteTask(task.id);
      navigate('/tasks');
    }
  };

  return (
    <div className="page-stack detail-page">
      <Link className="back-link" to="/tasks"><ArrowLeft size={16} />Back to all tasks</Link>
      <article className="panel task-detail-panel">
        <div className="detail-actions">
          <span className="eyebrow">TASK DETAILS</span>
          <div><button className="button button-quiet" onClick={() => setEditing(true)}><Pencil size={15} />Edit</button><button className="button button-danger" onClick={removeTask}><Trash2 size={15} />Delete</button></div>
        </div>
        <h2 className="detail-title">{task.title}</h2>
        <div className="detail-badges"><TaskStatusBadge status={task.status} /><TaskPriorityBadge priority={task.priority} />{task.category && <span className="category-tag">{task.category}</span>}</div>
        <div className="detail-description">{task.description || <span className="muted">No description added.</span>}</div>
        <div className="detail-properties">
          <div className="detail-property"><span><UserRound size={16} />Assignee</span><strong>{task.assignee || 'Unassigned'}</strong></div>
          <div className="detail-property"><span><CalendarDays size={16} />Due date</span><strong>{formatDueDate(task.dueDate)}</strong></div>
          <div className="detail-property"><span><Clock3 size={16} />Created</span><strong>{new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</strong></div>
          <div className="detail-property"><span><Clock3 size={16} />Last updated</span><strong>{new Date(task.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</strong></div>
        </div>
        <div className="detail-status-control"><label htmlFor="detail-status">Update status</label><select id="detail-status" className="form-control" value={task.status} onChange={(event) => updateStatus(task.id, event.target.value as TaskStatus)}>{TASK_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></div>
      </article>
      {editing && <TaskFormDialog title="Edit task" initialValues={task} onClose={() => setEditing(false)} onSubmit={(values) => { updateTask(task.id, values); setEditing(false); }} />}
    </div>
  );
};
