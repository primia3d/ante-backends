import { SetMetadata } from '@nestjs/common';

export const RequiredRoleScope = (roleScope: string) => {
  return SetMetadata('role-scope', roleScope);
};
