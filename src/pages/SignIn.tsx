import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import { AuthShell } from '../components/auth/AuthShell';
import { Button } from '../components/Button';
import { TextInput } from '../components/TextInput';
import { Checkbox } from '../components/Checkbox';
import { useAuth } from '../contexts/AuthContext';
import { mono, textPrimary, textSecondary } from '../utils/ui';

export function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [stage, setStage] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('+234 803 441 2087');
  const [code, setCode] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [sending, setSending] = useState(false);

  const sendCode = () => {
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Enter the phone number registered with YAMI.');
      return;
    }
    setError(undefined);
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setStage('code');
    }, 700);
  };

  const verify = () => {
    if (code.replace(/\D/g, '').length !== 6) {
      setError('Enter the 6-digit code sent by SMS.');
      return;
    }
    setError(undefined);
    signIn();
    navigate('/home');
  };

  return (
    <AuthShell
      title={stage === 'phone' ? 'Welcome back' : 'Enter your code'}
      description={
      stage === 'phone' ?
      'Sign in with the phone number your agreements are tied to.' :
      `We sent a 6-digit code by SMS to ${phone}.`
      }
      footer={
      <p className={`text-center text-xs ${textSecondary}`}>
          New to YAMI?{' '}
          <Link to="/signup" className="font-medium text-accent">
            Create an account
          </Link>
        </p>
      }>
      
      {stage === 'phone' ?
      <div className="space-y-4">
          <TextInput
          label="Phone number"
          required
          fullWidth
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          error={error}
          onChange={(event) => {
            setPhone(event.target.value);
            setError(undefined);
          }} />
        
          <Checkbox
          checked={remember}
          onChange={(event) => setRemember(event.target.checked)}
          label="Keep me signed in on this device" />
        
          <Button fullWidth loading={sending} onClick={sendCode}>
            Send sign-in code
          </Button>
          <p className={`text-center text-[11px] leading-normal ${textSecondary}`}>
            YAMI never asks for your BVN, PIN or password over SMS or phone calls.
          </p>
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
          error={error}
          onChange={(event) => {
            setCode(event.target.value);
            setError(undefined);
          }} />
        
          <Button fullWidth onClick={verify}>
            Sign in
          </Button>
          <div className="flex items-center justify-between">
            <button
            type="button"
            onClick={() => setStage('phone')}
            className={`inline-flex items-center gap-1 text-xs font-medium ${textPrimary}`}>
            
              <ArrowLeftIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Change number
            </button>
            <button type="button" className="text-xs font-medium text-accent">
              Resend code
            </button>
          </div>
        </div>
      }
    </AuthShell>);

}