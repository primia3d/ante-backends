import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UtilityService } from 'lib/utility.service';
import { AuthService } from '@/auth/auth.service';

@Injectable()
export class HasRoleScopeGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private utilityService: UtilityService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const accountInformation = this.utilityService.formatData(
      this.utilityService.accountInformation,
      'account',
    );
    accountInformation['roleAccess'] =
      await this.authService.getRoleAccess(accountInformation);

    const requiredRoleScope = this.reflector.get<string | string[]>(
      'role-scope',
      context.getHandler(),
    );
    if (!requiredRoleScope || accountInformation['role'].isDeveloper)
      return true;

    const hasAccess =
      accountInformation['roleAccess'].includes(requiredRoleScope);

    if (!hasAccess) {
      throw new ForbiddenException(
        'The user does not have access to this functionality. Please check the permissions',
      );
    }
    return true;
  }
}
