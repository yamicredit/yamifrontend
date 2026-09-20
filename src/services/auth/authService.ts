import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  type CognitoUserSession } from
'amazon-cognito-identity-js';
import { userPool } from './cognito';

export function toE164(rawPhone: string): string {
  const digits = rawPhone.replace(/[^\d+]/g, '');
  return digits.startsWith('+') ? digits : `+${digits}`;
}

// The User Pool here authenticates by phone + SMS code, not a password the user
// ever sees. Cognito's standard SignUp API still requires a password, so we
// generate one and discard it — it only needs to satisfy the pool's password
// policy. If a custom-auth (passwordless) Lambda flow is added later for sign-in,
// this generated password becomes irrelevant.
function generateDiscardablePassword(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  const base = Array.from(bytes, (b) => b.toString(36)).join('');
  return `Aa1!${base}`;
}

export interface SignUpDetails {
  name: string;
  phone: string;
  email?: string;
}

export interface SignUpResult {
  // Held in memory only for the lifetime of the signup flow, so the app can
  // authenticate once (right after phone confirmation) to get a bearer token
  // for the backend's RegisterUser call. Never persisted or logged.
  tempPassword: string;
}

export function signUpWithPhone({ name, phone, email }: SignUpDetails): Promise<SignUpResult> {
  const phoneNumber = toE164(phone);
  const tempPassword = generateDiscardablePassword();
  const attributes = [
  new CognitoUserAttribute({ Name: 'name', Value: name }),
  new CognitoUserAttribute({ Name: 'phone_number', Value: phoneNumber })];

  if (email) {
    attributes.push(new CognitoUserAttribute({ Name: 'email', Value: email }));
  }

  return new Promise((resolve, reject) => {
    userPool.signUp(
      phoneNumber,
      tempPassword,
      attributes,
      [],
      (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({ tempPassword });
      }
    );
  });
}

export function confirmSignUp(phone: string, code: string): Promise<void> {
  const cognitoUser = new CognitoUser({ Username: toE164(phone), Pool: userPool });
  return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(code, true, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

export function resendSignUpCode(phone: string): Promise<void> {
  const cognitoUser = new CognitoUser({ Username: toE164(phone), Pool: userPool });
  return new Promise((resolve, reject) => {
    cognitoUser.resendConfirmationCode((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

export function authenticate(phone: string, password: string): Promise<CognitoUserSession> {
  const cognitoUser = new CognitoUser({ Username: toE164(phone), Pool: userPool });
  const authDetails = new AuthenticationDetails({
    Username: toE164(phone),
    Password: password
  });

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (session) => resolve(session),
      onFailure: (err) => reject(err)
    });
  });
}

export function getIdToken(session: CognitoUserSession): string {
  return session.getIdToken().getJwtToken();
}
