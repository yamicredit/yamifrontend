import { images } from './images';

export const ecosystems = [
{
  id: 'individual',
  title: 'Between people',
  description:
  'Loans between friends, family, colleagues and acquaintances — documented before the money moves.',
  image: images.friends,
  alt: 'Two friends talking over a phone at an outdoor café table in Lagos'
},
{
  id: 'wholesale',
  title: 'Wholesaler to retailer',
  description:
  'Inventory supplied on credit with agreed repayment terms and a visible trading record.',
  image: images.textileMarket,
  alt: 'A textile trader checking a ledger beside stacked bales of ankara fabric'
},
{
  id: 'retail',
  title: 'Retailer to consumer',
  description:
  'Goods released to trusted customers with deferred payment and automatic reminders.',
  image: images.pharmacy,
  alt: 'A pharmacist standing behind the counter of a neighbourhood pharmacy'
}];


export const cycle = [
{
  step: '01',
  title: 'Trust already exists',
  description: 'You know the person. YAMI simply writes it down.'
},
{
  step: '02',
  title: 'Agree and verify',
  description:
  'Both parties see the same terms and confirm identity before anything goes active.'
},
{
  step: '03',
  title: 'Track repayments',
  description:
  'Payments are recorded, confirmed by both sides, and kept as an immutable history.'
},
{
  step: '04',
  title: 'Build reputation',
  description:
  'Repayment behaviour becomes a portable score you can show any supplier or lender.'
},
{
  step: '05',
  title: 'Resolve problems',
  description:
  'Reminders, restructuring, mediation — and, where eligible, YAMI buys the debt.'
}];


export const capabilities = [
{
  title: 'Digital credit agreements',
  description:
  'Terms, schedule and both signatures in one record neither side can quietly change.'
},
{
  title: 'Identity verification',
  description:
  'Tiered KYC from phone and email to BVN or NIN and registered business details.'
},
{
  title: 'Repayment monitoring',
  description:
  'Balances, schedules, reminders and a payment history that cannot be edited.'
},
{
  title: 'Financial reputation',
  description:
  'A portable score built from real repayment behaviour, shared only with your consent.'
},
{
  title: 'Structured resolution',
  description:
  'Early intervention, restructuring and mediation before a relationship is damaged.'
},
{
  title: 'Debt acquisition',
  description:
  'For eligible distressed debts, YAMI pays the lender and takes over recovery.'
}];


export const proofPoints = [
{ label: 'Documented agreements', value: 'Both sides, one record' },
{ label: 'Verification tiers', value: 'Phone → BVN/NIN → business' },
{ label: 'Reputation range', value: '300 – 900' }];


export const testimonial = {
  quote:
  'I used to keep everything in a notebook and argue about it later. Now my customers see the same record I see — and the ones who pay well have something to show for it.',
  name: 'Chinelo Obi',
  role: 'Grocery retailer · Ketu, Lagos',
  image: images.portrait,
  alt: 'Portrait of a Nigerian shop owner smiling'
};