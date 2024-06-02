import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from 'lib/prisma.service';
import { TableHandlerService } from 'lib/table.handler/table.handler.service';
import { UtilityService } from 'lib/utility.service';
import { CommonIdDTO } from 'dto/common.id.dto';
import { RoleService } from '@/role/role.service';
import { RoleInterface } from 'interfaces';
import { RoleGroupService } from '@/role-group/role-group.service';
@Injectable()
export class UserOrgService {
  @Inject() public utility: UtilityService;
  @Inject() public prisma: PrismaService;
  @Inject() public tableHandler: TableHandlerService;
  @Inject() public roleService: RoleService;
  @Inject() public roleGroupService: RoleGroupService;

  async getUserTree() {
    const headTree = {
      id: 'static-head',
      name: 'Ante',
      description: 'This is a static company account.',
      child: await this.#getUserChild(),
    };
    const treeList = [];
    treeList.push(headTree);
    return treeList;
  }

  async #getUserChild(parentRoleId = null) {
    const roleChildList = await this.prisma.role.findMany({
      where: { parentRoleId, isDeveloper: false },
      include: {
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
          },
        },
      },
    });

    const treeList = [];

    for (const parent of roleChildList) {
      const data = this.utility.formatData(parent, 'role');
      data['users'] = parent.users ?? [];
      data['child'] = await this.#getUserChild(parent.id);
      treeList.push(data);
    }

    return treeList;
  }

  async findParentUserDropdownList(roleData: CommonIdDTO): Promise<any> {
    const roleInformation = (await this.roleService.getRole(
      roleData,
    )) as RoleInterface;
    const userLists = await this.getUsersAboveLevel(roleInformation);
    return userLists;
  }

  private async getUsersAboveLevel(
    roleInformation: RoleInterface,
  ): Promise<any> {
    const { roleGroupId, level } = roleInformation;
    const roleWithUser = await this.prisma.role.findMany({
      where: {
        roleGroupId,
        isDeveloper: false,
        level: { lt: level },
      },
      include: {
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
          },
        },
      },
    });
    return roleWithUser.flatMap((role) => role.users);
  }
}
