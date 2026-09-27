import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import {
  confirmSignUp,
  generateTemporaryPassword,
  resendSignUpCode,
  signUpWithPhone,
  type SignUpDetails } from
'../services/auth/authService';
import {
  initiatePhoneSignIn,
  respondToPhoneSignInChallenge,
  signInWithPassword } from
'../services/auth/cognitoAuth';
import { seedUser } from '../services/user/userService';
import { useYami } from './YamiContext';

export type AuthStatus = 'signed_out' | 'pending_verification' | 'awaiting_sign_in_code' | 'onboarding' | 'signed_in';

export type AccountType = 'individual' | 'retailer' | 'wholesaler';

export interface OnboardingProfile {
  accountType: AccountType;
  businessName?: string;
  location: string;
  usage: 'lend' | 'borrow' | 'both';
}

interface AuthContextValue {
  status: AuthStatus;
  phone: string;
  profile: OnboardingProfile | null;
  idToken: string | null;
  signUp: (details: Omit<SignUpDetails, 'password'>) => Promise<void>;
  confirmSignUpCode: (code: string) => Promise<void>;
  resendCode: () => Promise<void>;
  requestSignInCode: (phone: string) => Promise<void>;
  confirmSignInCode: (code: string) => Promise<void>;
  completeOnboarding: (profile: OnboardingProfile) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const { pushToast } = useYami();
  const [status, setStatus] = useState<AuthStatus>('signed_out');
  const [phone, setPhone] = useState('');
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);

  // Held only in memory for the signup session: the name/email collected at signup and the
  // temporary password, needed once phone verification succeeds to sign in and seed the user
  // record. Never persisted, never exposed via context.
  const pendingSignUp = useRef<{ name: string; email?: string; password: string } | null>(null);

  // The Cognito CUSTOM_AUTH session token, carried from InitiateAuth to RespondToAuthChallenge.
  const pendingSignIn = useRef<{ session: string } | null>(null);

  const signUp = useCallback(async (details: Omit<SignUpDetails, 'password'>) => {
    const password = generateTemporaryPassword();
    await signUpWithPhone({ ...details, password });
    pendingSignUp.current = { name: details.name, email: details.email, password };
    setPhone(details.phone);
    setStatus('pending_verification');
  }, []);

  const confirmSignUpCode = useCallback(
    async (code: string) => {
      const pending = pendingSignUp.current;
      if (!pending) throw new Error('Your signup session expired. Please sign up again.');

      await confirmSignUp(phone, code);

      // The token is only used to save the user record; the session is then dropped so the user
      // signs in normally (phone + SMS code) to continue.
      const tokens = await signInWithPassword(phone, pending.password);
      await seedUser({ phone, name: pending.name, email: pending.email }, tokens.IdToken);
      pendingSignUp.current = null;

      setIdToken(null);
      setStatus('signed_out');
      setPhone('');
      pushToast({
        title: 'Registration successful',
        description: 'Kindly login to continue.',
        variant: 'success'
      });
    },
    [phone, pushToast]
  );

  const resendCode = useCallback(() => resendSignUpCode(phone), [phone]);

  const requestSignInCode = useCallback(async (nextPhone: string) => {
    const challenge = await initiatePhoneSignIn(nextPhone);
    pendingSignIn.current = { session: challenge.Session };
    setPhone(nextPhone);
    setStatus('awaiting_sign_in_code');
  }, []);

  const confirmSignInCode = useCallback(
    async (code: string) => {
      const pending = pendingSignIn.current;
      if (!pending) throw new Error('Request a new code before verifying.');

      const result = await respondToPhoneSignInChallenge(phone, code, pending.session);

      if (result.AuthenticationResult?.IdToken) {
        pendingSignIn.current = null;
        setIdToken(result.AuthenticationResult.IdToken);
        setStatus('onboarding');
        return;
      }

      if (result.Session) {
        pendingSignIn.current = { session: result.Session };
      }
      throw new Error('That code did not work. Try again.');
    },
    [phone]
  );

  const completeOnboarding = useCallback(async (next: OnboardingProfile) => {
    setProfile(next);
    setStatus('signed_in');
  }, []);

  const signOut = useCallback(() => {
    pendingSignUp.current = null;
    pendingSignIn.current = null;
    setStatus('signed_out');
    setProfile(null);
    setPhone('');
    setIdToken(null);
  }, []);

  const value = useMemo(
    () => ({
      status,
      phone,
      profile,
      idToken,
      signUp,
      confirmSignUpCode,
      resendCode,
      requestSignInCode,
      confirmSignInCode,
      completeOnboarding,
      signOut
    }),
    [
    status,
    phone,
    profile,
    idToken,
    signUp,
    confirmSignUpCode,
    resendCode,
    requestSignInCode,
    confirmSignInCode,
    completeOnboarding,
    signOut]

  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
