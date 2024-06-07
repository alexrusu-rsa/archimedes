import { User } from './user';

export interface LoginResponse {
  accessToken: string;
  currentUser: User;
}
