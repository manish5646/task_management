import { useRef, useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { TASK_PRIORITIES, TASK_STATUSES, type TaskFormValues } from '../../types/task';
import { defaultTaskFormValues, isValidDueDate } from '../../utils/taskHelpers';

interface TaskFormDialogProps {
  title: string;
  initialValues: TaskFormValues;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => void;
}

export const TaskFormDialog = ({ title, initialValues, onClose, onSubmit }: TaskFormDialogProps) => {
  const [values, setValues] = useState<TaskFormValues>({ ...defaultTaskFormValues(), ...initialValues });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const submitted = useRef(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitted.current) return;
    const cleaned = { ...values, title: values.title.trim() };
    if (!cleaned.title) {
      setError('Add a title before saving this task.');
      return;
    }
    if (cleaned.title.length > 100) {
      setError('Keep the title to 100 characters or fewer.');
      return;
    }
    if (!isValidDueDate(cleaned.dueDate)) {
      setError('Enter a valid due date.');
      return;
    }
    setError('');
    submitted.current = true;
    setSubmitting(true);
    try {
      onSubmit({
        ...cleaned,
        description: cleaned.description.trim(),
        assignee: cleaned.assignee.trim(),
        category: cleaned.category.trim(),
      });
    } catch (submitError) {
      submitted.current = false;
      setSubmitting(false);
      throw submitError;
    }
  };

  const update = <K extends keyof TaskFormValues>(field: K, value: TaskFormValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (error) setError('');
  };

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="dialog task-form-dialog" role="dialog" aria-modal="true" aria-labelledby="task-form-title">
        <div className="dialog-header">
          <div><span className="eyebrow">TASK DETAILS</span><h2 id="task-form-title">{title}</h2></div>
          <button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={19} /></button>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <label className="field-label" htmlFor="task-title">Task title <span className="required-mark">*</span></label>
          <input
            id="task-title"
            className="form-control"
            value={values.title}
            maxLength={100}
            onChange={(event) => update('title', event.target.value)}
            placeholder="What needs to get done?"
            autoFocus
          />
          <label className="field-label" htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            className="form-control form-textarea"
            value={values.description}
            onChange={(event) => update('description', event.target.value)}
            placeholder="Add a few details..."
            rows={4}
          />
          <div className="form-grid">
            <div>
              <label className="field-label" htmlFor="task-status">Status</label>
              <select id="task-status" className="form-control" value={values.status} onChange={(event) => update('status', event.target.value as TaskFormValues['status'])}>
                {TASK_STATUSES.map((status) => <option key={status}>{status}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="task-priority">Priority</label>
              <select id="task-priority" className="form-control" value={values.priority} onChange={(event) => update('priority', event.target.value as TaskFormValues['priority'])}>
                {TASK_PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="task-due-date">Due date</label>
              <input id="task-due-date" className="form-control" type="date" value={values.dueDate} onChange={(event) => update('dueDate', event.target.value)} />
            </div>
            <div>
              <label className="field-label" htmlFor="task-assignee">Assignee</label>
              <input id="task-assignee" className="form-control" value={values.assignee} onChange={(event) => update('assignee', event.target.value)} placeholder="Add a name" />
            </div>
            <div className="form-grid-full">
              <label className="field-label" htmlFor="task-category">Category</label>
              <input id="task-category" className="form-control" value={values.category} onChange={(event) => update('category', event.target.value)} placeholder="e.g. Design, Engineering" />
            </div>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="dialog-actions">
            <button type="button" className="button button-quiet" onClick={onClose}>Cancel</button>
            <button type="submit" className="button button-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save task'}</button>
          </div>
        </form>
      </section>
    </div>
  );
};
