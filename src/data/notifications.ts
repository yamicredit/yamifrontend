import type { AppNotification } from '../types/yami';
import { isoDaysFromNow } from '../utils/format';

export const seedNotifications: AppNotification[] = [
{
  id: 'nt-1',
  title: 'Bello Musa proposed new repayment terms',
  detail: '₦16,000 every two weeks for 4 payments on YAMI-1009.',
  date: isoDaysFromNow(-1),
  urgency: 'urgent',
  agreementId: 'ag-1009',
  read: false
},
{
  id: 'nt-2',
  title: 'Debt purchase offer available',
  detail: 'YAMI offers ₦41,600 for the ₦64,000 outstanding on YAMI-1055.',
  date: isoDaysFromNow(-1),
  urgency: 'urgent',
  agreementId: 'ag-1055',
  read: false
},
{
  id: 'nt-3',
  title: 'Fatima Yusuf recorded a ₦6,000 payment',
  detail: 'Confirm the payment so it counts towards her repayment history.',
  date: isoDaysFromNow(-1),
  urgency: 'due',
  agreementId: 'ag-1038',
  read: false
},
{
  id: 'nt-4',
  title: 'Instalment due in 3 days',
  detail: 'Fatima Yusuf owes ₦18,500 on YAMI-1038.',
  date: isoDaysFromNow(-2),
  urgency: 'due',
  agreementId: 'ag-1038',
  read: true
},
{
  id: 'nt-5',
  title: 'Amaka Eze has not responded yet',
  detail: 'YAMI-1067 is still waiting for acceptance.',
  date: isoDaysFromNow(-2),
  urgency: 'info',
  agreementId: 'ag-1067',
  read: true
},
{
  id: 'nt-6',
  title: 'Recovery payment received on YAMI-0965',
  detail: 'YAMI recovered ₦9,000 from Segun Alabi this month.',
  date: isoDaysFromNow(-6),
  urgency: 'info',
  agreementId: 'ag-0965',
  read: true
}];