import { apiFetch } from '../client';

export interface RegisterUserRequest {
  phone: string;
  name: string;
  email?: string;
  businessName?: string;
  area?: string;
  identityType?: string;
  identityNumber?: string;
  userType?: string;
  dateOfBirth?: string;
}

export interface RegisterUserResponse {
  message: string;
  id: string;
}

export function registerUser(payload: RegisterUserRequest, token: string): Promise<RegisterUserResponse> {
  return apiFetch<RegisterUserResponse>('/api/v1/users', {
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
