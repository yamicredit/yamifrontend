import type {
  Agreement,
  AgreementStatus,
  Direction,
  Ecosystem,
  Instalment,
  PaymentMethod,
  ResolutionStage,
  VerificationTier } from
'../types/yami';
import { daysUntil, isoDaysFromNow } from './format';

type PillStatus =
'active' |
'pending' |
'error' |
'success' |
'warning' |
'info' |
'neutral';

export const STATUS_META: Record<
  AgreementStatus,
  {label: string;pill: PillStatus;description: string;}> =
{
  draft: {
    label: 'Draft',
    pill: 'neutral',
    description: 'Not yet sent to the other party.'
  },
  pending: {
    label: 'Pending acceptance',
    pill: 'pending',
    description: 'Waiting for the other party to review and accept the terms.'
  },
  active: {
    label: 'Active',
    pill: 'active',
    description: 'Both parties accepted. Repayments are being tracked.'
  },
  overdue: {
    label: 'Overdue',
    pill: 'warning',
    description: 'A scheduled repayment has been missed.'
  },
  in_resolution: {
    label: 'In resolution',
    pill: 'error',
    description: 'Structured resolution has started on this agreement.'
  },
  restructured: {
    label: 'Restructured',
    pill: 'info',
    description: 'Both parties agreed to new repayment terms.'
  },
  acquired: {
    label: 'Acquired by YAMI',
    pill: 'info',
    description: 'YAMI purchased this debt and now works with the borrower.'
  },
  in_recovery: {
    label: 'In recovery',
    pill: 'warning',
    description: 'YAMI is recovering this debt directly from the borrower.'
  },
  settled: {
    label: 'Settled',
    pill: 'success',
    description: 'Fully repaid and closed.'
  },
  written_off: {
    label: 'Written off',
    pill: 'neutral',
    description: 'Closed without full repayment.'
  },
  declined: {
    label: 'Declined',
    pill: 'neutral',
    description: 'The other party did not accept these terms.'
  }
};

export const ECOSYSTEM_META: Record<
  Ecosystem,
  {label: string;short: string;detail: string;}> =
{
  individual: {
    label: 'Person to person',
    short: 'Personal',
    detail: 'Friends, family, colleagues and acquaintances.'
  },
  wholesale: {
    label: 'Wholesaler to retailer',
    short: 'Trade credit',
    detail: 'Inventory supplied on credit with agreed repayment terms.'
  },
  retail: {
    label: 'Retailer to consumer',
    short: 'Customer credit',
    detail: 'Goods supplied to trusted customers with deferred payment.'
  }
};

export const VERIFICATION_META: Record<
  VerificationTier,
  {label: string;short: string;level: number;}> =
{
  unverified: { label: 'Not verified', short: 'Unverified', level: 0 },
  basic: { label: 'Phone & email verified', short: 'Basic', level: 1 },
  identity: { label: 'Identity verified (BVN/NIN)', short: 'Verified', level: 2 },
  full: { label: 'Fully verified business', short: 'Full', level: 3 }
};

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  cash: 'Cash',
  transfer: 'Bank transfer',
  pos: 'POS / card',
  goods_return: 'Goods returned'
};

export const RESOLUTION_STAGES: {
  stage: ResolutionStage;
  label: string;
  blurb: string;
}[] = [
{
  stage: 'reminder',
  label: 'Reminder sent',
  blurb: 'A polite nudge before the relationship is strained.'
},
{
  stage: 'intervention',
  label: 'Early intervention',
  blurb: 'Understand why repayment stopped and agree a next step.'
},
{
  stage: 'restructure',
  label: 'Restructure proposed',
  blurb: 'New instalment amounts and dates both sides can live with.'
},
{
  stage: 'mediation',
  label: 'Mediation',
  blurb: 'A neutral YAMI mediator joins the conversation.'
},
{
  stage: 'acquisition',
  label: 'YAMI buys the debt',
  blurb: 'The lender takes liquidity and exits the recovery process.'
},
{
  stage: 'recovery',
  label: 'Recovery',
  blurb: 'YAMI works directly with the borrower on a workable plan.'
}];


export const TROUBLE_STATUSES: AgreementStatus[] = [
'overdue',
'in_resolution',
'restructured',
'acquired',
'in_recovery'];


export const CLOSED_STATUSES: AgreementStatus[] = [
'settled',
'written_off',
'declined'];


export function paidAmount(agreement: Agreement): number {
  return agreement.payments.
  filter((payment) => payment.confirmed && !payment.disputed).
  reduce((total, payment) => total + payment.amount, 0);
}

export function outstandingAmount(agreement: Agreement): number {
  return Math.max(agreement.principal - paidAmount(agreement), 0);
}

export function pendingConfirmation(agreement: Agreement): number {
  return agreement.payments.
  filter((payment) => !payment.confirmed && !payment.disputed).
  reduce((total, payment) => total + payment.amount, 0);
}

export function progressPercent(agreement: Agreement): number {
  if (agreement.principal <= 0) return 0;
  return Math.min(
    Math.round(paidAmount(agreement) / agreement.principal * 100),
    100
  );
}

export function instalmentPaidStatus(
agreement: Agreement,
instalment: Instalment)
: 'paid' | 'partial' | 'late' | 'due' | 'upcoming' {
  const index = agreement.instalments.findIndex((i) => i.id === instalment.id);
  const coveredBefore = agreement.instalments.
  slice(0, index).
  reduce((total, i) => total + i.amount, 0);
  const paid = paidAmount(agreement);
  const remainingForThis = paid - coveredBefore;
  if (remainingForThis >= instalment.amount) return 'paid';
  const days = daysUntil(instalment.dueDate);
  if (remainingForThis > 0) return days < 0 ? 'late' : 'partial';
  if (days < 0) return 'late';
  if (days <= 7) return 'due';
  return 'upcoming';
}

export function nextInstalment(agreement: Agreement): Instalment | undefined {
  return agreement.instalments.find(
    (instalment) => instalmentPaidStatus(agreement, instalment) !== 'paid'
  );
}

export function isTroubled(agreement: Agreement): boolean {
  return TROUBLE_STATUSES.includes(agreement.status);
}

export function isOpen(agreement: Agreement): boolean {
  return !CLOSED_STATUSES.includes(agreement.status);
}

export function totalByDirection(
agreements: Agreement[],
direction: Direction)
: number {
  return agreements.
  filter((a) => a.direction === direction && isOpen(a) && a.status !== 'pending').
  reduce((total, a) => total + outstandingAmount(a), 0);
}

export function buildInstalments(
principal: number,
count: number,
firstDueInDays: number,
intervalDays: number,
prefix: string)
: Instalment[] {
  const base = Math.round(principal / count / 500) * 500 || Math.round(principal / count);
  return Array.from({ length: count }, (_, index) => {
    const isLast = index === count - 1;
    const amount = isLast ? principal - base * (count - 1) : base;
    return {
      id: `${prefix}-i${index + 1}`,
      dueDate: isoDaysFromNow(firstDueInDays + index * intervalDays),
      amount
    };
  });
}

export function acquisitionOfferAmount(outstanding: number): number {
  return Math.round(outstanding * 0.65 / 100) * 100;
}