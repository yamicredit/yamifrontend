import React from 'react';
import { LockIcon } from 'lucide-react';
import { Button } from '../Button';
import { Badge } from '../Badge';
import type { Agreement } from '../../types/yami';
import { PAYMENT_METHOD_LABEL } from '../../utils/agreement';
import { formatDate, formatNaira } from '../../utils/format';
import { card, hairline, mono, textPrimary, textSecondary } from '../../utils/ui';

interface PaymentHistoryProps {
  agreement: Agreement;
  canConfirm: boolean;
  onConfirm: (paymentId: string) => void;
  onDispute: (paymentId: string) => void;
}

export function PaymentHistory({
  agreement,
  canConfirm,
  onConfirm,
  onDispute
}: PaymentHistoryProps) {
  return (
    <section className={card} aria-labelledby="history-heading">
      <div className={`flex items-center justify-between border-b px-4 py-3 ${hairline}`}>
        <div>
          <h2 id="history-heading" className={`text-sm font-semibold ${textPrimary}`}>
            Payment history
          </h2>
          <p className={`text-xs ${textSecondary}`}>
            Confirmed entries cannot be edited or deleted.
          </p>
        </div>
        <LockIcon
          className="h-4 w-4 text-text-secondary dark:text-text-secondary-dark"
          aria-hidden="true" />
        
      </div>

      {agreement.payments.length === 0 ?
      <p className={`px-4 py-6 text-center text-xs ${textSecondary}`}>
          No payments recorded yet.
        </p> :

      <ul className="divide-y divide-border dark:divide-border-dark">
          {agreement.payments.map((payment) =>
        <li key={payment.id} className="px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className={`text-sm ${textPrimary}`}>{formatDate(payment.date)}</p>
                  <p className={`truncate text-xs ${textSecondary}`}>
                    {PAYMENT_METHOD_LABEL[payment.method]}
                    {payment.reference ? ` · ${payment.reference}` : ''} · recorded by{' '}
                    {payment.recordedBy === 'me' ? 'you' : agreement.counterparty.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`${mono} text-sm font-semibold ${textPrimary}`}>
                    {formatNaira(payment.amount)}
                  </p>
                  <Badge
                size="sm"
                variant={
                payment.disputed ?
                'danger' :
                payment.confirmed ?
                'success' :
                'warning'
                }
                dot>
                
                    {payment.disputed ?
                'Disputed' :
                payment.confirmed ?
                'Confirmed' :
                'Awaiting confirmation'}
                  </Badge>
                </div>
              </div>

              {!payment.confirmed && !payment.disputed && canConfirm ?
          <div className="mt-2.5 flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => onConfirm(payment.id)}>
                    Confirm payment
                  </Button>
                  <Button
              size="sm"
              variant="secondary"
              onClick={() => onDispute(payment.id)}>
              
                    I did not receive this
                  </Button>
                </div> :
          null}

              {payment.disputed ?
          <p className="mt-2 rounded-md bg-danger-background px-2.5 py-2 text-[11px] text-danger-foreground dark:bg-danger-background-dark dark:text-danger-foreground-dark">
                  Disputed — this amount is held out of the balance until both parties
                  agree. YAMI mediation can settle the claim.
                </p> :
          null}
            </li>
        )}
        </ul>
      }
    </section>);

}