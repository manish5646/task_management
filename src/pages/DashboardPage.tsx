import { ArrowRight, ArrowUpRight, CheckCircle2, CircleDashed, Clock3, ListTodo, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import type { Task } from '../types/task';
import { filterAndSortTasks, getTaskStats } from '../utils/taskHelpers';
import { StatCard } from '../components/dashboard/StatCard';
import { TaskFormDialog } from '../components/tasks/TaskFormDialog';
import { TaskPriorityBadge } from '../components/tasks/TaskPriorityBadge';
import { TaskStatusBadge } from '../components/tasks/TaskStatusBadge';
import { formatDueDate } from '../components/tasks/TaskTable';

export const DashboardPage = () => {
  const { tasks, addTask, updateTask } = useTasks();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [creating, setCreating] = useState(false);
  const stats = getTaskStats(tasks);
  const recentTasks = filterAndSortTasks(tasks, {
    search: '',
    status: 'All',
    priority: 'All',
    category: '',
    sortBy: 'createdAt',
  }).slice(0, 5);
  const overdue = stats.overdue;
  const today = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());

  return (
    <div className="page-stack">
      <section className="welcome-row">
        <div>
          <div className="eyebrow">{today.toUpperCase()}</div>
          <h2>Your work, at a glance<span className="title-period">.</span></h2>
          <p>Here’s what’s happening across your tasks today.</p>
        </div>
        <Link to="/tasks" className="text-link">View all tasks <ArrowRight size={15} /></Link>
      </section>

      <section className="stats-grid" aria-label="Task statistics">
        <StatCard label="Total tasks" value={stats.total} note="Across your workspace" icon={ListTodo} tone="violet" />
        <StatCard label="Completed" value={stats.completed} note={`${stats.completion}% completion rate`} icon={CheckCircle2} tone="green" />
        <StatCard label="In progress" value={stats.inProgress} note="Currently being worked on" icon={Clock3} tone="blue" />
        <StatCard label="To do" value={stats.pending} note={overdue ? `${overdue} overdue — take a look` : 'Ready when you are'} icon={CircleDashed} tone="amber" />
      </section>

      <section className="dashboard-grid">
        <div className="panel recent-panel">
          <div className="panel-heading">
            <div><span className="eyebrow">YOUR WORKLOAD</span><h3>Recent tasks</h3></div>
            <Link to="/tasks" className="text-link">See all <ArrowRight size={14} /></Link>
          </div>
          {recentTasks.length ? (
            <div className="recent-list">
              {recentTasks.map((task) => (
                <button className="recent-task" key={task.id} onClick={() => setEditingTask(task)}>
                  <span className="recent-task-main"><span className={`task-mark mark-${task.status.toLowerCase().replace(' ', '-')}`} /><span><strong>{task.title}</strong><small>{task.category || 'Uncategorized'} · {formatDueDate(task.dueDate)}</small></span></span>
                  <span className="recent-task-meta"><TaskPriorityBadge priority={task.priority} /><TaskStatusBadge status={task.status} /></span>
                </button>
              ))}
            </div>
          ) : (
            <div className="empty-state compact-empty"><div className="empty-icon"><ListTodo size={22} /></div><h3>Nothing on your list yet</h3><p>Create your first task and it’ll show up here.</p></div>
          )}
        </div>

        <div className="dashboard-side">
          <div className="panel progress-panel">
            <div className="panel-heading"><div><span className="eyebrow">MOMENTUM</span><h3>Completion</h3></div><span className="progress-trend"><ArrowUpRight size={15} />Today</span></div>
            <div className="progress-number">{stats.completion}<span>%</span></div>
            <div className="progress-track"><span style={{ width: `${stats.completion}%` }} /></div>
            <div className="progress-caption"><span>{stats.completed} completed</span><span>{stats.total} total tasks</span></div>
            <div className="progress-footer"><CheckCircle2 size={16} />Keep your momentum going</div>
          </div>
          <div className="focus-card">
            <div className="focus-orbit orbit-one" /><div className="focus-orbit orbit-two" />
            <div className="focus-card-content"><span className="eyebrow">A LITTLE FOCUS</span><h3>One thing at a time.</h3><p>Small steps add up to meaningful progress.</p><Link to="/board">Open your board <ArrowRight size={14} /></Link></div>
          </div>
        </div>
      </section>
      <div className="dashboard-bottom"><span><span className="live-dot" /> All caught up with your workspace</span><button className="button button-quiet" onClick={() => setCreating(true)}><Plus size={16} /> Quick add task</button></div>
      {(editingTask || creating) && (
        <TaskFormDialog
          title={editingTask ? 'Edit task' : 'Create a task'}
          initialValues={editingTask ?? {
            title: '',
            description: '',
            status: 'Todo',
            priority: 'Medium',
            dueDate: '',
            assignee: '',
            category: '',
          }}
          onClose={() => { setEditingTask(null); setCreating(false); }}
          onSubmit={(values) => {
            if (editingTask) updateTask(editingTask.id, values);
            else addTask(values);
            setEditingTask(null);
            setCreating(false);
          }}
        />
      )}
    </div>
  );
};
