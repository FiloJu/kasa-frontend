export interface AuthUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface MeResponse {
  user: AuthUser | null;
}

export interface PasswordResetRequestResponse {
  ok: boolean;
  message: string;
  token?: string;
}

export interface ApiError {
  message: string;
}