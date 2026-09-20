import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { authenticate, confirmSignUp, getIdToken, resendSignUpCode, signUpWithPhone, type SignUpDetails } from '../services/auth/authService';
import { registerUser } from '../services/user/userService';

export type AuthStatus = 'signed_out' | 'pending_verification' | 'onboarding' | 'signed_in';

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
  signUp: (details: SignUpDetails) => Promise<void>;
  confirmSignUpCode: (code: string) => Promise<void>;
  resendCode: () => Promise<void>;
  signIn: () => void;
  completeOnboarding: (profile: OnboardingProfile) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [status, setStatus] = useState<AuthStatus>('signed_out');
  const [phone, setPhone] = useState('');
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);

  // Held only in memory for the signup session: the name/email collected at
  // signup and the throwaway password minted for the Cognito SignUp call.
  // They're needed once completeOnboarding runs, to authenticate and register
  // the user with the backend — never persisted, never exposed via context.
  const pendingSignUp = useRef<{ name: string; email?: string; tempPassword: string } | null>(null);

  const signUp = useCallback(async (details: SignUpDetails) => {
    const { tempPassword } = await signUpWithPhone(details);
    pendingSignUp.current = { name: details.name, email: details.email, tempPassword };
    setPhone(details.phone);
    setStatus('pending_verification');
  }, []);

  const confirmSignUpCode = useCallback(
    async (code: string) => {
      await confirmSignUp(phone, code);
      setStatus('onboarding');
    },
    [phone]
  );

  const resendCode = useCallback(() => resendSignUpCode(phone), [phone]);

  const signIn = useCallback(() => setStatus('signed_in'), []);

  const completeOnboarding = useCallback(
    async (next: OnboardingProfile) => {
      const pending = pendingSignUp.current;
      if (pending) {
        const session = await authenticate(phone, pending.tempPassword);
        const idToken = getIdToken(session);
        await registerUser(
          {
            phone,
            name: pending.name,
            email: pending.email,
            businessName: next.businessName,
            area: next.location,
            userType: next.accountType
          },
          idToken
        );
        pendingSignUp.current = null;
      }
      setProfile(next);
      setStatus('signed_in');
    },
    [phone]
  );

  const signOut = useCallback(() => {
    pendingSignUp.current = null;
    setStatus('signed_out');
    setProfile(null);
    setPhone('');
  }, []);

  const value = useMemo(
    () => ({
      status,
      phone,
      profile,
      signUp,
      confirmSignUpCode,
      resendCode,
      signIn,
      completeOnboarding,
      signOut
    }),
    [status, phone, profile, signUp, confirmSignUpCode, resendCode, signIn, completeOnboarding, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
