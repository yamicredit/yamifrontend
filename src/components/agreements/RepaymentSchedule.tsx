import React from 'react';
import { CheckIcon, ClockIcon, AlertTriangleIcon, CircleIcon } from 'lucide-react';
import type { Agreement } from '../../types/yami';
import { instalmentPaidStatus } from '../../utils/agreement';
import { formatDate, formatNaira } from '../../utils/format';
import { card, hairline, mono, textPrimary, textSecondary } from '../../utils/ui';

const STATUS_UI: Record<
  ReturnType<typeof instalmentPaidStatus>,
  {label: string;icon: React.ReactNode;className: string;}> =
{
  paid: {
    label: 'Paid',
    icon: <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />,
    className: 'text-success-foreground dark:text-success-foreground-dark'
  },
  partial: {
    label: 'Part paid',
    icon: <ClockIcon className="h-3.5 w-3.5" aria-hidden="true" />,
    className: 'text-info-foreground dark:text-info-foreground-dark'
  },
  late: {
    label: 'Late',
    icon: <AlertTriangleIcon className="h-3.5 w-3.5" aria-hidden="true" />,
    className: 'text-danger-foreground dark:text-danger-foreground-dark'
  },
  due: {
    label: 'Due soon',
    icon: <ClockIcon className="h-3.5 w-3.5" aria-hidden="true" />,
    className: 'text-warning-foreground dark:text-warning-foreground-dark'
  },
  upcoming: {
    label: 'Upcoming',
    icon: <CircleIcon className="h-3.5 w-3.5" aria-hidden="true" />,
    className: 'text-text-secondary dark:text-text-secondary-dark'
  }
};

export function RepaymentSchedule({ agreement }: {agreement: Agreement;}) {
  return (
    <section className={card} aria-labelledby="schedule-heading">
      <div className={`border-b px-4 py-3 ${hairline}`}>
        <h2 id="schedule-heading" className={`text-sm font-semibold ${textPrimary}`}>
          Repayment schedule
        </h2>
        <p className={`text-xs ${textSecondary}`}>
          {agreement.plan === 'instalments' ?
          `${agreement.instalments.length} instalments` :
          'Single lump sum'}
        </p>
      </div>
      <ul className="divide-y divide-border dark:divide-border-dark">
        {agreement.instalments.map((instalment, index) => {
          const status = instalmentPaidStatus(agreement, instalment);
          const ui = STATUS_UI[status];
          return (
            <li
              key={instalment.id}
              className="flex items-center justify-between gap-3 px-4 py-2.5">
              
              <div className="flex items-center gap-3">
                <span className={`${mono} text-xs ${textSecondary}`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className={`text-sm ${textPrimary}`}>
                    {formatDate(instalment.dueDate)}
                  </p>
                  <p
                    className={`inline-flex items-center gap-1 text-[11px] font-medium ${ui.className}`}>
                    
                    {ui.icon}
                    {ui.label}
                  </p>
                </div>
              </div>
              <span className={`${mono} text-sm font-semibold ${textPrimary}`}>
                {formatNaira(instalment.amount)}
              </span>
            </li>);

        })}
      </ul>
    </section>);

}