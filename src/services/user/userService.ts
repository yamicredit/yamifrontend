import { apiFetch } from '../client';

export interface SeedUserRequest {
  phone: string;
  name: string;
  email?: string;
}

// Called right after Cognito phone verification, so the user row exists in our own DB before
// the first real sign-in (Cognito is the identity source of truth; this just mirrors it here).
export function seedUser(payload: SeedUserRequest): Promise<unknown> {
  return apiFetch<unknown>('/api/v1/users', {
    method: 'POST',
    body: payload
  });
}

export interface UserProfile {
  id: string;
  [key: string]: unknown;
}

export function getUser(id: string, token: string): Promise<UserProfile> {
  return apiFetch<UserProfile>(`/api/v1/users/${id}`, { token });
}
