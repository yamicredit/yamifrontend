import type { CurrentUser, Party } from '../types/yami';

export const currentUser: CurrentUser = {
  id: 'me',
  name: 'Adaeze Nwosu',
  phone: '+234 803 441 2087',
  email: 'adaeze.nwosu@gmail.com',
  businessName: 'Adaeze Provisions',
  location: 'Yaba, Lagos',
  verification: 'identity'
};

export const parties: Party[] = [
{
  id: 'p-chidi',
  name: 'Chidi Okonkwo',
  phone: '+234 802 118 4432',
  verification: 'identity',
  location: 'Surulere, Lagos',
  reputationScore: 742,
  relationship: 'Colleague'
},
{
  id: 'p-amaka',
  name: 'Amaka Eze',
  phone: '+234 806 552 9017',
  verification: 'basic',
  location: 'Enugu',
  reputationScore: 688,
  relationship: 'Cousin'
},
{
  id: 'p-ladipo',
  name: 'Ladipo Textiles Ltd',
  phone: '+234 701 330 5588',
  verification: 'full',
  businessName: 'Ladipo Textiles Ltd',
  location: 'Balogun Market, Lagos',
  reputationScore: 810,
  relationship: 'Fabric wholesaler'
},
{
  id: 'p-bello',
  name: 'Bello Musa',
  phone: '+234 809 774 1220',
  verification: 'identity',
  businessName: 'Bello Mini Mart',
  location: 'Mile 12, Lagos',
  reputationScore: 604,
  relationship: 'Retail customer'
},
{
  id: 'p-fatima',
  name: 'Fatima Yusuf',
  phone: '+234 705 902 3311',
  verification: 'basic',
  location: 'Yaba, Lagos',
  reputationScore: 655,
  relationship: 'Regular customer'
},
{
  id: 'p-emeka',
  name: 'Emeka Building Materials',
  phone: '+234 803 220 7744',
  verification: 'full',
  businessName: 'Emeka Building Materials',
  location: 'Ojota, Lagos',
  reputationScore: 775,
  relationship: 'Supplier'
},
{
  id: 'p-tunde',
  name: 'Tunde Adebayo',
  phone: '+234 813 665 0091',
  verification: 'unverified',
  location: 'Ikorodu, Lagos',
  reputationScore: 512,
  relationship: 'Friend'
},
{
  id: 'p-ngozi',
  name: 'Ngozi Grocery Hub',
  phone: '+234 802 447 6612',
  verification: 'identity',
  businessName: 'Ngozi Grocery Hub',
  location: 'Ketu, Lagos',
  reputationScore: 700,
  relationship: 'Retail customer'
},
{
  id: 'p-segun',
  name: 'Segun Alabi',
  phone: '+234 817 220 9931',
  verification: 'basic',
  location: 'Agege, Lagos',
  reputationScore: 431,
  relationship: 'Former customer'
}];


export function partyById(id: string): Party {
  const found = parties.find((party) => party.id === id);
  if (!found) throw new Error(`Unknown party: ${id}`);
  return found;
}