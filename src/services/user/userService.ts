import { apiFetch } from '../client';

export interface SeedUserRequest {
  phone: string;
  name: string;
  email?: string;
}

// Called right after Cognito phone verification and the automatic sign-in that follows it, so the
// user row exists in our own DB (Cognito is the identity source of truth; this mirrors it here).
export function seedUser(payload: SeedUserRequest, token: string): Promise<unknown> {
  return apiFetch<unknown>('/api/v1/users', {
    method: 'POST',
    body: payload,
    token
  });
}

export interface UserProfile {
  id: string;
  [key: string]: unknown;
}

export function getUser(id: string, token: string): Promise<UserProfile> {
  return apiFetch<UserProfile>(`/api/v1/users/${id}`, { token });
}
