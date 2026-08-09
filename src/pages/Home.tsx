import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertTriangleIcon,
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  ClockIcon,
  HandshakeIcon,
  PlusIcon,
  SparklesIcon } from
'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { Button } from '../components/Button';
import { Skeleton } from '../components/Skeleton';
import { AgreementCard } from '../components/agreements/AgreementCard';
import { EmptyState } from '../components/common/EmptyState';
import { useYami } from '../contexts/YamiContext';
import {
  isOpen,
  isTroubled,
  nextInstalment,
  totalByDirection } from
'../utils/agreement';
import { dueLabel, formatNaira, relativeDay } from '../utils/format';
import { card, hairline, mono, textPrimary, textSecondary } from '../utils/ui';

export function Home() {
  const navigate = useNavigate();
  const { agreements, notifications, reputation, loading } = useYami();

  const owedToMe = totalByDirection(agreements, 'lent');
  const iOwe = totalByDirection(agreements, 'borrowed');
  const troubled = agreements.filter(isTroubled);
  const pending = agreements.filter((a) => a.status === 'pending');
  const awaitingConfirmation = agreements.filter((a) =>
  a.payments.some((p) => !p.confirmed && !p.disputed)
  );

  const upcoming = agreements.
  filter((a) => isOpen(a) && a.status !== 'pending').
  map((a) => ({ agreement: a, instalment: nextInstalment(a) })).
  filter((entry) => entry.instalment).
  sort(
    (a, b) =>
    new Date(a.instalment!.dueDate).getTime() -
    new Date(b.instalment!.dueDate).getTime()
  ).
  slice(0, 3);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="rect" height={72} />
        <div className="grid gap-3 sm:grid-cols-3">
          <Skeleton variant="rect" height={92} />
          <Skeleton variant="rect" height={92} />
          <Skeleton variant="rect" height={92} />
        </div>
        <Skeleton variant="rect" height={120} />
        <Skeleton variant="rect" height={160} />
      </div>);

  }

  const hasAgreements = agreements.length > 0;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Good day, Adaeze"
        description="Your two-sided position across every credit relationship."
        actions={
        <Button
          leadingIcon={<PlusIcon className="h-4 w-4" />}
          onClick={() => navigate('/agreements/new')}>
          
            New agreement
          </Button>
        } />
      

      {!hasAgreements ?
      <EmptyState
        icon={<HandshakeIcon className="h-5 w-5" />}
        title="Start with a relationship you already trust"
        description="YAMI documents credit you already give or receive: agree the terms, verify both identities, track repayments, and build a reputation you can carry anywhere."
        action={
        <Button onClick={() => navigate('/agreements/new')}>
              Create your first agreement
            </Button>
        } /> :


      <>
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard
            label="Owed to me"
            value={formatNaira(owedToMe)}
            caption={`${agreements.filter((a) => a.direction === 'lent' && isOpen(a)).length} agreements as lender`}
            icon={<ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />} />
          
            <StatCard
            label="I owe"
            value={formatNaira(iOwe)}
            caption={`${agreements.filter((a) => a.direction === 'borrowed' && isOpen(a)).length} agreements as borrower`}
            icon={<ArrowDownLeftIcon className="h-4 w-4" aria-hidden="true" />} />
          
            <StatCard
            label="Reputation score"
            value={reputation.score}
            caption={`${reputation.band} · ${reputation.onTimeRate}% on time`}
            icon={<SparklesIcon className="h-4 w-4" aria-hidden="true" />} />
          
          </div>

          {troubled.length || pending.length || awaitingConfirmation.length ?
        <section aria-label="Needs your attention" className="space-y-2">
              {troubled.length ?
          <Link
            to="/resolution"
            className="flex items-center gap-2.5 rounded-lg border border-danger-foreground/30 bg-danger-background px-3.5 py-3 text-danger-foreground">
            
                  <AlertTriangleIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="text-xs font-medium">
                    {troubled.length} agreement{troubled.length > 1 ? 's' : ''} need
                    resolution — open the resolution centre
                  </span>
                </Link> :
          null}
              {awaitingConfirmation.length ?
          <Link
            to={`/agreements/${awaitingConfirmation[0].id}`}
            className="flex items-center gap-2.5 rounded-lg border border-warning-foreground/30 bg-warning-background px-3.5 py-3 text-warning-foreground">
            
                  <ClockIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="text-xs font-medium">
                    {awaitingConfirmation.length} payment
                    {awaitingConfirmation.length > 1 ? 's' : ''} waiting for your
                    confirmation
                  </span>
                </Link> :
          null}
              {pending.length ?
          <Link
            to="/agreements"
            className="flex items-center gap-2.5 rounded-lg border border-info-foreground/30 bg-info-background px-3.5 py-3 text-info-foreground">
            
                  <HandshakeIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="text-xs font-medium">
                    {pending.length} agreement{pending.length > 1 ? 's' : ''} awaiting
                    acceptance
                  </span>
                </Link> :
          null}
            </section> :
        null}

          <div className="grid gap-4 lg:grid-cols-3">
            <section className="space-y-2.5 lg:col-span-2" aria-labelledby="next-heading">
              <h2 id="next-heading" className={`text-sm font-semibold ${textPrimary}`}>
                Next payments
              </h2>
              {upcoming.length ?
            upcoming.map(({ agreement }) =>
            <AgreementCard key={agreement.id} agreement={agreement} />
            ) :

            <EmptyState
              icon={<ClockIcon className="h-5 w-5" />}
              title="Nothing due right now"
              description="Every active agreement is up to date." />

            }
            </section>

            <section className={card} aria-labelledby="activity-heading">
              <div className={`border-b px-4 py-3 ${hairline}`}>
                <h2
                id="activity-heading"
                className={`text-sm font-semibold ${textPrimary}`}>
                
                  Recent activity
                </h2>
              </div>
              <ul className="divide-y divide-border dark:divide-border-dark">
                {notifications.slice(0, 5).map((notification) =>
              <li key={notification.id} className="px-4 py-3">
                    <p className={`text-xs font-medium ${textPrimary}`}>
                      {notification.title}
                    </p>
                    <p className={`mt-0.5 text-[11px] leading-normal ${textSecondary}`}>
                      {notification.detail}
                    </p>
                    <p className={`mt-1 ${mono} text-[10px] ${textSecondary}`}>
                      {relativeDay(notification.date)}
                    </p>
                  </li>
              )}
              </ul>
              <div className={`border-t px-4 py-2.5 ${hairline}`}>
                <Link
                to="/notifications"
                className="text-xs font-medium text-accent dark:text-accent-dark">
                
                  View all notifications
                </Link>
              </div>
            </section>
          </div>

          {upcoming[0]?.instalment ?
        <p className={`text-[11px] ${textSecondary}`}>
              Closest deadline: {dueLabel(upcoming[0].instalment.dueDate)} ·{' '}
              {upcoming[0].agreement.counterparty.name}
            </p> :
        null}
        </>
      }
    </div>);

}