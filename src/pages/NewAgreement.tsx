import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  CopyIcon,
  ShieldCheckIcon } from
'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { TextInput } from '../components/TextInput';
import { Textarea } from '../components/Textarea';
import { Select } from '../components/Select';
import { SegmentedControl } from '../components/SegmentedControl';
import { RadioGroup, RadioGroupItem } from '../components/RadioGroup';
import { PartyRow } from '../components/common/PartyRow';
import { useYami } from '../contexts/YamiContext';
import { parties } from '../data/parties';
import type {
  Direction,
  Ecosystem,
  ExchangeKind,
  Party,
  RepaymentPlan } from
'../types/yami';
import { ECOSYSTEM_META, VERIFICATION_META } from '../utils/agreement';
import { formatNaira, isoDaysFromNow, formatDate } from '../utils/format';
import {
  card,
  hairline,
  mono,
  subtleAccent,
  textPrimary,
  textSecondary } from
'../utils/ui';

const STEPS = ['Relationship', 'Counterparty', 'What is exchanged', 'Terms', 'Review'];

const COUNT_OPTIONS = [2, 3, 4, 6, 12].map((count) => ({
  value: String(count),
  label: `${count} instalments`
}));

const INTERVAL_OPTIONS = [
{ value: '7', label: 'Weekly' },
{ value: '14', label: 'Every two weeks' },
{ value: '30', label: 'Monthly' }];


const START_OPTIONS = [
{ value: '7', label: 'In one week' },
{ value: '14', label: 'In two weeks' },
{ value: '30', label: 'In one month' },
{ value: '60', label: 'In two months' }];


export function NewAgreement() {
  const navigate = useNavigate();
  const { createAgreement, user } = useYami();

  const [step, setStep] = useState(0);
  const [ecosystem, setEcosystem] = useState<Ecosystem>('individual');
  const [direction, setDirection] = useState<Direction>('lent');
  const [partyId, setPartyId] = useState(parties[0].id);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [useNewParty, setUseNewParty] = useState(false);
  const [exchangeKind, setExchangeKind] = useState<ExchangeKind>('cash');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [plan, setPlan] = useState<RepaymentPlan>('instalments');
  const [count, setCount] = useState('3');
  const [interval, setInterval] = useState('30');
  const [start, setStart] = useState('30');
  const [note, setNote] = useState('');
  const [created, setCreated] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedParty: Party = useNewParty ?
  {
    id: 'p-new',
    name: newName || 'New counterparty',
    phone: newPhone,
    verification: 'unverified',
    reputationScore: 0,
    relationship: 'New contact'
  } :
  parties.find((party) => party.id === partyId) ?? parties[0];

  const principal = Number(amount.replace(/[^0-9.]/g, '')) || 0;

  const validate = (current: number): boolean => {
    const next: Record<string, string> = {};
    if (current === 1 && useNewParty) {
      if (newName.trim().length < 3) next.name = 'Enter the full name.';
      if (newPhone.trim().length < 8) next.phone = 'Enter a reachable phone number.';
    }
    if (current === 2) {
      if (principal <= 0) next.amount = 'Enter the value of what is being exchanged.';
      if (description.trim().length < 4)
      next.description = 'Describe what is being exchanged.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleNext = () => {
    if (!validate(step)) return;
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const handleCreate = () => {
    const agreement = createAgreement({
      direction,
      ecosystem,
      counterparty: selectedParty,
      principal,
      exchangeKind,
      description: description.trim(),
      plan,
      instalmentCount: plan === 'instalments' ? Number(count) : 1,
      firstPaymentInDays: Number(start),
      intervalDays: Number(interval),
      note: note.trim() || undefined
    });
    setCreated(agreement.id);
    setStep(STEPS.length - 1);
  };

  const perInstalment =
  plan === 'instalments' && principal > 0 ?
  Math.round(principal / Number(count)) :
  principal;

  if (created) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <div className={`${card} p-6 text-center`}>
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-success-background text-success-foreground">
            <CheckIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <h1 className={`mt-3 text-base font-semibold ${textPrimary}`}>
            Agreement sent to {selectedParty.name}
          </h1>
          <p className={`mt-1 text-xs leading-normal ${textSecondary}`}>
            It stays in <strong>pending acceptance</strong> until they review the exact
            same terms and accept. Nothing is tracked until both sides agree.
          </p>

          <div className={`mt-4 rounded-lg px-3.5 py-3 text-left ${subtleAccent}`}>
            <p className="text-[11px] uppercase tracking-wide">Share link</p>
            <p className={`${mono} break-all text-xs`}>
              yami.ng/a/{created.replace('ag-', '')}
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button
              fullWidth
              variant="secondary"
              leadingIcon={<CopyIcon className="h-4 w-4" />}
              onClick={() => navigate('/agreements')}>
              
              Copy link & close
            </Button>
            <Button fullWidth onClick={() => navigate(`/agreements/${created}`)}>
              Open agreement
            </Button>
          </div>
        </div>
      </div>);

  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <PageHeader
        breadcrumbs={[{ label: 'Agreements', href: '/agreements' }, { label: 'New' }]}
        title="New agreement"
        description="Document credit you are about to give or receive." />
      

      <ol className="flex items-center gap-1.5" aria-label="Progress">
        {STEPS.map((label, index) =>
        <li key={label} className="flex flex-1 flex-col gap-1">
            <span
            className={`h-1 rounded-full ${
            index <= step ?
            'bg-accent dark:bg-accent-dark' :
            'bg-muted-strong'}`
            }
            aria-hidden="true" />
          
            <span
            className={`text-[10px] ${index === step ? textPrimary : textSecondary}`}>
            
              {label}
            </span>
          </li>
        )}
      </ol>

      <div className={`${card} p-4 sm:p-5`}>
        {step === 0 ?
        <div className="space-y-4">
            <RadioGroup
            label="What kind of credit relationship is this?"
            value={ecosystem}
            onChange={(value) => setEcosystem(value as Ecosystem)}>
            
              {(Object.keys(ECOSYSTEM_META) as Ecosystem[]).map((key) =>
            <RadioGroupItem
              key={key}
              value={key}
              description={ECOSYSTEM_META[key].detail}>
              
                  {ECOSYSTEM_META[key].label}
                </RadioGroupItem>
            )}
            </RadioGroup>

            <div>
              <p className={`mb-1.5 text-xs font-medium ${textPrimary}`}>
                Which side are you on?
              </p>
              <SegmentedControl
              aria-label="Direction"
              fullWidth
              options={[
              { value: 'lent', label: 'I am giving credit' },
              { value: 'borrowed', label: 'I am receiving credit' }]
              }
              value={direction}
              onChange={(value) => setDirection(value as Direction)} />
            
            </div>
          </div> :
        null}

        {step === 1 ?
        <div className="space-y-4">
            <SegmentedControl
            aria-label="Counterparty source"
            fullWidth
            size="sm"
            options={[
            { value: 'existing', label: 'Someone on YAMI' },
            { value: 'new', label: 'Invite someone new' }]
            }
            value={useNewParty ? 'new' : 'existing'}
            onChange={(value) => setUseNewParty(value === 'new')} />
          

            {useNewParty ?
          <div className="space-y-3">
                <TextInput
              label="Full name"
              required
              fullWidth
              value={newName}
              error={errors.name}
              onChange={(event) => setNewName(event.target.value)} />
            
                <TextInput
              label="Phone number"
              required
              fullWidth
              inputMode="tel"
              placeholder="+234 800 000 0000"
              hint="They receive an SMS invite and complete verification before the agreement goes active."
              value={newPhone}
              error={errors.phone}
              onChange={(event) => setNewPhone(event.target.value)} />
            
              </div> :

          <ul className="space-y-2">
                {parties.map((party) => {
              const selected = party.id === partyId;
              return (
                <li key={party.id}>
                      <button
                    type="button"
                    onClick={() => setPartyId(party.id)}
                    aria-pressed={selected}
                    className={`w-full rounded-lg border px-3 py-2.5 text-left transition-colors ${
                    selected ?
                    'border-accent bg-accent-subtle' :
                    `${hairline} hover:border-accent/40`}`
                    }>
                    
                        <div className="flex items-center justify-between gap-3">
                          <PartyRow
                        name={party.name}
                        role={party.relationship}
                        verification={party.verification}
                        meta={party.location}
                        size="sm" />
                      
                          <span className={`${mono} text-xs ${textSecondary}`}>
                            {party.reputationScore}
                          </span>
                        </div>
                      </button>
                    </li>);

            })}
              </ul>
          }
          </div> :
        null}

        {step === 2 ?
        <div className="space-y-4">
            <SegmentedControl
            aria-label="What is exchanged"
            fullWidth
            options={[
            { value: 'cash', label: 'Cash' },
            { value: 'goods', label: 'Goods' }]
            }
            value={exchangeKind}
            onChange={(value) => setExchangeKind(value as ExchangeKind)} />
          
            <TextInput
            label={exchangeKind === 'cash' ? 'Amount' : 'Value of goods'}
            required
            fullWidth
            inputMode="numeric"
            placeholder="0"
            leadingIcon={<span className="text-sm">₦</span>}
            value={amount}
            error={errors.amount}
            onChange={(event) => setAmount(event.target.value)} />
          
            <TextInput
            label="What is this for?"
            required
            fullWidth
            placeholder={
            exchangeKind === 'cash' ?
            'e.g. Cash loan for school fees' :
            'e.g. 12 bales of ankara supplied on credit'
            }
            value={description}
            error={errors.description}
            onChange={(event) => setDescription(event.target.value)} />
          
          </div> :
        null}

        {step === 3 ?
        <div className="space-y-4">
            <SegmentedControl
            aria-label="Repayment plan"
            fullWidth
            options={[
            { value: 'lump_sum', label: 'One payment' },
            { value: 'instalments', label: 'Instalments' }]
            }
            value={plan}
            onChange={(value) => setPlan(value as RepaymentPlan)} />
          

            {plan === 'instalments' ?
          <div className="grid gap-3 sm:grid-cols-2">
                <Select
              label="How many payments?"
              options={COUNT_OPTIONS}
              value={count}
              onChange={setCount} />
            
                <Select
              label="How often?"
              options={INTERVAL_OPTIONS}
              value={interval}
              onChange={setInterval} />
            
              </div> :
          null}

            <Select
            label={plan === 'instalments' ? 'First payment due' : 'Payment due'}
            options={START_OPTIONS}
            value={start}
            onChange={setStart} />
          

            <Textarea
            label="Anything else to record? (optional)"
            placeholder="e.g. Repayment starts after the harvest season."
            rows={3}
            value={note}
            onChange={(event) => setNote(event.target.value)} />
          
          </div> :
        null}

        {step === 4 ?
        <div className="space-y-4">
            <div>
              <h2 className={`text-sm font-semibold ${textPrimary}`}>
                Read this back in plain language
              </h2>
              <p className={`mt-1.5 text-sm leading-relaxed ${textPrimary}`}>
                {direction === 'lent' ?
              <>
                    You are giving <strong>{selectedParty.name}</strong>{' '}
                    {exchangeKind === 'cash' ? 'cash' : 'goods'} worth{' '}
                    <strong className={mono}>{formatNaira(principal)}</strong> for{' '}
                    {description || 'an agreed purpose'}. They repay{' '}
                    {plan === 'instalments' ?
                <>
                        <strong className={mono}>{formatNaira(perInstalment)}</strong>{' '}
                        {INTERVAL_OPTIONS.find((o) => o.value === interval)?.label.toLowerCase()}{' '}
                        for {count} payments
                      </> :

                <>the full amount in one payment</>
                }
                    , starting {formatDate(isoDaysFromNow(Number(start)))}.
                  </> :

              <>
                    <strong>{selectedParty.name}</strong> is giving you{' '}
                    {exchangeKind === 'cash' ? 'cash' : 'goods'} worth{' '}
                    <strong className={mono}>{formatNaira(principal)}</strong> for{' '}
                    {description || 'an agreed purpose'}. You repay{' '}
                    {plan === 'instalments' ?
                <>
                        <strong className={mono}>{formatNaira(perInstalment)}</strong>{' '}
                        {INTERVAL_OPTIONS.find((o) => o.value === interval)?.label.toLowerCase()}{' '}
                        for {count} payments
                      </> :

                <>the full amount in one payment</>
                }
                    , starting {formatDate(isoDaysFromNow(Number(start)))}.
                  </>
              }
              </p>
            </div>

            <div className={`space-y-3 rounded-lg border p-3.5 ${hairline}`}>
              <PartyRow
              name={user.name}
              role={direction === 'lent' ? 'Lender (you)' : 'Borrower (you)'}
              verification={user.verification}
              size="sm" />
            
              <PartyRow
              name={selectedParty.name}
              role={direction === 'lent' ? 'Borrower' : 'Lender'}
              verification={selectedParty.verification}
              size="sm" />
            
            </div>

            {VERIFICATION_META[selectedParty.verification].level < 2 ?
          <div className="flex items-start gap-2.5 rounded-lg border border-warning-foreground/30 bg-warning-background px-3.5 py-3 text-warning-foreground">
                <ShieldCheckIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <p className="text-xs leading-normal">
                  {selectedParty.name} is not identity verified yet. They will be asked to
                  complete BVN or NIN verification before this agreement becomes active.
                </p>
              </div> :
          null}
          </div> :
        null}
      </div>

      <div className="flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          leadingIcon={<ArrowLeftIcon className="h-4 w-4" />}
          onClick={() =>
          step === 0 ? navigate('/agreements') : setStep((current) => current - 1)
          }>
          
          {step === 0 ? 'Cancel' : 'Back'}
        </Button>
        {step < STEPS.length - 1 ?
        <Button
          trailingIcon={<ArrowRightIcon className="h-4 w-4" />}
          onClick={handleNext}>
          
            Continue
          </Button> :

        <Button onClick={handleCreate}>Send for acceptance</Button>
        }
      </div>
    </div>);

}