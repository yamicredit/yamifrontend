import React from 'react';
import { Button } from '../Button';
import { Badge } from '../Badge';
import type { RestructureProposal } from '../../types/yami';
import { formatDate, formatNaira } from '../../utils/format';
import { card, hairline, mono, textPrimary, textSecondary } from '../../utils/ui';

interface RestructureProposalCardProps {
  proposal: RestructureProposal;
  counterpartyName: string;
  onRespond: (response: 'accepted' | 'declined') => void;
}

export function RestructureProposalCard({
  proposal,
  counterpartyName,
  onRespond
}: RestructureProposalCardProps) {
  const pending = proposal.status === 'proposed';
  const byThem = proposal.proposedBy === 'them';

  return (
    <section className={card} aria-labelledby="proposal-heading">
      <div className={`flex items-start justify-between gap-3 border-b px-4 py-3 ${hairline}`}>
        <div>
          <h2 id="proposal-heading" className={`text-sm font-semibold ${textPrimary}`}>
            {byThem ?
            `${counterpartyName} proposed new terms` :
            'You proposed new terms'}
          </h2>
          <p className={`text-xs ${textSecondary}`}>
            The amount owed does not change — only the schedule.
          </p>
        </div>
        <Badge
          variant={
          proposal.status === 'accepted' ?
          'success' :
          proposal.status === 'declined' ?
          'neutral' :
          'warning'
          }>
          
          {proposal.status === 'proposed' ? 'Awaiting response' : proposal.status}
        </Badge>
      </div>

      <div className="px-4 py-3.5">
        <p className={`${mono} text-lg font-semibold ${textPrimary}`}>
          {proposal.newInstalmentCount} × {formatNaira(proposal.newInstalmentAmount)}
        </p>
        <p className={`text-xs ${textSecondary}`}>
          Starting {formatDate(proposal.firstPaymentDate)}, every two weeks.
        </p>
        <p className={`mt-2.5 rounded-md bg-muted px-3 py-2 text-xs italic ${textSecondary}`}>
          &ldquo;{proposal.reason}&rdquo;
        </p>
        {proposal.counterNote ?
        <p className={`mt-2 text-xs ${textSecondary}`}>
            Your note: {proposal.counterNote}
          </p> :
        null}
      </div>

      {pending && byThem ?
      <div className={`flex flex-col gap-2 border-t px-4 py-3 sm:flex-row ${hairline}`}>
          <Button fullWidth onClick={() => onRespond('accepted')}>
            Accept new terms
          </Button>
          <Button variant="secondary" fullWidth onClick={() => onRespond('declined')}>
            Decline
          </Button>
        </div> :
      null}
    </section>);

}