import { useState } from 'react';
import { ListFilter, Plus, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { TaskFormDialog } from '../components/tasks/TaskFormDialog';
import { TaskTable } from '../components/tasks/TaskTable';
import { useTasks } from '../hooks/useTasks';
import type { Task, TaskFilters, TaskPriority, TaskStatus } from '../types/task';
import { TASK_PRIORITIES, TASK_STATUSES } from '../types/task';
import { defaultTaskFormValues, emptyTaskFilters, filterAndSortTasks } from '../utils/taskHelpers';

export const TasksPage = () => {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<Omit<TaskFilters, 'search'>>(emptyTaskFilters());
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [creating, setCreating] = useState(false);
  const search = searchParams.get('q') ?? '';
  const visibleTasks = filterAndSortTasks(tasks, { ...filters, search });
  const categories = [...new Set(tasks.map((task) => task.category).filter(Boolean))].sort();
  const hasFilters = Boolean(search || filters.status !== 'All' || filters.priority !== 'All' || filters.category);

  const clearFilters = () => {
    setFilters(emptyTaskFilters());
    setSearchParams({}, { replace: true });
  };

  const confirmDelete = (task: Task) => {
    if (window.confirm(`Delete "${task.title}"? This action cannot be undone.`)) deleteTask(task.id);
  };

  return (
    <div className="page-stack">
      <section className="page-intro-row">
        <div><div className="eyebrow">YOUR WORKSPACE</div><h2>All tasks<span className="title-period">.</span></h2><p>A clear view of everything on your plate.</p></div>
        <button className="button button-primary" onClick={() => setCreating(true)}><Plus size={17} />New task</button>
      </section>
      <section className="panel tasks-panel">
        <div className="filter-toolbar">
          <div className="filter-caption"><SlidersHorizontal size={16} /><span>Filter by</span></div>
          <label className="filter-label"><span className="sr-only">Filter by status</span><select value={filters.status} onChange={(event) => setFilters((value) => ({ ...value, status: event.target.value as TaskStatus | 'All' }))}><option value="All">All statuses</option>{TASK_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label>
          <label className="filter-label"><span className="sr-only">Filter by priority</span><select value={filters.priority} onChange={(event) => setFilters((value) => ({ ...value, priority: event.target.value as TaskPriority | 'All' }))}><option value="All">All priorities</option>{TASK_PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}</select></label>
          <label className="filter-label"><span className="sr-only">Filter by category</span><select value={filters.category} onChange={(event) => setFilters((value) => ({ ...value, category: event.target.value }))}><option value="">All categories</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
          <label className="filter-label sort-filter"><span className="sr-only">Sort tasks</span><select value={filters.sortBy} onChange={(event) => setFilters((value) => ({ ...value, sortBy: event.target.value as TaskFilters['sortBy'] }))}><option value="createdAt">Recently created</option><option value="dueDate">Due date</option></select></label>
          {hasFilters && <button className="clear-filters" onClick={clearFilters}><RotateCcw size={14} />Clear filters</button>}
        </div>
        {visibleTasks.length ? (
          <TaskTable tasks={visibleTasks} onEdit={setEditingTask} onDelete={confirmDelete} />
        ) : (
          <div className="empty-state">
            <div className="empty-icon"><ListFilter size={23} /></div>
            <h3>{tasks.length ? 'No tasks match these filters' : 'Your task list is looking a little quiet'}</h3>
            <p>{tasks.length ? 'Try changing your search or filters to find what you need.' : 'Create a task to capture your next idea or to-do.'}</p>
            {tasks.length ? <button className="button button-quiet" onClick={clearFilters}>Clear filters</button> : <button className="button button-primary" onClick={() => setCreating(true)}><Plus size={16} />Create your first task</button>}
          </div>
        )}
        <div className="table-footer"><span>Showing <strong>{visibleTasks.length}</strong> of <strong>{tasks.length}</strong> tasks</span><span>{search ? `Search: “${search}”` : 'All workspace tasks'}</span></div>
      </section>
      {(creating || editingTask) && (
        <TaskFormDialog
          title={editingTask ? 'Edit task' : 'Create a task'}
          initialValues={editingTask ?? defaultTaskFormValues()}
          onClose={() => { setCreating(false); setEditingTask(null); }}
          onSubmit={(values) => {
            if (editingTask) updateTask(editingTask.id, values);
            else addTask(values);
            setCreating(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};
