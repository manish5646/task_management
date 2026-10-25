import { CalendarDays, Plus } from 'lucide-react';
import { useState } from 'react';
import { TaskFormDialog } from '../components/tasks/TaskFormDialog';
import { TaskPriorityBadge } from '../components/tasks/TaskPriorityBadge';
import { TaskStatusBadge } from '../components/tasks/TaskStatusBadge';
import { useTasks } from '../hooks/useTasks';
import { TASK_STATUSES, type Task, type TaskStatus } from '../types/task';
import { defaultTaskFormValues } from '../utils/taskHelpers';
import { formatDueDate } from '../components/tasks/TaskTable';

const columns: { status: TaskStatus; label: string; tone: string }[] = [
  { status: 'Todo', label: 'To do', tone: 'todo' },
  { status: 'In Progress', label: 'In progress', tone: 'progress' },
  { status: 'Done', label: 'Done', tone: 'done' },
];

export const KanbanPage = () => {
  const { tasks, addTask, updateTask, updateStatus } = useTasks();
  const [creatingFor, setCreatingFor] = useState<TaskStatus | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  return (
    <div className="page-stack">
      <section className="page-intro-row">
        <div><div className="eyebrow">VISUALIZE YOUR FLOW</div><h2>Kanban board<span className="title-period">.</span></h2><p>Move work forward, one task at a time.</p></div>
        <span className="board-count">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</span>
      </section>
      <section className="kanban-grid" aria-label="Tasks by status" role="region" tabIndex={0}>
        {columns.map(({ status, label, tone }) => {
          const columnTasks = tasks.filter((task) => task.status === status);
          return (
            <div className="kanban-column" key={status}>
              <div className={`kanban-column-heading column-${tone}`}>
                <div className="column-title"><span className="column-dot" />{label}<span className="column-count">{columnTasks.length}</span></div>
                <button className="icon-button" aria-label={`Add task to ${label}`} onClick={() => setCreatingFor(status)}><Plus size={17} /></button>
              </div>
              <div className="kanban-cards">
                {columnTasks.map((task) => (
                  <article className="kanban-card" key={task.id}>
                    <div className="kanban-card-top"><span className="category-tag">{task.category || 'General'}</span><TaskPriorityBadge priority={task.priority} /></div>
                    <button className="kanban-task-title" onClick={() => setEditingTask(task)}>{task.title}</button>
                    {task.description && <p className="kanban-description">{task.description}</p>}
                    <div className="kanban-card-bottom">
                      <span className="kanban-assignee">{task.assignee ? task.assignee.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() : '—'}</span>
                      <span className="kanban-due"><CalendarDays size={13} />{formatDueDate(task.dueDate)}</span>
                    </div>
                    <label className="kanban-status-select"><span className="sr-only">Change status for {task.title}</span><TaskStatusBadge status={task.status} /><select value={task.status} onChange={(event) => updateStatus(task.id, event.target.value as TaskStatus)}>{TASK_STATUSES.map((option) => <option key={option}>{option}</option>)}</select></label>
                  </article>
                ))}
                {!columnTasks.length && <div className="column-empty">No tasks here yet.</div>}
              </div>
              <button className="add-column-task" onClick={() => setCreatingFor(status)}><Plus size={15} />Add a task</button>
            </div>
          );
        })}
      </section>
      {(creatingFor || editingTask) && (
        <TaskFormDialog
          title={editingTask ? 'Edit task' : 'Create a task'}
          initialValues={editingTask ?? { ...defaultTaskFormValues(), status: creatingFor ?? 'Todo' }}
          onClose={() => { setCreatingFor(null); setEditingTask(null); }}
          onSubmit={(values) => {
            if (editingTask) updateTask(editingTask.id, values);
            else addTask(values);
            setCreatingFor(null);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};
