import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { YamiProvider } from './contexts/YamiContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { Landing } from './pages/Landing';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { Agreements } from './pages/Agreements';
import { AgreementDetail } from './pages/AgreementDetail';
import { NewAgreement } from './pages/NewAgreement';
import { Resolution } from './pages/Resolution';
import { Reputation } from './pages/Reputation';
import { Verification } from './pages/Verification';
import { Notifications } from './pages/Notifications';
import { Profile } from './pages/Profile';

function RequireAuth({ children }: {children: React.ReactNode;}) {
  const { status } = useAuth();
  if (status === 'onboarding') return <Navigate to="/onboarding" replace />;
  if (status !== 'signed_in') return <Navigate to="/signin" replace />;
  return <>{children}</>;
}

function PublicOnly({ children }: {children: React.ReactNode;}) {
  const { status } = useAuth();
  if (status === 'signed_in') return <Navigate to="/home" replace />;
  return <>{children}</>;
}

export function App() {
  return (
    <YamiProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
              <PublicOnly>
                  <Landing />
                </PublicOnly>
              } />
            
            <Route
              path="/signin"
              element={
              <PublicOnly>
                  <SignIn />
                </PublicOnly>
              } />
            
            <Route
              path="/signup"
              element={
              <PublicOnly>
                  <SignUp />
                </PublicOnly>
              } />
            
            <Route path="/onboarding" element={<Onboarding />} />

            <Route
              element={
              <RequireAuth>
                  <AppLayout />
                </RequireAuth>
              }>
              
              <Route path="/home" element={<Home />} />
              <Route path="/agreements" element={<Agreements />} />
              <Route path="/agreements/new" element={<NewAgreement />} />
              <Route path="/agreements/:agreementId" element={<AgreementDetail />} />
              <Route path="/resolution" element={<Resolution />} />
              <Route path="/reputation" element={<Reputation />} />
              <Route path="/verification" element={<Verification />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </YamiProvider>);

}