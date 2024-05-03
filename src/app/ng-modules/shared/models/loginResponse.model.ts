import { User } from 'src/app/models/user';

export interface LoginResponse {
  accessToken: string;
  currentUser: User;
}
