import { RoleInterface } from './role.interface';
export interface RoleGroupInterface {
  id: string;
  name: string;
  description: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  roles: RoleInterface[];
}
