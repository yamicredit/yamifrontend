import type { Agreement } from '../types/yami';
import { daysUntil } from './format';
import {
  CLOSED_STATUSES,
  isOpen,
  isTroubled,
  outstandingAmount,
  paidAmount } from
'./agreement';

export interface ReputationFactor {
  id: string;
  label: string;
  detail: string;
  weight: number;
  score: number;
}

export interface ReputationSummary {
  score: number;
  band: 'Building' | 'Fair' | 'Good' | 'Strong' | 'Excellent';
  onTimeRate: number;
  completedAgreements: number;
  activeAgreements: number;
  creditExtended: number;
  creditReceived: number;
  currentExposure: number;
  currentObligations: number;
  troubledCount: number;
  factors: ReputationFactor[];
}

function band(score: number): ReputationSummary['band'] {
  if (score >= 850) return 'Excellent';
  if (score >= 720) return 'Strong';
  if (score >= 600) return 'Good';
  if (score >= 480) return 'Fair';
  return 'Building';
}

export function computeReputation(agreements: Agreement[]): ReputationSummary {
  const settled = agreements.filter((a) => a.status === 'settled');
  const borrowed = agreements.filter((a) => a.direction === 'borrowed');
  const lent = agreements.filter((a) => a.direction === 'lent');
  const troubled = agreements.filter(isTroubled);

  const allPayments = borrowed.flatMap((a) =>
  a.payments.filter((p) => p.confirmed).map((p) => ({ payment: p, agreement: a }))
  );
  const onTimePayments = allPayments.filter(({ payment, agreement }) => {
    const instalment = agreement.instalments.find(
      (i) => new Date(i.dueDate).getTime() >= new Date(payment.date).getTime()
    );
    return Boolean(instalment) || daysUntil(agreement.dueDate) >= 0;
  });
  const onTimeRate = allPayments.length ?
  Math.round(onTimePayments.length / allPayments.length * 100) :
  100;

  const creditExtended = lent.reduce((total, a) => total + a.principal, 0);
  const creditReceived = borrowed.reduce((total, a) => total + a.principal, 0);
  const currentExposure = lent.
  filter(isOpen).
  reduce((total, a) => total + outstandingAmount(a), 0);
  const currentObligations = borrowed.
  filter(isOpen).
  reduce((total, a) => total + outstandingAmount(a), 0);

  const repaymentConsistency = borrowed.length ?
  Math.round(
    borrowed.reduce(
      (total, a) => total + paidAmount(a) / Math.max(a.principal, 1),
      0
    ) /
    borrowed.length *
    100
  ) :
  0;

  const factors: ReputationFactor[] = [
  {
    id: 'timeliness',
    label: 'Repayment timeliness',
    detail: `${onTimeRate}% of your repayments were recorded on or before the due date.`,
    weight: 35,
    score: onTimeRate
  },
  {
    id: 'completion',
    label: 'Completed agreements',
    detail: `${settled.length} agreements fully repaid and closed.`,
    weight: 25,
    score: Math.min(settled.length * 20, 100)
  },
  {
    id: 'consistency',
    label: 'Repayment consistency',
    detail: `On average you have cleared ${repaymentConsistency}% of what you borrowed.`,
    weight: 20,
    score: repaymentConsistency
  },
  {
    id: 'standing',
    label: 'Current standing',
    detail: troubled.length ?
    `${troubled.length} agreement${troubled.length > 1 ? 's' : ''} currently need resolution.` :
    'No agreements currently in trouble.',
    weight: 20,
    score: Math.max(100 - troubled.length * 30, 0)
  }];


  const weighted = factors.reduce(
    (total, factor) => total + factor.score * factor.weight / 100,
    0
  );
  const score = Math.round(300 + weighted / 100 * 600);

  return {
    score,
    band: band(score),
    onTimeRate,
    completedAgreements: settled.length,
    activeAgreements: agreements.filter(
      (a) => !CLOSED_STATUSES.includes(a.status) && a.status !== 'pending'
    ).length,
    creditExtended,
    creditReceived,
    currentExposure,
    currentObligations,
    troubledCount: troubled.length,
    factors
  };
}