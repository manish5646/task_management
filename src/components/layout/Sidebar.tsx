import { CheckSquare2, LayoutDashboard, ListTodo, Settings2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/tasks', label: 'All tasks', icon: ListTodo, end: false },
  { to: '/board', label: 'Kanban board', icon: CheckSquare2, end: false },
  { to: '/settings', label: 'Settings', icon: Settings2, end: false },
];

export const Sidebar = () => (
  <aside className="sidebar">
    <NavLink className="brand" to="/" aria-label="Task home">
      <span className="brand-mark"><CheckSquare2 size={19} /></span>
      <span>Task<span className="brand-period">.</span></span>
    </NavLink>
    <div className="workspace-label">WORKSPACE</div>
    <nav className="side-nav" aria-label="Main navigation">
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <Icon size={18} strokeWidth={1.8} />
          <span>{label}</span>
          {label === 'All tasks' && <span className="nav-count">↗</span>}
        </NavLink>
      ))}
    </nav>
    <div className="sidebar-footer">
      <div className="avatar avatar-indigo">MM</div>
      <div className="profile-copy"><strong>manish_mishra</strong><span>Personal workspace</span></div>
      <span className="profile-menu" aria-hidden="true">···</span>
    </div>
  </aside>
);
