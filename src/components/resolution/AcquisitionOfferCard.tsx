import React, { useState } from 'react';
import { BanknoteIcon, CheckIcon, InfoIcon } from 'lucide-react';
import { Button } from '../Button';
import { Dialog } from '../Dialog';
import { Badge } from '../Badge';
import type { AcquisitionOffer } from '../../types/yami';
import { formatDate, formatNaira } from '../../utils/format';
import { card, hairline, mono, textPrimary, textSecondary } from '../../utils/ui';

interface AcquisitionOfferCardProps {
  offer: AcquisitionOffer;
  counterpartyName: string;
  onRespond: (response: 'accepted' | 'declined') => void;
}

export function AcquisitionOfferCard({
  offer,
  counterpartyName,
  onRespond
}: AcquisitionOfferCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (offer.status === 'ineligible') {
    return (
      <section className={`${card} p-4`} aria-labelledby="offer-heading">
        <h2 id="offer-heading" className={`text-sm font-semibold ${textPrimary}`}>
          Debt purchase not available
        </h2>
        <ul className={`mt-2 space-y-1.5 text-xs ${textSecondary}`}>
          {offer.reasons.map((reason) =>
          <li key={reason} className="flex gap-2">
              <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {reason}
            </li>
          )}
        </ul>
      </section>);

  }

  const accepted = offer.status === 'accepted';
  const declined = offer.status === 'declined';

  return (
    <section
      className={`${card} overflow-hidden`}
      aria-labelledby="offer-heading">
      
      <div className={`flex items-start justify-between gap-3 border-b px-4 py-3 ${hairline}`}>
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-md bg-accent-subtle text-accent-subtle-foreground dark:bg-accent-subtle-dark dark:text-accent-subtle-foreground-dark">
            <BanknoteIcon className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2 id="offer-heading" className={`text-sm font-semibold ${textPrimary}`}>
              YAMI can buy this debt
            </h2>
            <p className={`text-xs ${textSecondary}`}>
              You take liquidity now and exit the recovery process.
            </p>
          </div>
        </div>
        {accepted ? <Badge variant="info">Accepted</Badge> : null}
        {declined ? <Badge variant="neutral">Declined</Badge> : null}
      </div>

      <div className="grid gap-3 px-4 py-3.5 sm:grid-cols-2">
        <div>
          <p className={`text-[11px] uppercase tracking-wide ${textSecondary}`}>
            YAMI pays you
          </p>
          <p className={`${mono} text-xl font-semibold ${textPrimary}`}>
            {formatNaira(offer.offerAmount)}
          </p>
        </div>
        <div>
          <p className={`text-[11px] uppercase tracking-wide ${textSecondary}`}>
            Outstanding balance
          </p>
          <p className={`${mono} text-xl font-semibold ${textPrimary}`}>
            {formatNaira(offer.outstanding)}
          </p>
        </div>
      </div>

      <div className={`border-t px-4 py-3 ${hairline}`}>
        <p className={`text-[11px] font-semibold uppercase tracking-wide ${textSecondary}`}>
          Why this debt is eligible
        </p>
        <ul className={`mt-1.5 space-y-1.5 text-xs ${textSecondary}`}>
          {offer.reasons.map((reason) =>
          <li key={reason} className="flex gap-2">
              <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {reason}
            </li>
          )}
        </ul>
        {offer.status === 'available' ?
        <p className={`mt-2 text-[11px] ${textSecondary}`}>
            Offer valid until {formatDate(offer.expiresOn)}. Acceptance is not automatic
            — YAMI completes affordability and legal checks before funds are released.
          </p> :
        null}
      </div>

      {accepted ?
      <div className={`border-t px-4 py-3 ${hairline}`}>
          <p className={`text-[11px] uppercase tracking-wide ${textSecondary}`}>
            Recovered by YAMI so far
          </p>
          <p className={`${mono} text-base font-semibold ${textPrimary}`}>
            {formatNaira(offer.recoveredToDate ?? 0)}
          </p>
          <p className={`mt-1 text-xs ${textSecondary}`}>
            {counterpartyName} now repays YAMI directly on an agreed plan. You have no
            further recovery work on this agreement.
          </p>
        </div> :
      null}

      {offer.status === 'available' ?
      <div className={`flex flex-col gap-2 border-t px-4 py-3 sm:flex-row ${hairline}`}>
          <Button fullWidth onClick={() => setConfirmOpen(true)}>
            Accept offer
          </Button>
          <Button variant="secondary" fullWidth onClick={() => onRespond('declined')}>
            Keep the debt
          </Button>
        </div> :
      null}

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Sell this debt to YAMI?"
        description={`You receive ${formatNaira(offer.offerAmount)} and YAMI takes over recovery from ${counterpartyName}.`}
        size="sm"
        footer={
        <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
            onClick={() => {
              setConfirmOpen(false);
              onRespond('accepted');
            }}>
            
              Confirm sale
            </Button>
          </div>
        }>
        
        <ul className={`space-y-1.5 text-xs ${textSecondary}`}>
          <li>· Funds settle to your account within 2 working days.</li>
          <li>· You stop chasing repayment; YAMI becomes the counterparty.</li>
          <li>
            · {counterpartyName} keeps a single, workable repayment plan rather than
            multiple demands.
          </li>
        </ul>
      </Dialog>
    </section>);

}