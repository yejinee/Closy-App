import { request } from './client';

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserOut {
  id: string;
  email: string;
  created_at: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    request<TokenResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  signup: (email: string, password: string) =>
    request<UserOut>('/auth/signup', {
      method: 'POST',
      body: { email, password },
    }),
};
