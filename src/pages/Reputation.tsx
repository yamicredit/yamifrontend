import React, { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis } from
'recharts';
import { CopyIcon, ShieldCheckIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { ChartContainer } from '../components/ChartContainer';
import { Switch } from '../components/Switch';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Skeleton } from '../components/Skeleton';
import { useYami } from '../contexts/YamiContext';
import { outstandingAmount, paidAmount } from '../utils/agreement';
import { formatNaira } from '../utils/format';
import {
  card,
  hairline,
  mono,
  subtleAccent,
  textPrimary,
  textSecondary } from
'../utils/ui';

export function Reputation() {
  const { reputation, agreements, user, settings, updateSettings, loading } = useYami();

  const monthly = useMemo(() => {
    const buckets = new Map<string, number>();
    agreements.forEach((agreement) => {
      agreement.payments.
      filter((payment) => payment.confirmed).
      forEach((payment) => {
        const key = new Date(payment.date).toLocaleDateString('en-NG', {
          month: 'short'
        });
        buckets.set(key, (buckets.get(key) ?? 0) + payment.amount);
      });
    });
    return Array.from(buckets.entries()).map(([month, amount]) => ({ month, amount }));
  }, [agreements]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="rect" height={72} />
        <Skeleton variant="rect" height={140} />
        <Skeleton variant="rect" height={240} />
      </div>);

  }

  const tradingHistory = agreements.
  filter((agreement) => agreement.status !== 'pending').
  slice(0, 6);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Financial reputation"
        description="Built from real repayment behaviour — yours to carry to any lender or supplier." />
      

      <div className="grid gap-4 lg:grid-cols-3">
        <section className={`${card} p-5 lg:col-span-1`} aria-labelledby="score-heading">
          <h2 id="score-heading" className={`text-sm font-semibold ${textPrimary}`}>
            YAMI score
          </h2>
          <p className={`${mono} mt-2 text-4xl font-semibold ${textPrimary}`}>
            {reputation.score}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <Badge variant="success" dot>
              {reputation.band}
            </Badge>
            <span className={`text-xs ${textSecondary}`}>out of 900</span>
          </div>
          <div
            className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={reputation.score}
            aria-valuemin={300}
            aria-valuemax={900}
            aria-label="Reputation score">
            
            <div
              className="h-full rounded-full bg-accent dark:bg-accent-dark"
              style={{ width: `${(reputation.score - 300) / 600 * 100}%` }} />
            
          </div>
          <p className={`mt-3 text-xs leading-normal ${textSecondary}`}>
            {user.name} · {user.businessName} · {user.location}
          </p>
        </section>

        <section className={`${card} lg:col-span-2`} aria-labelledby="factors-heading">
          <div className={`border-b px-4 py-3 ${hairline}`}>
            <h2 id="factors-heading" className={`text-sm font-semibold ${textPrimary}`}>
              What builds this score
            </h2>
          </div>
          <ul className="divide-y divide-border dark:divide-border-dark">
            {reputation.factors.map((factor) =>
            <li key={factor.id} className="px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className={`text-xs font-medium ${textPrimary}`}>{factor.label}</p>
                  <span className={`${mono} text-xs ${textSecondary}`}>
                    {factor.weight}% weight
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                    className="h-full rounded-full bg-accent dark:bg-accent-dark"
                    style={{ width: `${Math.min(factor.score, 100)}%` }} />
                  
                  </div>
                  <span className={`${mono} text-[11px] ${textSecondary}`}>
                    {Math.round(factor.score)}
                  </span>
                </div>
                <p className={`mt-1 text-[11px] leading-normal ${textSecondary}`}>
                  {factor.detail}
                </p>
              </li>
            )}
          </ul>
        </section>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="On-time repayment"
          value={`${reputation.onTimeRate}%`}
          caption="of confirmed repayments" />
        
        <StatCard
          label="Completed agreements"
          value={reputation.completedAgreements}
          caption={`${reputation.activeAgreements} currently active`} />
        
        <StatCard
          label="Credit extended"
          value={formatNaira(reputation.creditExtended)}
          caption={`${formatNaira(reputation.currentExposure)} still out`} />
        
        <StatCard
          label="Credit received"
          value={formatNaira(reputation.creditReceived)}
          caption={`${formatNaira(reputation.currentObligations)} still owed`} />
        
      </div>

      <ChartContainer
        title="Repayments recorded"
        description="Confirmed repayment activity across every agreement."
        legend={[{ label: 'Repayments', color: 'var(--accent)' }]}
        height={220}
        empty={monthly.length === 0}
        emptyMessage="No confirmed repayments yet.">
        
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthly} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
            
            <YAxis
              tickLine={false}
              axisLine={false}
              width={56}
              tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
              tickFormatter={(value: number) => `₦${Math.round(value / 1000)}k`} />
            
            <RechartsTooltip
              formatter={(value: number) => formatNaira(value)}
              contentStyle={{
                borderRadius: 8,
                border: '1px solid var(--border)',
                fontSize: 12
              }} />
            
            <Bar dataKey="amount" fill="var(--accent)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <section className={card} aria-labelledby="history-heading">
        <div className={`border-b px-4 py-3 ${hairline}`}>
          <h2 id="history-heading" className={`text-sm font-semibold ${textPrimary}`}>
            Trading history
          </h2>
          <p className={`text-xs ${textSecondary}`}>
            The record a supplier or lender would see with your consent.
          </p>
        </div>
        <ul className="divide-y divide-border dark:divide-border-dark">
          {tradingHistory.map((agreement) =>
          <li
            key={agreement.id}
            className="flex items-center justify-between gap-3 px-4 py-2.5">
            
              <div className="min-w-0">
                <p className={`truncate text-xs font-medium ${textPrimary}`}>
                  {agreement.counterparty.name}
                </p>
                <p className={`truncate text-[11px] ${textSecondary}`}>
                  {agreement.direction === 'lent' ? 'Credit given' : 'Credit received'} ·{' '}
                  {formatNaira(paidAmount(agreement))} repaid
                </p>
              </div>
              <span className={`${mono} text-xs ${textPrimary}`}>
                {formatNaira(outstandingAmount(agreement))} left
              </span>
            </li>
          )}
        </ul>
      </section>

      <section className={`${card} p-4`} aria-labelledby="share-heading">
        <div className="flex items-start gap-2.5">
          <ShieldCheckIcon
            className="mt-0.5 h-4 w-4 shrink-0 text-text-secondary dark:text-text-secondary-dark"
            aria-hidden="true" />
          
          <div className="flex-1">
            <h2 id="share-heading" className={`text-sm font-semibold ${textPrimary}`}>
              Share your reputation
            </h2>
            <p className={`mt-0.5 text-xs leading-normal ${textSecondary}`}>
              Nothing leaves YAMI without your consent. Turning this on creates a link
              showing your score, on-time rate, completed agreements and current
              obligations — never your counterparties&rsquo; names.
            </p>
            <div className="mt-3">
              <Switch
                checked={settings.shareReputation}
                onCheckedChange={(checked) =>
                updateSettings({ shareReputation: checked })
                }
                label="Allow verified businesses to view my reputation"
                description="You can revoke access at any time." />
              
            </div>
            {settings.shareReputation ?
            <div className={`mt-3 rounded-lg px-3.5 py-3 ${subtleAccent}`}>
                <p className="text-[11px] uppercase tracking-wide">Shareable link</p>
                <p className={`${mono} break-all text-xs`}>
                  yami.ng/r/adaeze-nwosu-{reputation.score}
                </p>
                <Button
                size="sm"
                variant="secondary"
                className="mt-2"
                leadingIcon={<CopyIcon className="h-3.5 w-3.5" />}>
                
                  Copy link
                </Button>
              </div> :
            null}
          </div>
        </div>
      </section>
    </div>);

}