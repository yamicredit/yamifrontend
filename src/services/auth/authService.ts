import { CognitoUser, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { userPool } from './cognito';

export function toE164(rawPhone: string): string {
  const digits = rawPhone.replace(/[^\d+]/g, '');
  return digits.startsWith('+') ? digits : `+${digits}`;
}

// Sign-in is passwordless (CUSTOM_AUTH via phone + SMS code), but Cognito's SignUp API still
// requires a password. It's generated and discarded — it only needs to satisfy the pool's
// password policy and is never used to authenticate.
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

export function signUpWithPhone({ name, phone, email }: SignUpDetails): Promise<void> {
  const phoneNumber = toE164(phone);
  const attributes = [
  new CognitoUserAttribute({ Name: 'name', Value: name }),
  new CognitoUserAttribute({ Name: 'phone_number', Value: phoneNumber })];

  if (email) {
    attributes.push(new CognitoUserAttribute({ Name: 'email', Value: email }));
  }

  return new Promise((resolve, reject) => {
    userPool.signUp(
      phoneNumber,
      generateDiscardablePassword(),
      attributes,
      [],
      (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
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
