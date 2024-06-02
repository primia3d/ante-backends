import { RoleInterface } from './role.interface';
import { ScopeInterface } from './scope.interface';

export interface RoleScopeInterface {
  roleID: string;
  scopeID: string;
  role: RoleInterface;
  scope: ScopeInterface;
}
