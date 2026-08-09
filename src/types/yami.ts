export type Ecosystem = 'individual' | 'wholesale' | 'retail';

export type Direction = 'lent' | 'borrowed';

export type ExchangeKind = 'cash' | 'goods';

export type RepaymentPlan = 'lump_sum' | 'instalments';

export type AgreementStatus =
'draft' |
'pending' |
'active' |
'overdue' |
'in_resolution' |
'restructured' |
'acquired' |
'in_recovery' |
'settled' |
'written_off' |
'declined';

export type VerificationTier = 'unverified' | 'basic' | 'identity' | 'full';

export type PaymentMethod = 'cash' | 'transfer' | 'pos' | 'goods_return';

export type ResolutionStage =
'reminder' |
'intervention' |
'restructure' |
'mediation' |
'acquisition' |
'recovery';

export interface Party {
  id: string;
  name: string;
  phone: string;
  avatarUrl?: string;
  verification: VerificationTier;
  businessName?: string;
  location?: string;
  reputationScore: number;
  relationship: string;
}

export interface Instalment {
  id: string;
  dueDate: string;
  amount: number;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  recordedBy: 'me' | 'them';
  confirmed: boolean;
  disputed?: boolean;
}

export interface ResolutionEvent {
  id: string;
  stage: ResolutionStage;
  date: string;
  title: string;
  detail: string;
  actor: string;
}

export interface RestructureProposal {
  id: string;
  proposedBy: 'me' | 'them';
  newInstalmentAmount: number;
  newInstalmentCount: number;
  firstPaymentDate: string;
  reason: string;
  status: 'proposed' | 'accepted' | 'declined' | 'countered';
  counterNote?: string;
}

export interface AcquisitionOffer {
  id: string;
  offerAmount: number;
  outstanding: number;
  expiresOn: string;
  status: 'available' | 'accepted' | 'declined' | 'ineligible';
  reasons: string[];
  recoveredToDate?: number;
}

export interface Resolution {
  stage: ResolutionStage;
  events: ResolutionEvent[];
  proposal?: RestructureProposal;
  mediationRequested?: boolean;
  offer?: AcquisitionOffer;
}

export interface Agreement {
  id: string;
  reference: string;
  direction: Direction;
  ecosystem: Ecosystem;
  counterparty: Party;
  principal: number;
  exchangeKind: ExchangeKind;
  description: string;
  createdOn: string;
  dueDate: string;
  plan: RepaymentPlan;
  instalments: Instalment[];
  payments: Payment[];
  status: AgreementStatus;
  note?: string;
  resolution?: Resolution;
}

export interface AppNotification {
  id: string;
  title: string;
  detail: string;
  date: string;
  urgency: 'urgent' | 'due' | 'info';
  agreementId?: string;
  read: boolean;
}

export interface NotificationChannels {
  sms: boolean;
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export interface CurrentUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  businessName?: string;
  location: string;
  verification: VerificationTier;
  avatarUrl?: string;
}