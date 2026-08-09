import React, { useState } from 'react';
import { AlertTriangleIcon, CheckIcon, ShieldCheckIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { TextInput } from '../components/TextInput';
import { Badge } from '../components/Badge';
import { useYami } from '../contexts/YamiContext';
import type { VerificationTier } from '../types/yami';
import { VERIFICATION_META } from '../utils/agreement';
import { card, hairline, textPrimary, textSecondary } from '../utils/ui';

interface TierStep {
  tier: VerificationTier;
  title: string;
  description: string;
  unlocks: string;
}

const STEPS: TierStep[] = [
{
  tier: 'basic',
  title: 'Phone & email',
  description: 'Confirm the number and email people will reach you on.',
  unlocks: 'Create agreements and be invited to them.'
},
{
  tier: 'identity',
  title: 'Identity (BVN or NIN)',
  description: 'Match your name and date of birth against your BVN or NIN.',
  unlocks: 'Agreements can go active and your reputation becomes shareable.'
},
{
  tier: 'full',
  title: 'Business details',
  description: 'Add CAC number and trading address for wholesale or retail credit.',
  unlocks: 'Trade credit limits, supplier financing and the customer book.'
}];


export function Verification() {
  const { user, submitVerification } = useYami();
  const [nin, setNin] = useState('');
  const [cac, setCac] = useState('');
  const [documentRejected, setDocumentRejected] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const currentLevel = VERIFICATION_META[user.verification].level;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <PageHeader
        title="Identity & verification"
        description="Verification is what turns a name into a party someone can safely extend credit to."
        badge={
        <Badge variant={currentLevel >= 2 ? 'success' : 'warning'} dot>
            {VERIFICATION_META[user.verification].label}
          </Badge>
        } />
      

      {currentLevel < 2 ?
      <div className="flex items-start gap-2.5 rounded-lg border border-warning-foreground/30 bg-warning-background px-3.5 py-3 text-warning-foreground">
          <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p className="text-xs leading-normal">
            You can browse and draft agreements, but nothing goes active until your
            identity is verified. This protects the person on the other side too.
          </p>
        </div> :
      null}

      <ol className="space-y-3">
        {STEPS.map((step, index) => {
          const level = VERIFICATION_META[step.tier].level;
          const done = currentLevel >= level;
          const isNext = !done && currentLevel === level - 1;
          return (
            <li key={step.tier} className={card}>
              <div className={`flex items-start gap-3 px-4 py-3.5 ${done ? '' : ''}`}>
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  done ?
                  'bg-success-background text-success-foreground' :
                  'bg-muted text-text-secondary'}`
                  }>
                  
                  {done ? <CheckIcon className="h-3.5 w-3.5" /> : index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className={`text-sm font-semibold ${textPrimary}`}>
                      {step.title}
                    </h2>
                    {done ?
                    <Badge size="sm" variant="success">
                        Verified
                      </Badge> :
                    isNext ?
                    <Badge size="sm" variant="info">
                        Next step
                      </Badge> :

                    <Badge size="sm" variant="neutral">
                        Locked
                      </Badge>
                    }
                  </div>
                  <p className={`mt-0.5 text-xs leading-normal ${textSecondary}`}>
                    {step.description}
                  </p>
                  <p className={`mt-1 text-[11px] ${textSecondary}`}>
                    Unlocks: {step.unlocks}
                  </p>

                  {isNext && step.tier === 'basic' ?
                  <div className={`mt-3 border-t pt-3 ${hairline}`}>
                      <p className={`text-xs ${textSecondary}`}>
                        A 6-digit code was sent to {user.phone}.
                      </p>
                      <Button
                      size="sm"
                      className="mt-2"
                      onClick={() => submitVerification('basic')}>
                      
                        I have confirmed the code
                      </Button>
                    </div> :
                  null}

                  {isNext && step.tier === 'identity' ?
                  <div className={`mt-3 space-y-2.5 border-t pt-3 ${hairline}`}>
                      <TextInput
                      label="BVN or NIN"
                      inputMode="numeric"
                      placeholder="11 digits"
                      fullWidth
                      value={nin}
                      error={error}
                      onChange={(event) => {
                        setNin(event.target.value);
                        setError(undefined);
                      }} />
                    
                      {documentRejected ?
                    <p className="rounded-md bg-danger-background px-2.5 py-2 text-[11px] text-danger-foreground dark:bg-danger-background-dark dark:text-danger-foreground-dark">
                          The details did not match the record on file. Check the number
                          and try again, or upload a government ID instead.
                        </p> :
                    null}
                      <div className="flex flex-wrap gap-2">
                        <Button
                        size="sm"
                        onClick={() => {
                          const digits = nin.replace(/\D/g, '');
                          if (digits.length !== 11) {
                            setError('Enter the full 11-digit BVN or NIN.');
                            setDocumentRejected(false);
                            return;
                          }
                          if (digits.startsWith('0')) {
                            setDocumentRejected(true);
                            return;
                          }
                          setDocumentRejected(false);
                          submitVerification('identity');
                        }}>
                        
                          Verify identity
                        </Button>
                        <Button size="sm" variant="secondary">
                          Upload government ID instead
                        </Button>
                      </div>
                    </div> :
                  null}

                  {isNext && step.tier === 'full' ?
                  <div className={`mt-3 space-y-2.5 border-t pt-3 ${hairline}`}>
                      <TextInput
                      label="CAC registration number"
                      placeholder="RC 1234567"
                      fullWidth
                      value={cac}
                      onChange={(event) => setCac(event.target.value)} />
                    
                      <Button
                      size="sm"
                      disabled={cac.trim().length < 4}
                      onClick={() => submitVerification('full')}>
                      
                        Submit business details
                      </Button>
                    </div> :
                  null}
                </div>
              </div>
            </li>);

        })}
      </ol>

      <div className={`${card} flex items-start gap-2.5 p-4`}>
        <ShieldCheckIcon
          className="mt-0.5 h-4 w-4 shrink-0 text-text-secondary dark:text-text-secondary-dark"
          aria-hidden="true" />
        
        <p className={`text-xs leading-normal ${textSecondary}`}>
          Your BVN or NIN is used only to confirm your identity. It is encrypted, never
          shown to counterparties, and never shared without your explicit consent.
        </p>
      </div>
    </div>);

}