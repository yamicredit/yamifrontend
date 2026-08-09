import React from 'react';
import { Link } from 'react-router-dom';
import { LifeBuoyIcon, ShieldCheckIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { StatusPill } from '../components/StatusPill';
import { Button } from '../components/Button';
import { Skeleton } from '../components/Skeleton';
import { Badge } from '../components/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { ResolutionLadder } from '../components/resolution/ResolutionLadder';
import { useYami } from '../contexts/YamiContext';
import {
  RESOLUTION_STAGES,
  STATUS_META,
  isTroubled,
  outstandingAmount } from
'../utils/agreement';
import { dueLabel, formatNaira } from '../utils/format';
import { card, hairline, mono, textPrimary, textSecondary } from '../utils/ui';

export function Resolution() {
  const { agreements, loading } = useYami();
  const troubled = agreements.filter(isTroubled);

  const atRisk = troubled.reduce(
    (total, agreement) => total + outstandingAmount(agreement),
    0
  );
  const offers = troubled.filter(
    (agreement) => agreement.resolution?.offer?.status === 'available'
  ).length;
  const proposals = troubled.filter(
    (agreement) => agreement.resolution?.proposal?.status === 'proposed'
  ).length;

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="rect" height={72} />
        <Skeleton variant="rect" height={92} />
        <Skeleton variant="rect" height={180} />
      </div>);

  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Resolution centre"
        description="Structured steps for agreements where repayment has broken down." />
      

      {troubled.length === 0 ?
      <EmptyState
        icon={<ShieldCheckIcon className="h-5 w-5" />}
        title="Nothing needs resolution"
        description="Every agreement is on track. If a repayment is missed, YAMI opens the resolution ladder here automatically." /> :


      <>
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label="Value at risk" value={formatNaira(atRisk)} />
            <StatCard label="Awaiting your response" value={proposals} caption="restructure proposals" />
            <StatCard label="Purchase offers open" value={offers} caption="YAMI can buy these debts" />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <section className="space-y-2.5 lg:col-span-2" aria-labelledby="troubled-heading">
              <h2 id="troubled-heading" className={`text-sm font-semibold ${textPrimary}`}>
                Agreements in trouble
              </h2>
              {troubled.map((agreement) => {
              const stage = agreement.resolution?.stage;
              const stageMeta = RESOLUTION_STAGES.find((s) => s.stage === stage);
              const meta = STATUS_META[agreement.status];
              return (
                <article key={agreement.id} className={`${card} p-4`}>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold ${textPrimary}`}>
                          {agreement.counterparty.name}
                        </p>
                        <p className={`text-xs ${textSecondary}`}>
                          {agreement.reference} · {agreement.description}
                        </p>
                      </div>
                      <StatusPill status={meta.pill} size="sm">
                        {meta.label}
                      </StatusPill>
                    </div>

                    <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <p className={`text-[11px] uppercase tracking-wide ${textSecondary}`}>
                          Outstanding
                        </p>
                        <p className={`${mono} text-lg font-semibold ${textPrimary}`}>
                          {formatNaira(outstandingAmount(agreement))}
                        </p>
                        <p className={`text-[11px] ${textSecondary}`}>
                          {dueLabel(agreement.dueDate)}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {agreement.resolution?.proposal?.status === 'proposed' ?
                      <Badge variant="warning">Proposal awaiting you</Badge> :
                      null}
                        {agreement.resolution?.offer?.status === 'available' ?
                      <Badge variant="info">Purchase offer</Badge> :
                      null}
                        <Link to={`/agreements/${agreement.id}`}>
                          <Button size="sm" variant="secondary">
                            Open
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {stageMeta ?
                  <div className={`mt-3 border-t pt-2.5 ${hairline}`}>
                        <p className={`text-[11px] ${textSecondary}`}>
                          Current step:{' '}
                          <span className={`font-medium ${textPrimary}`}>
                            {stageMeta.label}
                          </span>{' '}
                          — {stageMeta.blurb}
                        </p>
                      </div> :
                  null}
                  </article>);

            })}
            </section>

            <div className="space-y-4">
              <ResolutionLadder
              resolution={troubled[0]?.resolution} />
            
              <section className={`${card} p-4`}>
                <div className="flex items-start gap-2.5">
                  <LifeBuoyIcon
                  className="mt-0.5 h-4 w-4 shrink-0 text-text-secondary dark:text-text-secondary-dark"
                  aria-hidden="true" />
                
                  <p className={`text-xs leading-normal ${textSecondary}`}>
                    YAMI only buys a debt when recovery is commercially viable and the
                    borrower can realistically repay. Selling gives you liquidity and
                    ends your recovery work; the borrower keeps one workable plan
                    instead of repeated demands.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </>
      }
    </div>);

}