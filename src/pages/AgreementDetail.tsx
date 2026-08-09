import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BellIcon,
  CheckCircle2Icon,
  FileTextIcon,
  LifeBuoyIcon,
  MessageSquareIcon,
  PlusIcon } from
'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { StatusPill } from '../components/StatusPill';
import { Skeleton } from '../components/Skeleton';
import { Dialog } from '../components/Dialog';
import { Textarea } from '../components/Textarea';
import { PartyRow } from '../components/common/PartyRow';
import { EmptyState } from '../components/common/EmptyState';
import { RepaymentSchedule } from '../components/agreements/RepaymentSchedule';
import { PaymentHistory } from '../components/agreements/PaymentHistory';
import { RecordPaymentDrawer } from '../components/agreements/RecordPaymentDrawer';
import { ResolutionLadder } from '../components/resolution/ResolutionLadder';
import { RestructureDrawer } from '../components/resolution/RestructureDrawer';
import { RestructureProposalCard } from '../components/resolution/RestructureProposalCard';
import { AcquisitionOfferCard } from '../components/resolution/AcquisitionOfferCard';
import { useYami } from '../contexts/YamiContext';
import {
  ECOSYSTEM_META,
  STATUS_META,
  outstandingAmount,
  paidAmount,
  pendingConfirmation,
  progressPercent } from
'../utils/agreement';
import { dueLabel, formatDate, formatNaira } from '../utils/format';
import { card, hairline, mono, textPrimary, textSecondary } from '../utils/ui';

export function AgreementDetail() {
  const { agreementId = '' } = useParams();
  const navigate = useNavigate();
  const {
    getAgreement,
    user,
    loading,
    acceptAgreement,
    declineAgreement,
    recordPayment,
    confirmPayment,
    disputePayment,
    sendReminder,
    openIntervention,
    proposeRestructure,
    respondToProposal,
    requestMediation,
    respondToOffer
  } = useYami();

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [restructureOpen, setRestructureOpen] = useState(false);
  const [interventionOpen, setInterventionOpen] = useState(false);
  const [interventionNote, setInterventionNote] = useState('');

  const agreement = getAgreement(agreementId);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="rect" height={80} />
        <Skeleton variant="rect" height={140} />
        <Skeleton variant="rect" height={220} />
      </div>);

  }

  if (!agreement) {
    return (
      <EmptyState
        icon={<FileTextIcon className="h-5 w-5" />}
        title="Agreement not found"
        description="This agreement may have been removed, or the link is out of date."
        action={
        <Button variant="secondary" onClick={() => navigate('/agreements')}>
            Back to agreements
          </Button>
        } />);


  }

  const meta = STATUS_META[agreement.status];
  const outstanding = outstandingAmount(agreement);
  const paid = paidAmount(agreement);
  const awaiting = pendingConfirmation(agreement);
  const progress = progressPercent(agreement);
  const lent = agreement.direction === 'lent';
  const canConfirm = agreement.payments.some(
    (payment) => !payment.confirmed && !payment.disputed
  );
  const closed = ['settled', 'written_off', 'declined'].includes(agreement.status);
  const acquired = ['acquired', 'in_recovery'].includes(agreement.status);

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumbs={[
        { label: 'Agreements', href: '/agreements' },
        { label: agreement.reference }]
        }
        title={agreement.counterparty.name}
        description={agreement.description}
        badge={<StatusPill status={meta.pill}>{meta.label}</StatusPill>}
        actions={
        !closed && !acquired ?
        <div className="flex flex-wrap gap-2">
              {agreement.status === 'pending' ?
          <>
                  <Button onClick={() => acceptAgreement(agreement.id)}>
                    Accept terms
                  </Button>
                  <Button
              variant="secondary"
              onClick={() => declineAgreement(agreement.id)}>
              
                    Decline
                  </Button>
                </> :

          <>
                  <Button
              leadingIcon={<PlusIcon className="h-4 w-4" />}
              onClick={() => setPaymentOpen(true)}>
              
                    Record payment
                  </Button>
                  {lent ?
            <Button
              variant="secondary"
              leadingIcon={<BellIcon className="h-4 w-4" />}
              onClick={() => sendReminder(agreement.id)}>
              
                      Send reminder
                    </Button> :
            null}
                </>
          }
            </div> :
        null
        } />
      

      <p className={`text-xs ${textSecondary}`}>{meta.description}</p>

      {agreement.status === 'settled' ?
      <div className="flex items-start gap-2.5 rounded-lg border border-success-foreground/30 bg-success-background px-3.5 py-3 text-success-foreground">
          <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p className="text-xs">
            Fully repaid and closed. This agreement now counts towards both parties&rsquo;
            portable reputation.
          </p>
        </div> :
      null}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <section className={card} aria-labelledby="balance-heading">
            <div className={`border-b px-4 py-3 ${hairline}`}>
              <h2 id="balance-heading" className={`text-sm font-semibold ${textPrimary}`}>
                {lent ? 'Owed to you' : 'You owe'}
              </h2>
            </div>
            <div className="px-4 py-3.5">
              <p className={`${mono} text-2xl font-semibold ${textPrimary}`}>
                {formatNaira(outstanding)}
                <span className={`ml-2 text-sm font-normal ${textSecondary}`}>
                  of {formatNaira(agreement.principal)}
                </span>
              </p>
              <div
                className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Repayment progress">
                
                <div
                  className="h-full rounded-full bg-accent dark:bg-accent-dark"
                  style={{ width: `${progress}%` }} />
                
              </div>
              <dl className="mt-3.5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div>
                  <dt className={`text-[11px] uppercase tracking-wide ${textSecondary}`}>
                    Repaid
                  </dt>
                  <dd className={`${mono} text-sm font-semibold ${textPrimary}`}>
                    {formatNaira(paid)}
                  </dd>
                </div>
                <div>
                  <dt className={`text-[11px] uppercase tracking-wide ${textSecondary}`}>
                    Awaiting confirmation
                  </dt>
                  <dd className={`${mono} text-sm font-semibold ${textPrimary}`}>
                    {formatNaira(awaiting)}
                  </dd>
                </div>
                <div>
                  <dt className={`text-[11px] uppercase tracking-wide ${textSecondary}`}>
                    Final due date
                  </dt>
                  <dd className={`text-sm ${textPrimary}`}>
                    {formatDate(agreement.dueDate)}
                  </dd>
                </div>
                <div>
                  <dt className={`text-[11px] uppercase tracking-wide ${textSecondary}`}>
                    Timing
                  </dt>
                  <dd className={`text-sm ${textPrimary}`}>
                    {dueLabel(agreement.dueDate)}
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          <RepaymentSchedule agreement={agreement} />

          <PaymentHistory
            agreement={agreement}
            canConfirm={canConfirm && !closed}
            onConfirm={(paymentId) => confirmPayment(agreement.id, paymentId)}
            onDispute={(paymentId) => disputePayment(agreement.id, paymentId)} />
          

          {agreement.resolution?.proposal ?
          <RestructureProposalCard
            proposal={agreement.resolution.proposal}
            counterpartyName={agreement.counterparty.name}
            onRespond={(response) => respondToProposal(agreement.id, response)} /> :

          null}

          {agreement.resolution?.offer ?
          <AcquisitionOfferCard
            offer={agreement.resolution.offer}
            counterpartyName={agreement.counterparty.name}
            onRespond={(response) => respondToOffer(agreement.id, response)} /> :

          null}
        </div>

        <div className="space-y-4">
          <section className={card} aria-labelledby="parties-heading">
            <div className={`border-b px-4 py-3 ${hairline}`}>
              <h2 id="parties-heading" className={`text-sm font-semibold ${textPrimary}`}>
                Parties
              </h2>
            </div>
            <div className="space-y-3 px-4 py-3.5">
              <PartyRow
                name={user.name}
                role={lent ? 'Lender (you)' : 'Borrower (you)'}
                verification={user.verification}
                meta={user.location} />
              
              <PartyRow
                name={agreement.counterparty.name}
                role={lent ? 'Borrower' : 'Lender'}
                verification={agreement.counterparty.verification}
                meta={agreement.counterparty.location} />
              
              <div className={`border-t pt-3 text-xs ${hairline} ${textSecondary}`}>
                <p>{ECOSYSTEM_META[agreement.ecosystem].label}</p>
                <p className="mt-0.5">
                  {agreement.exchangeKind === 'cash' ?
                  'Cash exchanged' :
                  'Goods supplied on credit'}{' '}
                  · created {formatDate(agreement.createdOn)}
                </p>
                {agreement.note ?
                <p className="mt-2 italic">&ldquo;{agreement.note}&rdquo;</p> :
                null}
              </div>
            </div>
          </section>

          {agreement.resolution || !closed && agreement.status !== 'pending' ?
          <section className={card} aria-labelledby="resolution-heading">
              <div className={`border-b px-4 py-3 ${hairline}`}>
                <h2
                id="resolution-heading"
                className={`text-sm font-semibold ${textPrimary}`}>
                
                  Resolution
                </h2>
                <p className={`text-xs ${textSecondary}`}>
                  Structured steps that protect the relationship.
                </p>
              </div>
              <div className="px-4 py-3.5">
                <ResolutionLadder resolution={agreement.resolution} compact />
              </div>
              {!closed && !acquired ?
            <div className={`flex flex-col gap-2 border-t px-4 py-3 ${hairline}`}>
                  <Button
                variant="secondary"
                size="sm"
                fullWidth
                leadingIcon={<MessageSquareIcon className="h-4 w-4" />}
                onClick={() => setInterventionOpen(true)}>
                
                    Open early intervention
                  </Button>
                  <Button
                variant="secondary"
                size="sm"
                fullWidth
                onClick={() => setRestructureOpen(true)}>
                
                    Propose new terms
                  </Button>
                  <Button
                variant="secondary"
                size="sm"
                fullWidth
                leadingIcon={<LifeBuoyIcon className="h-4 w-4" />}
                onClick={() => requestMediation(agreement.id)}>
                
                    Request mediation
                  </Button>
                </div> :
            null}
            </section> :
          null}

          {agreement.resolution?.events.length ?
          <section className={card} aria-labelledby="timeline-heading">
              <div className={`border-b px-4 py-3 ${hairline}`}>
                <h2
                id="timeline-heading"
                className={`text-sm font-semibold ${textPrimary}`}>
                
                  Resolution history
                </h2>
              </div>
              <ul className="divide-y divide-border dark:divide-border-dark">
                {agreement.resolution.events.map((event) =>
              <li key={event.id} className="px-4 py-3">
                    <p className={`text-xs font-medium ${textPrimary}`}>{event.title}</p>
                    <p className={`mt-0.5 text-[11px] leading-normal ${textSecondary}`}>
                      {event.detail}
                    </p>
                    <p className={`mt-1 ${mono} text-[10px] ${textSecondary}`}>
                      {formatDate(event.date)} · {event.actor}
                    </p>
                  </li>
              )}
              </ul>
            </section> :
          null}
        </div>
      </div>

      <RecordPaymentDrawer
        agreement={agreement}
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        onSubmit={(input) => recordPayment(agreement.id, input)} />
      

      <RestructureDrawer
        agreement={agreement}
        open={restructureOpen}
        onClose={() => setRestructureOpen(false)}
        onSubmit={(input) => proposeRestructure(agreement.id, input)} />
      

      <Dialog
        open={interventionOpen}
        onClose={() => setInterventionOpen(false)}
        title="Open early intervention"
        description="Start a documented conversation before the relationship is damaged."
        size="sm"
        footer={
        <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setInterventionOpen(false)}>
              Cancel
            </Button>
            <Button
            onClick={() => {
              openIntervention(agreement.id, interventionNote);
              setInterventionNote('');
              setInterventionOpen(false);
            }}>
            
              Open intervention
            </Button>
          </div>
        }>
        
        <Textarea
          label="What has changed?"
          placeholder="e.g. Sales dropped this month and the second instalment will be late."
          rows={3}
          value={interventionNote}
          onChange={(event) => setInterventionNote(event.target.value)} />
        
      </Dialog>
    </div>);

}