import type { Agreement } from '../types/yami';
import { isoDaysFromNow } from '../utils/format';
import { buildInstalments } from '../utils/agreement';
import { partyById } from './parties';

export const seedAgreements: Agreement[] = [
{
  id: 'ag-1042',
  reference: 'YAMI-1042',
  direction: 'lent',
  ecosystem: 'individual',
  counterparty: partyById('p-chidi'),
  principal: 120000,
  exchangeKind: 'cash',
  description: 'Cash loan for school fees',
  createdOn: isoDaysFromNow(-64),
  dueDate: isoDaysFromNow(28),
  plan: 'instalments',
  instalments: buildInstalments(120000, 4, -32, 30, 'ag-1042'),
  payments: [
  {
    id: 'pm-1042-1',
    date: isoDaysFromNow(-58),
    amount: 30000,
    method: 'transfer',
    reference: 'GTB/8841203',
    recordedBy: 'them',
    confirmed: true
  },
  {
    id: 'pm-1042-2',
    date: isoDaysFromNow(-27),
    amount: 26000,
    method: 'transfer',
    reference: 'GTB/9004117',
    recordedBy: 'them',
    confirmed: true
  }],

  status: 'active',
  note: 'Chidi asked for two months to clear the balance after his salary review.'
},
{
  id: 'ag-1038',
  reference: 'YAMI-1038',
  direction: 'lent',
  ecosystem: 'retail',
  counterparty: partyById('p-fatima'),
  principal: 18500,
  exchangeKind: 'goods',
  description: 'Provisions taken on credit — rice, oil, detergent',
  createdOn: isoDaysFromNow(-11),
  dueDate: isoDaysFromNow(3),
  plan: 'lump_sum',
  instalments: [
  { id: 'ag-1038-i1', dueDate: isoDaysFromNow(3), amount: 18500 }],

  payments: [
  {
    id: 'pm-1038-1',
    date: isoDaysFromNow(-1),
    amount: 6000,
    method: 'cash',
    recordedBy: 'them',
    confirmed: false
  }],

  status: 'active'
},
{
  id: 'ag-1021',
  reference: 'YAMI-1021',
  direction: 'borrowed',
  ecosystem: 'wholesale',
  counterparty: partyById('p-ladipo'),
  principal: 450000,
  exchangeKind: 'goods',
  description: '12 bales of ankara supplied on trade credit',
  createdOn: isoDaysFromNow(-40),
  dueDate: isoDaysFromNow(50),
  plan: 'instalments',
  instalments: buildInstalments(450000, 3, -10, 30, 'ag-1021'),
  payments: [
  {
    id: 'pm-1021-1',
    date: isoDaysFromNow(-12),
    amount: 150000,
    method: 'transfer',
    reference: 'ZEN/22841',
    recordedBy: 'me',
    confirmed: true
  }],

  status: 'active',
  note: 'Standard 90-day supply terms agreed with Ladipo Textiles.'
},
{
  id: 'ag-1055',
  reference: 'YAMI-1055',
  direction: 'lent',
  ecosystem: 'individual',
  counterparty: partyById('p-tunde'),
  principal: 75000,
  exchangeKind: 'cash',
  description: 'Short-term cash loan for generator repair',
  createdOn: isoDaysFromNow(-72),
  dueDate: isoDaysFromNow(-24),
  plan: 'lump_sum',
  instalments: [
  { id: 'ag-1055-i1', dueDate: isoDaysFromNow(-24), amount: 75000 }],

  payments: [
  {
    id: 'pm-1055-1',
    date: isoDaysFromNow(-40),
    amount: 11000,
    method: 'cash',
    recordedBy: 'them',
    confirmed: true
  }],

  status: 'in_resolution',
  resolution: {
    stage: 'mediation',
    mediationRequested: true,
    events: [
    {
      id: 'rv-1055-1',
      stage: 'reminder',
      date: isoDaysFromNow(-23),
      title: 'Reminder sent',
      detail: 'Automatic SMS and in-app reminder sent the day after the due date.',
      actor: 'YAMI'
    },
    {
      id: 'rv-1055-2',
      stage: 'intervention',
      date: isoDaysFromNow(-16),
      title: 'Early intervention opened',
      detail:
      'Tunde reported that his shop was shut for two weeks and asked for more time.',
      actor: 'Tunde Adebayo'
    },
    {
      id: 'rv-1055-3',
      stage: 'mediation',
      date: isoDaysFromNow(-4),
      title: 'Mediation requested',
      detail:
      'You asked YAMI to mediate after the restructure conversation stalled.',
      actor: 'You'
    }],

    offer: {
      id: 'of-1055',
      offerAmount: 41600,
      outstanding: 64000,
      expiresOn: isoDaysFromNow(9),
      status: 'available',
      reasons: [
      'Outstanding balance is above the ₦50,000 acquisition threshold',
      'Borrower identity is confirmed at basic tier with a reachable phone number',
      'Recovery is assessed as commercially viable over 6 months']

    }
  }
},
{
  id: 'ag-1009',
  reference: 'YAMI-1009',
  direction: 'lent',
  ecosystem: 'retail',
  counterparty: partyById('p-bello'),
  principal: 96000,
  exchangeKind: 'goods',
  description: 'Cartons of soft drinks and water supplied on credit',
  createdOn: isoDaysFromNow(-58),
  dueDate: isoDaysFromNow(-9),
  plan: 'instalments',
  instalments: buildInstalments(96000, 3, -39, 15, 'ag-1009'),
  payments: [
  {
    id: 'pm-1009-1',
    date: isoDaysFromNow(-38),
    amount: 32000,
    method: 'cash',
    recordedBy: 'them',
    confirmed: true
  }],

  status: 'in_resolution',
  resolution: {
    stage: 'restructure',
    events: [
    {
      id: 'rv-1009-1',
      stage: 'reminder',
      date: isoDaysFromNow(-22),
      title: 'Reminder sent',
      detail: 'Reminder sent by SMS three days before the second instalment.',
      actor: 'YAMI'
    },
    {
      id: 'rv-1009-2',
      stage: 'intervention',
      date: isoDaysFromNow(-8),
      title: 'Early intervention opened',
      detail: 'Sales dropped after the market closure; Bello asked to spread payments.',
      actor: 'Bello Musa'
    }],

    proposal: {
      id: 'rp-1009',
      proposedBy: 'them',
      newInstalmentAmount: 16000,
      newInstalmentCount: 4,
      firstPaymentDate: isoDaysFromNow(6),
      reason:
      'Mile 12 market was shut for eight days. Bello can pay ₦16,000 every two weeks.',
      status: 'proposed'
    }
  }
},
{
  id: 'ag-1067',
  reference: 'YAMI-1067',
  direction: 'lent',
  ecosystem: 'individual',
  counterparty: partyById('p-amaka'),
  principal: 40000,
  exchangeKind: 'cash',
  description: 'Cash loan towards shop rent',
  createdOn: isoDaysFromNow(-2),
  dueDate: isoDaysFromNow(30),
  plan: 'lump_sum',
  instalments: [
  { id: 'ag-1067-i1', dueDate: isoDaysFromNow(30), amount: 40000 }],

  payments: [],
  status: 'pending',
  note: 'Waiting for Amaka to review and accept the terms.'
},
{
  id: 'ag-0994',
  reference: 'YAMI-0994',
  direction: 'borrowed',
  ecosystem: 'wholesale',
  counterparty: partyById('p-emeka'),
  principal: 230000,
  exchangeKind: 'goods',
  description: 'Cement and roofing sheets supplied on 60-day terms',
  createdOn: isoDaysFromNow(-140),
  dueDate: isoDaysFromNow(-80),
  plan: 'instalments',
  instalments: buildInstalments(230000, 2, -110, 30, 'ag-0994'),
  payments: [
  {
    id: 'pm-0994-1',
    date: isoDaysFromNow(-112),
    amount: 115000,
    method: 'transfer',
    reference: 'UBA/55120',
    recordedBy: 'me',
    confirmed: true
  },
  {
    id: 'pm-0994-2',
    date: isoDaysFromNow(-84),
    amount: 115000,
    method: 'transfer',
    reference: 'UBA/58803',
    recordedBy: 'me',
    confirmed: true
  }],

  status: 'settled'
},
{
  id: 'ag-0981',
  reference: 'YAMI-0981',
  direction: 'lent',
  ecosystem: 'retail',
  counterparty: partyById('p-ngozi'),
  principal: 52000,
  exchangeKind: 'goods',
  description: 'Bulk provisions supplied to Ngozi Grocery Hub',
  createdOn: isoDaysFromNow(-96),
  dueDate: isoDaysFromNow(-66),
  plan: 'lump_sum',
  instalments: [
  { id: 'ag-0981-i1', dueDate: isoDaysFromNow(-66), amount: 52000 }],

  payments: [
  {
    id: 'pm-0981-1',
    date: isoDaysFromNow(-68),
    amount: 52000,
    method: 'pos',
    reference: 'POS/44112',
    recordedBy: 'them',
    confirmed: true
  }],

  status: 'settled'
},
{
  id: 'ag-0965',
  reference: 'YAMI-0965',
  direction: 'lent',
  ecosystem: 'retail',
  counterparty: partyById('p-segun'),
  principal: 95000,
  exchangeKind: 'goods',
  description: 'Provisions supplied on credit before the shop relocated',
  createdOn: isoDaysFromNow(-210),
  dueDate: isoDaysFromNow(-150),
  plan: 'lump_sum',
  instalments: [
  { id: 'ag-0965-i1', dueDate: isoDaysFromNow(-150), amount: 95000 }],

  payments: [
  {
    id: 'pm-0965-1',
    date: isoDaysFromNow(-170),
    amount: 20000,
    method: 'cash',
    recordedBy: 'them',
    confirmed: true
  }],

  status: 'in_recovery',
  resolution: {
    stage: 'recovery',
    events: [
    {
      id: 'rv-0965-1',
      stage: 'reminder',
      date: isoDaysFromNow(-148),
      title: 'Reminder sent',
      detail: 'Reminders sent across SMS and in-app for three weeks.',
      actor: 'YAMI'
    },
    {
      id: 'rv-0965-2',
      stage: 'mediation',
      date: isoDaysFromNow(-120),
      title: 'Mediation closed without agreement',
      detail: 'Segun relocated and stopped responding to the mediator.',
      actor: 'YAMI Mediation'
    },
    {
      id: 'rv-0965-3',
      stage: 'acquisition',
      date: isoDaysFromNow(-96),
      title: 'YAMI purchased the debt',
      detail:
      'You received ₦48,750 and exited the recovery process. YAMI now works with Segun directly.',
      actor: 'YAMI'
    },
    {
      id: 'rv-0965-4',
      stage: 'recovery',
      date: isoDaysFromNow(-20),
      title: 'Recovery plan agreed',
      detail: 'Segun agreed a ₦9,000 monthly plan with the YAMI recovery team.',
      actor: 'YAMI Recovery'
    }],

    offer: {
      id: 'of-0965',
      offerAmount: 48750,
      outstanding: 75000,
      expiresOn: isoDaysFromNow(-96),
      status: 'accepted',
      reasons: [
      'Balance above acquisition threshold',
      'Borrower unresponsive after mediation'],

      recoveredToDate: 27000
    }
  }
},
{
  id: 'ag-1060',
  reference: 'YAMI-1060',
  direction: 'lent',
  ecosystem: 'individual',
  counterparty: partyById('p-tunde'),
  principal: 25000,
  exchangeKind: 'cash',
  description: 'Cash loan request declined at the terms stage',
  createdOn: isoDaysFromNow(-30),
  dueDate: isoDaysFromNow(-1),
  plan: 'lump_sum',
  instalments: [
  { id: 'ag-1060-i1', dueDate: isoDaysFromNow(-1), amount: 25000 }],

  payments: [],
  status: 'declined',
  note: 'Tunde did not accept the 30-day repayment window.'
}];