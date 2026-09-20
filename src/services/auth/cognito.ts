import { CognitoUserPool } from 'amazon-cognito-identity-js';

const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID as string | undefined;
const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID as string | undefined;

if (!userPoolId || !clientId) {
  // eslint-disable-next-line no-console
  console.warn(
    'Cognito is not configured: set VITE_COGNITO_USER_POOL_ID and VITE_COGNITO_CLIENT_ID in .env'
  );
}

export const userPool = new CognitoUserPool({
  UserPoolId: userPoolId ?? '',
  ClientId: clientId ?? ''
});
