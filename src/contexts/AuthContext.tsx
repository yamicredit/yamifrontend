import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type AuthStatus = 'signed_out' | 'onboarding' | 'signed_in';

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
  startSignUp: (phone: string) => void;
  signIn: () => void;
  completeOnboarding: (profile: OnboardingProfile) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [status, setStatus] = useState<AuthStatus>('signed_out');
  const [phone, setPhone] = useState('');
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);

  const startSignUp = useCallback((value: string) => {
    setPhone(value);
    setStatus('onboarding');
  }, []);

  const signIn = useCallback(() => setStatus('signed_in'), []);

  const completeOnboarding = useCallback((next: OnboardingProfile) => {
    setProfile(next);
    setStatus('signed_in');
  }, []);

  const signOut = useCallback(() => {
    setStatus('signed_out');
    setProfile(null);
    setPhone('');
  }, []);

  const value = useMemo(
    () => ({ status, phone, profile, startSignUp, signIn, completeOnboarding, signOut }),
    [status, phone, profile, startSignUp, signIn, completeOnboarding, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}