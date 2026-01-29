/**
 * User profile shape returned by the backend (/auth/me).
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

/**
 * Minimal Google profile fields extracted from the ID token.
 */
export interface GoogleUser {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}
