import React from 'react';
import { ShieldAlertIcon, ShieldCheckIcon } from 'lucide-react';
import { Avatar } from '../Avatar';
import { Badge } from '../Badge';
import type { VerificationTier } from '../../types/yami';
import { VERIFICATION_META } from '../../utils/agreement';
import { textPrimary, textSecondary } from '../../utils/ui';

interface PartyRowProps {
  name: string;
  role: string;
  verification: VerificationTier;
  meta?: string;
  size?: 'sm' | 'md';
}

export function PartyRow({
  name,
  role,
  verification,
  meta,
  size = 'md'
}: PartyRowProps) {
  const verified = VERIFICATION_META[verification].level >= 2;
  return (
    <div className="flex items-center gap-3">
      <Avatar name={name} size={size === 'sm' ? 'sm' : 'md'} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`truncate text-sm font-semibold ${textPrimary}`}>
            {name}
          </span>
          <Badge
            size="sm"
            variant={verified ? 'success' : 'warning'}
            icon={
            verified ?
            <ShieldCheckIcon className="h-3 w-3" aria-hidden="true" /> :

            <ShieldAlertIcon className="h-3 w-3" aria-hidden="true" />

            }>
            
            {VERIFICATION_META[verification].short}
          </Badge>
        </div>
        <p className={`truncate text-xs ${textSecondary}`}>
          {role}
          {meta ? ` · ${meta}` : ''}
        </p>
      </div>
    </div>);

}