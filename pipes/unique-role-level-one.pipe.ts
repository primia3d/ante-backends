import {
  PipeTransform,
  Injectable,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { RoleService } from '@/role/role.service';
import { RoleCreateDTO } from 'dto/role.validator.dto';

@Injectable()
export class EnsureUniqueLevelOneRolePipe implements PipeTransform {
  constructor(@Inject(RoleService) private roleService: RoleService) {}

  async transform(value: RoleCreateDTO) {
    const { roleGroupId, parentRoleId } = value;
    if (!parentRoleId) {
      const existingRole = await this.roleService.hasLevelOneRole(
        roleGroupId,
        1,
      );
      if (existingRole) {
        throw new BadRequestException(
          'A role with level one already exists in this group',
        );
      }
    }

    return value;
  }
}
