import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BuildingIcon,
  CheckIcon,
  ShieldCheckIcon,
  StoreIcon,
  UserIcon } from
'lucide-react';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { TextInput } from '../components/TextInput';
import { RadioGroup, RadioGroupItem } from '../components/RadioGroup';
import { SegmentedControl } from '../components/SegmentedControl';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { useAuth, type AccountType } from '../contexts/AuthContext';
import { images } from '../data/images';
import { card, hairline, textPrimary, textSecondary } from '../utils/ui';

const STEPS = ['Account type', 'Your details', 'How you use credit', 'Verification'];

const STEP_MEDIA = [
{
  src: images.marketTrader,
  caption:
  'Individuals, retailers and wholesalers all use the same account — only the setup differs.'
},
{
  src: images.pharmacy,
  caption:
  'Counterparties see your name, trading area and verification level before they accept.'
},
{
  src: images.textileMarket,
  caption:
  'Most traders sit on both sides: stock taken on credit, goods released on credit.'
},
{
  src: images.shopkeeper,
  caption:
  'Verified identity is what turns a name into someone worth extending credit to.'
}];


const ACCOUNT_TYPES: {
  value: AccountType;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
{
  value: 'individual',
  label: 'Individual',
  description: 'Lending to or borrowing from friends, family and colleagues.',
  icon: <UserIcon className="h-4 w-4" aria-hidden="true" />
},
{
  value: 'retailer',
  label: 'Retailer or shop owner',
  description:
  'You take stock on credit from suppliers and give credit to trusted customers.',
  icon: <StoreIcon className="h-4 w-4" aria-hidden="true" />
},
{
  value: 'wholesaler',
  label: 'Wholesaler or distributor',
  description: 'You supply inventory on credit to a book of retailers.',
  icon: <BuildingIcon className="h-4 w-4" aria-hidden="true" />
}];


export function Onboarding() {
  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();

  const [step, setStep] = useState(0);
  const [accountType, setAccountType] = useState<AccountType>('retailer');
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const [usage, setUsage] = useState<'lend' | 'borrow' | 'both'>('both');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isBusiness = accountType !== 'individual';

  const validate = () => {
    const next: Record<string, string> = {};
    if (step === 1) {
      if (isBusiness && businessName.trim().length < 2)
      next.businessName = 'Enter the name customers know you by.';
      if (location.trim().length < 2) next.location = 'Enter your town or market area.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const finish = () => {
    completeOnboarding({
      accountType,
      businessName: isBusiness ? businessName.trim() : undefined,
      location: location.trim(),
      usage
    });
    navigate('/home');
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-text-primary">
      <header
        className={`flex items-center justify-between border-b px-4 py-3 ${hairline}`}>
        
        <Logo variant="full" size={20} wordmark="YAMI" title="YAMI" />
        <ThemeToggle size="sm" />
      </header>

      <div className="mx-auto flex w-full max-w-5xl flex-1 gap-10 px-4 py-8">
        <aside className="hidden w-72 shrink-0 lg:block" aria-hidden="true">
          <div className={`overflow-hidden rounded-xl border ${hairline}`}>
            <img
              src={STEP_MEDIA[step].src}
              alt=""
              className="h-[22rem] w-full object-cover"
              loading="eager" />
            
          </div>
          <p className={`mt-3 text-xs leading-normal ${textSecondary}`}>
            {STEP_MEDIA[step].caption}
          </p>
        </aside>

        <main className="w-full max-w-xl">
        <p className={`text-xs font-medium uppercase tracking-wide ${textSecondary}`}>
          Step {step + 1} of {STEPS.length}
        </p>
        <h1 className={`mt-1 text-xl font-semibold ${textPrimary}`}>{STEPS[step]}</h1>

        <ol className="mt-4 flex items-center gap-1.5" aria-label="Progress">
          {STEPS.map((label, index) =>
            <li key={label} className="h-1 flex-1">
              <span
                className={`block h-1 rounded-full ${
                index <= step ? 'bg-accent' : 'bg-muted-strong'}`
                }
                aria-hidden="true" />
              
            </li>
            )}
        </ol>

        <div className={`${card} mt-5 p-4 sm:p-5`}>
          {step === 0 ?
            <RadioGroup
              label="Which best describes you?"
              description="You can give and receive credit either way — this only tailors the setup."
              value={accountType}
              onChange={(value) => setAccountType(value as AccountType)}>
              
              {ACCOUNT_TYPES.map((type) =>
              <RadioGroupItem
                key={type.value}
                value={type.value}
                description={type.description}>
                
                  {type.label}
                </RadioGroupItem>
              )}
            </RadioGroup> :
            null}

          {step === 1 ?
            <div className="space-y-4">
              {isBusiness ?
              <TextInput
                label="Business name"
                required
                fullWidth
                placeholder="e.g. Adaeze Provisions"
                value={businessName}
                error={errors.businessName}
                onChange={(event) => setBusinessName(event.target.value)} /> :

              null}
              <TextInput
                label="Town or market area"
                required
                fullWidth
                placeholder="e.g. Yaba, Lagos"
                hint="Counterparties see this so they know who they are dealing with."
                value={location}
                error={errors.location}
                onChange={(event) => setLocation(event.target.value)} />
              
            </div> :
            null}

          {step === 2 ?
            <div className="space-y-4">
              <div>
                <p className={`mb-1.5 text-sm font-medium ${textPrimary}`}>
                  How will you mostly use YAMI?
                </p>
                <SegmentedControl
                  aria-label="Usage"
                  fullWidth
                  options={[
                  { value: 'lend', label: 'I give credit' },
                  { value: 'borrow', label: 'I receive credit' },
                  { value: 'both', label: 'Both' }]
                  }
                  value={usage}
                  onChange={(value) => setUsage(value as 'lend' | 'borrow' | 'both')} />
                
              </div>
              <p className={`text-xs leading-normal ${textSecondary}`}>
                Most retailers do both — taking stock on credit from a wholesaler while
                extending credit to their own customers. Your home screen shows both
                sides either way.
              </p>
            </div> :
            null}

          {step === 3 ?
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-subtle text-accent-subtle-foreground">
                  <ShieldCheckIcon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className={`text-sm font-semibold ${textPrimary}`}>
                    Verify your identity next
                  </p>
                  <p className={`mt-0.5 text-xs leading-normal ${textSecondary}`}>
                    Your phone number is confirmed. Adding BVN or NIN is what allows an
                    agreement to go active and makes your reputation shareable. You can
                    browse and draft agreements before then.
                  </p>
                </div>
              </div>

              <ul className={`space-y-2 border-t pt-3 ${hairline}`}>
                {[
                'Phone number verified',
                'Identity verification (BVN or NIN) — recommended now',
                isBusiness ?
                'Business details (CAC) — unlocks trade credit limits' :
                'Business details — only needed if you start trading'].
                map((item, index) =>
                <li key={item} className="flex items-start gap-2.5">
                    <span
                    aria-hidden="true"
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                    index === 0 ?
                    'bg-success-background text-success-foreground' :
                    'bg-muted text-text-secondary'}`
                    }>
                    
                      {index === 0 ? <CheckIcon className="h-2.5 w-2.5" /> : null}
                    </span>
                    <span className={`text-xs leading-normal ${textSecondary}`}>
                      {item}
                    </span>
                  </li>
                )}
              </ul>
            </div> :
            null}
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <Button
              variant="ghost"
              leadingIcon={<ArrowLeftIcon className="h-4 w-4" />}
              onClick={() =>
              step === 0 ? navigate('/signup') : setStep((current) => current - 1)
              }>
              
            Back
          </Button>
          {step < STEPS.length - 1 ?
            <Button
              trailingIcon={<ArrowRightIcon className="h-4 w-4" />}
              onClick={() => {
                if (validate()) setStep((current) => current + 1);
              }}>
              
              Continue
            </Button> :

            <div className="flex gap-2">
              <Button variant="secondary" onClick={finish}>
                Skip for now
              </Button>
              <Button
                onClick={() => {
                  completeOnboarding({
                    accountType,
                    businessName: isBusiness ? businessName.trim() : undefined,
                    location: location.trim(),
                    usage
                  });
                  navigate('/verification');
                }}>
                
                Verify identity
              </Button>
            </div>
            }
        </div>
        </main>
      </div>
    </div>);

}