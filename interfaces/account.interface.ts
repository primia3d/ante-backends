import { RoleInterface } from './role.interface';
import { AccountTokenInterface } from './accountToken.interface';

export interface AccountInterface {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  userName: string;
  password: string;
  key: Buffer;
  createdAt: Date;
  updatedAt: Date;
  roleId: string;
  role: RoleInterface;
  accountToken: AccountTokenInterface[];
}
