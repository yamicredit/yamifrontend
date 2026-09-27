import { toE164 } from './authService';

const region = import.meta.env.VITE_AWS_REGION as string | undefined;
const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID as string | undefined;

if (!region || !clientId) {
  // eslint-disable-next-line no-console
  console.warn(
    'Cognito custom auth is not configured: set VITE_AWS_REGION and VITE_COGNITO_CLIENT_ID in .env'
  );
}

const COGNITO_IDP_URL = `https://cognito-idp.${region ?? ''}.amazonaws.com/`;

async function cognitoIdpRequest<T>(action: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(COGNITO_IDP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': `AWSCognitoIdentityProviderService.${action}`
    },
    body: JSON.stringify(body)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = typeof data?.message === 'string' ? data.message : 'Could not reach the verification service.';
    throw new Error(message);
  }

  return data as T;
}

export interface CustomAuthChallenge {
  ChallengeName: string;
  Session: string;
  ChallengeParameters: Record<string, string>;
}

// Step 1 of phone sign-in: triggers the CUSTOM_CHALLENGE Lambda, which sends the OTP by SMS.
export function initiatePhoneSignIn(phone: string): Promise<CustomAuthChallenge> {
  return cognitoIdpRequest<CustomAuthChallenge>('InitiateAuth', {
    AuthFlow: 'CUSTOM_AUTH',
    ClientId: clientId,
    AuthParameters: { USERNAME: toE164(phone) }
  });
}

export interface CognitoAuthenticationResult {
  IdToken: string;
  AccessToken: string;
  RefreshToken?: string;
  ExpiresIn: number;
  TokenType: string;
}

export interface InitiateAuthResult {
  ChallengeName?: string;
  Session?: string;
  AuthenticationResult?: CognitoAuthenticationResult;
}

// Used once, right after signup phone verification, with the temporary password generated at
// signup. Requires ALLOW_USER_PASSWORD_AUTH on the app client.
export async function signInWithPassword(
  phone: string,
  password: string
): Promise<CognitoAuthenticationResult> {
  const result = await cognitoIdpRequest<InitiateAuthResult>('InitiateAuth', {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: clientId,
    AuthParameters: { USERNAME: toE164(phone), PASSWORD: password }
  });

  if (!result.AuthenticationResult?.IdToken) {
    throw new Error('Could not sign you in automatically. Please sign in to continue.');
  }
  return result.AuthenticationResult;
}

export interface RespondToAuthChallengeResult {
  ChallengeName?: string;
  Session?: string;
  ChallengeParameters?: Record<string, string>;
  AuthenticationResult?: CognitoAuthenticationResult;
}

// Step 2: answers the challenge with the SMS code. A wrong code comes back as a fresh
// CUSTOM_CHALLENGE (new Session, no AuthenticationResult) rather than an HTTP error, since the
// Lambda controls retry behaviour — the caller must resubmit with the returned Session.
export function respondToPhoneSignInChallenge(
  phone: string,
  code: string,
  session: string
): Promise<RespondToAuthChallengeResult> {
  return cognitoIdpRequest<RespondToAuthChallengeResult>('RespondToAuthChallenge', {
    ClientId: clientId,
    ChallengeName: 'CUSTOM_CHALLENGE',
    ChallengeResponses: {
      ANSWER: code,
      USERNAME: toE164(phone)
    },
    Session: session
  });
}
