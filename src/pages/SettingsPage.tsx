import { Database, Moon, RotateCcw, Sun, Trash2 } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import type { Theme } from '../types/task';

interface LayoutContext {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const SettingsPage = () => {
  const { theme, setTheme } = useOutletContext<LayoutContext>();
  const { resetTasks, clearTasks } = useTasks();

  const restoreDemo = () => {
    if (window.confirm('Restore the sample tasks? Your current task list will be replaced.')) resetTasks();
  };
  const removeAll = () => {
    if (window.confirm('Clear all tasks? This action cannot be undone.')) clearTasks();
  };

  return (
    <div className="page-stack settings-page">
      <section className="page-intro-row"><div><div className="eyebrow">MAKE IT YOURS</div><h2>Settings<span className="title-period">.</span></h2><p>Manage your workspace preferences and data.</p></div></section>
      <section className="panel settings-panel">
        <div className="settings-section-heading"><span className="settings-icon"><Sun size={18} /></span><div><h3>Appearance</h3><p>Choose how Task looks on this device.</p></div></div>
        <div className="setting-row">
          <div><strong>Theme</strong><span>Switch between light and dark appearance.</span></div>
          <div className="theme-toggle" role="group" aria-label="Theme">
            <button className={theme === 'light' ? 'selected' : ''} aria-pressed={theme === 'light'} onClick={() => setTheme('light')}><Sun size={15} />Light</button>
            <button className={theme === 'dark' ? 'selected' : ''} aria-pressed={theme === 'dark'} onClick={() => setTheme('dark')}><Moon size={15} />Dark</button>
          </div>
        </div>
      </section>
      <section className="panel settings-panel">
        <div className="settings-section-heading"><span className="settings-icon"><Database size={18} /></span><div><h3>Your data</h3><p>Tasks are saved locally in this browser.</p></div></div>
        <div className="setting-row">
          <div><strong>Restore sample tasks</strong><span>Replace your current list with the original demo tasks.</span></div>
          <button className="button button-quiet" onClick={restoreDemo}><RotateCcw size={15} />Restore demo</button>
        </div>
        <div className="setting-row">
          <div><strong>Clear all tasks</strong><span>Permanently remove every task from this browser.</span></div>
          <button className="button button-danger" onClick={removeAll}><Trash2 size={15} />Clear tasks</button>
        </div>
      </section>
      <p className="settings-note"><span className="live-dot" />Your data never leaves this device.</p>
    </div>
  );
};
