/** Signed-in user data used by the client application. */
export interface User {
  id: string;
  email: string;
  token?: string;
}

/** Public profile information that can be shared with other users. */
export interface UserPublic {
  id: string;
  name: string;
  picture?: string;
  role: string;
}