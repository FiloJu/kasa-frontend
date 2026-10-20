export interface User {
  id: string;
  email: string;
  token?: string;
}

export interface UserPublic {
  id: string;
  name: string;
  picture?: string;
  role: string;
}