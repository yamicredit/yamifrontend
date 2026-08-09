import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownLeftIcon, ArrowUpRightIcon, ChevronRightIcon } from 'lucide-react';
import { StatusPill } from '../StatusPill';
import { Avatar } from '../Avatar';
import type { Agreement } from '../../types/yami';
import {
  ECOSYSTEM_META,
  STATUS_META,
  nextInstalment,
  outstandingAmount,
  progressPercent } from
'../../utils/agreement';
import { dueLabel, formatNaira } from '../../utils/format';
import { card, focusRing, hairline, mono, textPrimary, textSecondary } from '../../utils/ui';

interface AgreementCardProps {
  agreement: Agreement;
}

export function AgreementCard({ agreement }: AgreementCardProps) {
  const outstanding = outstandingAmount(agreement);
  const progress = progressPercent(agreement);
  const upcoming = nextInstalment(agreement);
  const meta = STATUS_META[agreement.status];
  const lent = agreement.direction === 'lent';

  return (
    <Link
      to={`/agreements/${agreement.id}`}
      className={`${card} ${focusRing} block p-3.5 transition-colors hover:border-accent/50 dark:hover:border-accent-dark/50`}>
      
      <div className="flex items-start gap-3">
        <Avatar name={agreement.counterparty.name} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className={`truncate text-sm font-semibold ${textPrimary}`}>
                {agreement.counterparty.name}
              </p>
              <p className={`truncate text-xs ${textSecondary}`}>
                {agreement.description}
              </p>
            </div>
            <StatusPill status={meta.pill} size="sm">
              {meta.label}
            </StatusPill>
          </div>

          <div className="mt-3 flex items-end justify-between gap-3">
            <div>
              <p className={`text-[11px] uppercase tracking-wide ${textSecondary}`}>
                {lent ? 'Owed to me' : 'I owe'}
              </p>
              <p className={`${mono} text-base font-semibold ${textPrimary}`}>
                {formatNaira(outstanding)}
              </p>
            </div>
            <div className="text-right">
              <p
                className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                lent ?
                'text-success-foreground dark:text-success-foreground-dark' :
                'text-info-foreground dark:text-info-foreground-dark'}`
                }>
                
                {lent ?
                <ArrowUpRightIcon className="h-3 w-3" aria-hidden="true" /> :

                <ArrowDownLeftIcon className="h-3 w-3" aria-hidden="true" />
                }
                {lent ? 'I lent' : 'I borrowed'}
              </p>
              <p className={`text-[11px] ${textSecondary}`}>
                {ECOSYSTEM_META[agreement.ecosystem].short}
              </p>
            </div>
          </div>

          <div className="mt-2.5 flex items-center gap-2">
            <div
              className={`h-1 flex-1 overflow-hidden rounded-full bg-muted`}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Repayment progress">
              
              <div
                className="h-full rounded-full bg-accent dark:bg-accent-dark"
                style={{ width: `${progress}%` }} />
              
            </div>
            <span className={`${mono} text-[11px] ${textSecondary}`}>{progress}%</span>
          </div>

          <div className={`mt-2.5 flex items-center justify-between border-t pt-2 ${hairline}`}>
            <span className={`text-[11px] ${textSecondary}`}>
              {upcoming ? dueLabel(upcoming.dueDate) : 'No payment outstanding'}
            </span>
            <span className={`inline-flex items-center gap-0.5 text-[11px] font-medium text-accent dark:text-accent-dark`}>
              Open
              <ChevronRightIcon className="h-3 w-3" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </Link>);

}