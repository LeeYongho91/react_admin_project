import { Request } from 'express';
import { UserInput } from '@/interfaces/user/users.interface';

export interface DataStoredInToken {
  seq: number;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: UserInput;
}
