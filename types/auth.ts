/** User information returned by authentication endpoints. */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
  role: string;
}

/** Payload returned after a successful login or registration. */
export interface AuthResponse {
  token: string;
  user: AuthUser;
}

/** Response containing the current user, or `null` for an anonymous session. */
export interface MeResponse {
  user: AuthUser | null;
}

/** Result of requesting a password reset. */
export interface PasswordResetRequestResponse {
  ok: boolean;
  message: string;
  token?: string;
}

/** Error payload returned by the API. */
export interface ApiError {
  message: string;
}