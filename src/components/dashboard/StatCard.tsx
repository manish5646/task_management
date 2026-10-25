import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  note: string;
  icon: LucideIcon;
  tone: 'violet' | 'green' | 'blue' | 'amber';
}

export const StatCard = ({ label, value, note, icon: Icon, tone }: StatCardProps) => (
  <article className="stat-card">
    <div className={`stat-icon stat-${tone}`}><Icon size={18} strokeWidth={1.9} /></div>
    <span className="stat-label">{label}</span>
    <div className="stat-value">{value}</div>
    <span className="stat-note">{note}</span>
  </article>
);
