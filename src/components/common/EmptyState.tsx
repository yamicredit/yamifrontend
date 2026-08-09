import React from 'react';
import { card, textPrimary, textSecondary } from '../../utils/ui';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className={`${card} flex flex-col items-center gap-3 px-5 py-10 text-center`}>
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-text-secondary">
        {icon}
      </span>
      <div className="space-y-1">
        <h3 className={`text-sm font-semibold ${textPrimary}`}>{title}</h3>
        <p className={`mx-auto max-w-sm text-xs leading-normal ${textSecondary}`}>
          {description}
        </p>
      </div>
      {action}
    </div>);

}