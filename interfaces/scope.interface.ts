import { RoleScopeInterface } from './roleScope.interface';
export enum ScopeType {
  PAGE = 'PAGE',
  FEATURE = 'FEATURE',
  ACTION = 'ACTION',
  WIDGET = 'WIDGET',
}

export interface ScopeInterface {
  id: string;
  type: ScopeType;
  name: string;
  description: string;
  parentID: string | null;
  isDeleted: boolean;
  roleScopes: RoleScopeInterface[];
  parent: ScopeInterface | null;
  Scope: ScopeInterface[];
}
