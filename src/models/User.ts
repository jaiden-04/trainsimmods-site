export interface User {
  id: number;
  username: string;
  email: string;
  passwordHash: string | null;
  steamId: string | null;
  displayName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  username: string;
  email: string;
  passwordHash?: string;
  steamId?: string;
  displayName?: string;
}