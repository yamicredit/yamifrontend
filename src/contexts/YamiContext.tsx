import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState } from
'react';
import type {
  Agreement,
  AppNotification,
  CurrentUser,
  Direction,
  Ecosystem,
  ExchangeKind,
  NotificationChannels,
  Party,
  PaymentMethod,
  RepaymentPlan,
  ResolutionStage,
  VerificationTier } from
'../types/yami';
import { seedAgreements } from '../data/agreements';
import { seedNotifications } from '../data/notifications';
import { currentUser as seedUser } from '../data/parties';
import { isoDaysFromNow } from '../utils/format';
import {
  acquisitionOfferAmount,
  buildInstalments,
  outstandingAmount } from
'../utils/agreement';
import { computeReputation, type ReputationSummary } from '../utils/reputation';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: 'info' | 'success' | 'warning' | 'error';
}

export interface NewAgreementInput {
  direction: Direction;
  ecosystem: Ecosystem;
  counterparty: Party;
  principal: number;
  exchangeKind: ExchangeKind;
  description: string;
  plan: RepaymentPlan;
  instalmentCount: number;
  firstPaymentInDays: number;
  intervalDays: number;
  note?: string;
}

export interface RecordPaymentInput {
  amount: number;
  method: PaymentMethod;
  reference?: string;
}

export interface RestructureInput {
  newInstalmentAmount: number;
  newInstalmentCount: number;
  firstPaymentInDays: number;
  reason: string;
}

interface Settings {
  channels: NotificationChannels;
  shareReputation: boolean;
  theme: 'light' | 'dark';
}

interface YamiContextValue {
  user: CurrentUser;
  agreements: Agreement[];
  notifications: AppNotification[];
  settings: Settings;
  loading: boolean;
  reputation: ReputationSummary;
  toast: ToastMessage | null;
  dismissToast: () => void;
  getAgreement: (id: string) => Agreement | undefined;
  createAgreement: (input: NewAgreementInput) => Agreement;
  acceptAgreement: (id: string) => void;
  declineAgreement: (id: string) => void;
  recordPayment: (id: string, input: RecordPaymentInput) => void;
  confirmPayment: (agreementId: string, paymentId: string) => void;
  disputePayment: (agreementId: string, paymentId: string) => void;
  sendReminder: (id: string) => void;
  openIntervention: (id: string, note: string) => void;
  proposeRestructure: (id: string, input: RestructureInput) => void;
  respondToProposal: (
  id: string,
  response: 'accepted' | 'declined',
  note?: string)
  => void;
  requestMediation: (id: string) => void;
  respondToOffer: (id: string, response: 'accepted' | 'declined') => void;
  markAllNotificationsRead: () => void;
  updateSettings: (partial: Partial<Settings>) => void;
  submitVerification: (tier: VerificationTier) => void;
}

const YamiContext = createContext<YamiContextValue | null>(null);

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function YamiProvider({ children }: {children: React.ReactNode;}) {
  const [user, setUser] = useState<CurrentUser>(seedUser);
  const [agreements, setAgreements] = useState<Agreement[]>(seedAgreements);
  const [notifications, setNotifications] =
  useState<AppNotification[]>(seedNotifications);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Settings>({
    channels: { sms: true, email: true, push: true, inApp: true },
    shareReputation: false,
    theme: 'light'
  });

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', settings.theme === 'dark');
  }, [settings.theme]);

  const pushToast = useCallback(
    (message: Omit<ToastMessage, 'id'>) => {
      setToast({ ...message, id: uid('toast') });
    },
    [setToast]
  );

  const addNotification = useCallback(
    (notification: Omit<AppNotification, 'id' | 'read'>) => {
      setNotifications((current) => [
      { ...notification, id: uid('nt'), read: false },
      ...current]
      );
    },
    []
  );

  const updateAgreement = useCallback(
    (id: string, updater: (agreement: Agreement) => Agreement) => {
      setAgreements((current) =>
      current.map((agreement) =>
      agreement.id === id ? updater(agreement) : agreement
      )
      );
    },
    []
  );

  const getAgreement = useCallback(
    (id: string) => agreements.find((agreement) => agreement.id === id),
    [agreements]
  );

  const createAgreement = useCallback(
    (input: NewAgreementInput) => {
      const id = uid('ag');
      const reference = `YAMI-${Math.floor(1100 + Math.random() * 800)}`;
      const instalments =
      input.plan === 'instalments' ?
      buildInstalments(
        input.principal,
        input.instalmentCount,
        input.firstPaymentInDays,
        input.intervalDays,
        id
      ) :
      [
      {
        id: `${id}-i1`,
        dueDate: isoDaysFromNow(input.firstPaymentInDays),
        amount: input.principal
      }];

      const agreement: Agreement = {
        id,
        reference,
        direction: input.direction,
        ecosystem: input.ecosystem,
        counterparty: input.counterparty,
        principal: input.principal,
        exchangeKind: input.exchangeKind,
        description: input.description,
        createdOn: new Date().toISOString(),
        dueDate: instalments[instalments.length - 1].dueDate,
        plan: input.plan,
        instalments,
        payments: [],
        status: 'pending',
        note: input.note
      };
      setAgreements((current) => [agreement, ...current]);
      addNotification({
        title: `Agreement sent to ${input.counterparty.name}`,
        detail: `${reference} is waiting for acceptance.`,
        date: new Date().toISOString(),
        urgency: 'info',
        agreementId: id
      });
      pushToast({
        title: 'Agreement created',
        description: `${reference} sent to ${input.counterparty.name} for acceptance.`,
        variant: 'success'
      });
      return agreement;
    },
    [addNotification, pushToast]
  );

  const acceptAgreement = useCallback(
    (id: string) => {
      updateAgreement(id, (agreement) => ({ ...agreement, status: 'active' }));
      pushToast({
        title: 'Agreement accepted',
        description: 'Repayment tracking has started for both parties.',
        variant: 'success'
      });
    },
    [pushToast, updateAgreement]
  );

  const declineAgreement = useCallback(
    (id: string) => {
      updateAgreement(id, (agreement) => ({ ...agreement, status: 'declined' }));
      pushToast({
        title: 'Agreement declined',
        description: 'Nothing is tracked and no reputation impact is recorded.',
        variant: 'info'
      });
    },
    [pushToast, updateAgreement]
  );

  const recordPayment = useCallback(
    (id: string, input: RecordPaymentInput) => {
      updateAgreement(id, (agreement) => {
        const recordedBy = agreement.direction === 'borrowed' ? 'me' : 'them';
        const next: Agreement = {
          ...agreement,
          payments: [
          ...agreement.payments,
          {
            id: uid('pm'),
            date: new Date().toISOString(),
            amount: input.amount,
            method: input.method,
            reference: input.reference,
            recordedBy,
            confirmed: false
          }]

        };
        return next;
      });
      pushToast({
        title: 'Payment recorded',
        description:
        'It appears in the history as awaiting confirmation from the other party.',
        variant: 'success'
      });
    },
    [pushToast, updateAgreement]
  );

  const confirmPayment = useCallback(
    (agreementId: string, paymentId: string) => {
      updateAgreement(agreementId, (agreement) => {
        const payments = agreement.payments.map((payment) =>
        payment.id === paymentId ?
        { ...payment, confirmed: true, disputed: false } :
        payment
        );
        const updated = { ...agreement, payments };
        const settled = outstandingAmount(updated) === 0;
        return {
          ...updated,
          status: settled ? 'settled' : updated.status
        };
      });
      pushToast({
        title: 'Payment confirmed',
        description: 'The payment is now part of the immutable history.',
        variant: 'success'
      });
    },
    [pushToast, updateAgreement]
  );

  const disputePayment = useCallback(
    (agreementId: string, paymentId: string) => {
      updateAgreement(agreementId, (agreement) => ({
        ...agreement,
        payments: agreement.payments.map((payment) =>
        payment.id === paymentId ?
        { ...payment, disputed: true, confirmed: false } :
        payment
        )
      }));
      pushToast({
        title: 'Payment disputed',
        description: 'Both parties are notified and the amount is held out of the balance.',
        variant: 'warning'
      });
    },
    [pushToast, updateAgreement]
  );

  const appendResolutionEvent = useCallback(
    (
    id: string,
    stage: ResolutionStage,
    title: string,
    detail: string,
    actor: string,
    status?: Agreement['status']) =>
    {
      updateAgreement(id, (agreement) => {
        const resolution = agreement.resolution ?? { stage, events: [] };
        return {
          ...agreement,
          status: status ?? agreement.status,
          resolution: {
            ...resolution,
            stage,
            events: [
            ...resolution.events,
            {
              id: uid('rv'),
              stage,
              date: new Date().toISOString(),
              title,
              detail,
              actor
            }]

          }
        };
      });
    },
    [updateAgreement]
  );

  const sendReminder = useCallback(
    (id: string) => {
      appendResolutionEvent(
        id,
        'reminder',
        'Reminder sent',
        'A reminder was sent on your enabled channels.',
        'You'
      );
      pushToast({
        title: 'Reminder sent',
        description: 'Delivered by SMS and in-app notification.',
        variant: 'success'
      });
    },
    [appendResolutionEvent, pushToast]
  );

  const openIntervention = useCallback(
    (id: string, note: string) => {
      appendResolutionEvent(
        id,
        'intervention',
        'Early intervention opened',
        note || 'You started a conversation about why repayment stopped.',
        'You',
        'in_resolution'
      );
      pushToast({
        title: 'Early intervention opened',
        description: 'The other party can now explain and propose a way forward.',
        variant: 'info'
      });
    },
    [appendResolutionEvent, pushToast]
  );

  const proposeRestructure = useCallback(
    (id: string, input: RestructureInput) => {
      updateAgreement(id, (agreement) => {
        const resolution = agreement.resolution ?? {
          stage: 'restructure' as const,
          events: []
        };
        return {
          ...agreement,
          status: 'in_resolution',
          resolution: {
            ...resolution,
            stage: 'restructure',
            proposal: {
              id: uid('rp'),
              proposedBy: 'me',
              newInstalmentAmount: input.newInstalmentAmount,
              newInstalmentCount: input.newInstalmentCount,
              firstPaymentDate: isoDaysFromNow(input.firstPaymentInDays),
              reason: input.reason,
              status: 'proposed'
            },
            events: [
            ...resolution.events,
            {
              id: uid('rv'),
              stage: 'restructure' as const,
              date: new Date().toISOString(),
              title: 'Restructure proposed',
              detail: input.reason,
              actor: 'You'
            }]

          }
        };
      });
      pushToast({
        title: 'Restructure proposed',
        description: 'The other party can accept or counter these terms.',
        variant: 'success'
      });
    },
    [pushToast, updateAgreement]
  );

  const respondToProposal = useCallback(
    (id: string, response: 'accepted' | 'declined', note?: string) => {
      updateAgreement(id, (agreement) => {
        const resolution = agreement.resolution;
        if (!resolution?.proposal) return agreement;
        const proposal = resolution.proposal;
        const accepted = response === 'accepted';
        const instalments = accepted ?
        Array.from({ length: proposal.newInstalmentCount }, (_, index) => ({
          id: `${agreement.id}-r${index + 1}`,
          dueDate: isoDaysFromNow(
            Math.round(
              (new Date(proposal.firstPaymentDate).getTime() - Date.now()) /
              86_400_000
            ) +
            index * 14
          ),
          amount: proposal.newInstalmentAmount
        })) :
        agreement.instalments;
        return {
          ...agreement,
          status: accepted ? 'restructured' : agreement.status,
          instalments,
          resolution: {
            ...resolution,
            proposal: { ...proposal, status: response, counterNote: note },
            events: [
            ...resolution.events,
            {
              id: uid('rv'),
              stage: 'restructure' as const,
              date: new Date().toISOString(),
              title: accepted ? 'Restructure accepted' : 'Restructure declined',
              detail: accepted ?
              `New schedule: ${proposal.newInstalmentCount} payments of ₦${proposal.newInstalmentAmount.toLocaleString()}.` :
              note || 'The proposed terms were not workable.',
              actor: 'You'
            }]

          }
        };
      });
      pushToast({
        title:
        response === 'accepted' ? 'New terms agreed' : 'Proposal declined',
        description:
        response === 'accepted' ?
        'The repayment schedule has been replaced and tracking continues.' :
        'You can propose different terms or ask for mediation.',
        variant: response === 'accepted' ? 'success' : 'info'
      });
    },
    [pushToast, updateAgreement]
  );

  const requestMediation = useCallback(
    (id: string) => {
      updateAgreement(id, (agreement) => {
        const resolution = agreement.resolution ?? {
          stage: 'mediation' as const,
          events: []
        };
        const outstanding = outstandingAmount(agreement);
        return {
          ...agreement,
          status: 'in_resolution',
          resolution: {
            ...resolution,
            stage: 'mediation',
            mediationRequested: true,
            offer:
            resolution.offer ?? (
            outstanding >= 50000 ?
            {
              id: uid('of'),
              offerAmount: acquisitionOfferAmount(outstanding),
              outstanding,
              expiresOn: isoDaysFromNow(14),
              status: 'available' as const,
              reasons: [
              'Outstanding balance is above the ₦50,000 acquisition threshold',
              'Repayment has stalled for more than 14 days',
              'Recovery is assessed as commercially viable']

            } :
            {
              id: uid('of'),
              offerAmount: 0,
              outstanding,
              expiresOn: isoDaysFromNow(14),
              status: 'ineligible' as const,
              reasons: [
              'Outstanding balance is below the ₦50,000 acquisition threshold']

            }),
            events: [
            ...resolution.events,
            {
              id: uid('rv'),
              stage: 'mediation' as const,
              date: new Date().toISOString(),
              title: 'Mediation requested',
              detail: 'A neutral YAMI mediator will contact both parties.',
              actor: 'You'
            }]

          }
        };
      });
      pushToast({
        title: 'Mediation requested',
        description: 'A YAMI mediator will contact both parties within 48 hours.',
        variant: 'info'
      });
    },
    [pushToast, updateAgreement]
  );

  const respondToOffer = useCallback(
    (id: string, response: 'accepted' | 'declined') => {
      updateAgreement(id, (agreement) => {
        const resolution = agreement.resolution;
        if (!resolution?.offer) return agreement;
        const accepted = response === 'accepted';
        return {
          ...agreement,
          status: accepted ? 'acquired' : agreement.status,
          resolution: {
            ...resolution,
            stage: accepted ? 'acquisition' : resolution.stage,
            offer: {
              ...resolution.offer,
              status: response,
              recoveredToDate: accepted ? 0 : resolution.offer.recoveredToDate
            },
            events: [
            ...resolution.events,
            {
              id: uid('rv'),
              stage: 'acquisition' as const,
              date: new Date().toISOString(),
              title: accepted ?
              'YAMI purchased the debt' :
              'Purchase offer declined',
              detail: accepted ?
              `You receive ₦${resolution.offer.offerAmount.toLocaleString()} and exit the recovery process.` :
              'You keep the debt and can continue recovery yourself.',
              actor: 'You'
            }]

          }
        };
      });
      pushToast({
        title: response === 'accepted' ? 'Debt purchased' : 'Offer declined',
        description:
        response === 'accepted' ?
        'YAMI now works directly with the borrower. Funds settle in 2 working days.' :
        'The agreement stays with you and mediation remains available.',
        variant: response === 'accepted' ? 'success' : 'info'
      });
    },
    [pushToast, updateAgreement]
  );

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((current) =>
    current.map((notification) => ({ ...notification, read: true }))
    );
  }, []);

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    setSettings((current) => ({ ...current, ...partial }));
  }, []);

  const submitVerification = useCallback(
    (tier: VerificationTier) => {
      setUser((current) => ({ ...current, verification: tier }));
      pushToast({
        title: 'Verification updated',
        description: 'Your new trust level applies to future agreements.',
        variant: 'success'
      });
    },
    [pushToast]
  );

  const reputation = useMemo(() => computeReputation(agreements), [agreements]);

  const value = useMemo<YamiContextValue>(
    () => ({
      user,
      agreements,
      notifications,
      settings,
      loading,
      reputation,
      toast,
      dismissToast: () => setToast(null),
      getAgreement,
      createAgreement,
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
      respondToOffer,
      markAllNotificationsRead,
      updateSettings,
      submitVerification
    }),
    [
    user,
    agreements,
    notifications,
    settings,
    loading,
    reputation,
    toast,
    getAgreement,
    createAgreement,
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
    respondToOffer,
    markAllNotificationsRead,
    updateSettings,
    submitVerification]

  );

  return <YamiContext.Provider value={value}>{children}</YamiContext.Provider>;
}

export function useYami(): YamiContextValue {
  const context = useContext(YamiContext);
  if (!context) throw new Error('useYami must be used within a YamiProvider');
  return context;
}