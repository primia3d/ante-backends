import { AccountInterface } from './account.interface';

export interface AccountTokenInterface {
  sessionId: string;
  accountId: string;
  payload: string;
  userAgent: string;
  token: string;
  ipAddress: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  account?: AccountInterface;
}
