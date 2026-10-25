import { ArrowDown, ArrowUp, ChevronsUp, Minus } from 'lucide-react';
import type { TaskPriority } from '../../types/task';

const priorityIcons = {
  Low: ArrowDown,
  Medium: Minus,
  High: ArrowUp,
  Critical: ChevronsUp,
};

export const TaskPriorityBadge = ({ priority }: { priority: TaskPriority }) => {
  const Icon = priorityIcons[priority];
  return (
    <span className={`badge priority-badge priority-${priority.toLowerCase()}`}>
      <Icon size={14} strokeWidth={2.2} />{priority}
    </span>
  );
};
