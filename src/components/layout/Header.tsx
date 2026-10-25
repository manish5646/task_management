import { Plus, Search } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/tasks': 'All tasks',
  '/board': 'Kanban board',
  '/settings': 'Settings',
};

export const Header = ({ onCreateTask }: { onCreateTask: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInput = useRef<HTMLInputElement>(null);
  const title = location.pathname.startsWith('/tasks/')
    ? 'Task details'
    : titles[location.pathname] ?? 'Workspace';

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInput.current?.focus();
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const updateSearch = (value: string) => {
    const next = new URLSearchParams();
    if (value) next.set('q', value);
    if (location.pathname !== '/tasks' && value) {
      navigate({ pathname: '/tasks', search: `?${next.toString()}` });
    } else {
      setSearchParams(next, { replace: true });
    }
  };

  return (
    <header className="topbar">
      <div className="mobile-brand">Task<span className="brand-period">.</span></div>
      <h1>{title}</h1>
      <div className="topbar-actions">
        <label className="global-search">
          <Search size={16} aria-hidden="true" />
          <input
            aria-label="Search tasks"
            placeholder="Search tasks..."
            ref={searchInput}
            value={searchParams.get('q') ?? ''}
            onChange={(event) => updateSearch(event.target.value)}
          />
          <kbd>{navigator.platform.includes('Mac') ? '⌘ K' : 'Ctrl K'}</kbd>
        </label>
        <button className="button button-primary create-button" onClick={onCreateTask}>
          <Plus size={17} /><span>New task</span>
        </button>
      </div>
    </header>
  );
};
