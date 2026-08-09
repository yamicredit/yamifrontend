import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ShieldCheckIcon } from 'lucide-react';
import { AuthShell } from '../components/auth/AuthShell';
import { Button } from '../components/Button';
import { TextInput } from '../components/TextInput';
import { Checkbox } from '../components/Checkbox';
import { useAuth } from '../contexts/AuthContext';
import { images } from '../data/images';
import { mono, textPrimary, textSecondary } from '../utils/ui';

export function SignUp() {
  const navigate = useNavigate();
  const { startSignUp } = useAuth();
  const [stage, setStage] = useState<'details' | 'code'>('details');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const submitDetails = () => {
    const next: Record<string, string> = {};
    if (name.trim().length < 3) next.name = 'Enter your full name as it appears on your ID.';
    if (phone.replace(/\D/g, '').length < 10) next.phone = 'Enter a reachable phone number.';
    if (!consent) next.consent = 'You must accept the terms to continue.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setStage('code');
    }, 700);
  };

  const verify = () => {
    if (code.replace(/\D/g, '').length !== 6) {
      setErrors({ code: 'Enter the 6-digit code sent by SMS.' });
      return;
    }
    startSignUp(phone);
    navigate('/onboarding');
  };

  return (
    <AuthShell
      asideImage={images.friends}
      asideImageAlt="Two friends talking over a phone at an outdoor café table in Lagos"
      asidePoints={[
      'One account for credit you give and credit you receive',
      'Your counterparty sees the exact same terms',
      'Every confirmed repayment builds a portable reputation']
      }
      title={stage === 'details' ? 'Create your YAMI account' : 'Confirm your number'}
      description={
      stage === 'details' ?
      'One account works for both sides — credit you give and credit you receive.' :
      `We sent a 6-digit code by SMS to ${phone}.`
      }
      footer={
      <p className={`text-center text-xs ${textSecondary}`}>
          Already have an account?{' '}
          <Link to="/signin" className="font-medium text-accent">
            Sign in
          </Link>
        </p>
      }>
      
      {stage === 'details' ?
      <div className="space-y-4">
          <TextInput
          label="Full name"
          required
          fullWidth
          autoComplete="name"
          value={name}
          error={errors.name}
          onChange={(event) => setName(event.target.value)} />
        
          <TextInput
          label="Phone number"
          required
          fullWidth
          inputMode="tel"
          autoComplete="tel"
          placeholder="+234 800 000 0000"
          hint="This is how counterparties find and verify you."
          value={phone}
          error={errors.phone}
          onChange={(event) => setPhone(event.target.value)} />
        
          <TextInput
          label="Email (optional)"
          fullWidth
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)} />
        
          <Checkbox
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          error={errors.consent}
          label="I accept the terms and privacy policy"
          description="Including consent for identity verification and data retention." />
        
          <Button fullWidth loading={sending} onClick={submitDetails}>
            Continue
          </Button>
        </div> :

      <div className="space-y-4">
          <TextInput
          label="6-digit code"
          required
          fullWidth
          inputMode="numeric"
          placeholder="000000"
          className={mono}
          value={code}
          error={errors.code}
          onChange={(event) => {
            setCode(event.target.value);
            setErrors({});
          }} />
        
          <Button fullWidth onClick={verify}>
            Verify number
          </Button>
          <button
          type="button"
          onClick={() => setStage('details')}
          className={`inline-flex items-center gap-1 text-xs font-medium ${textPrimary}`}>
          
            <ArrowLeftIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Edit details
          </button>
          <p
          className={`flex items-start gap-2 rounded-lg border border-border p-3 text-[11px] leading-normal ${textSecondary}`}>
          
            <ShieldCheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Phone verification is the first trust tier. Identity verification with BVN or
            NIN comes next and is required before an agreement can go active.
          </p>
        </div>
      }
    </AuthShell>);

}