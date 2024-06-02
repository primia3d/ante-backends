import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TableBodyDTO, TableQueryDTO } from 'lib/table.dto/table.dto';
import { PrismaService } from 'lib/prisma.service';
import { TableHandlerService } from 'lib/table.handler/table.handler.service';
import { UtilityService } from 'lib/utility.service';
import { RoleCreateDTO } from 'dto/role.validator.dto';

@Injectable()
export class RoleService {
  @Inject() public utility: UtilityService;
  @Inject() public prisma: PrismaService;
  @Inject() public tableHandler: TableHandlerService;

  async getRole({ id }) {
    const roleInformation = await this.prisma.role.findFirst({
      where: { id },
      include: { roleScopes: { include: { scope: true } }, roleGroup: true },
    });
    if (!roleInformation) throw new NotFoundException('Role not found');

    return this.utility.formatData(roleInformation, 'role');
  }
  async getTree() {
    const headTree = {
      id: 'static-head',
      name: 'Ante',
      description: 'This is a static company account.',
      child: await this.#getRoleChild(),
    };
    const treeList = [];
    treeList.push(headTree);
    return treeList;
  }
  async #getRoleChild(parentRoleId = null) {
    const roleChildList = await this.prisma.role.findMany({
      where: { parentRoleId, isDeveloper: false },
    });

    const treeList = [];

    for (const parent of roleChildList) {
      const data = this.utility.formatData(parent, 'role');
      data['child'] = await this.#getRoleChild(parent.id);
      treeList.push(data);
    }

    return treeList;
  }
  async getRoleByGroup({ roleGroupId }) {
    const roleLevel = this.utility.accountInformation.role.level;
    const roleList = await this.prisma.role.findMany({
      where: { roleGroupId, isDeveloper: false, level: { gt: roleLevel } },
      orderBy: { level: 'asc' },
    });

    return roleList;
  }

  async seedInitialRole() {
    const createRoleData: Prisma.RoleCreateInput = {
      name: 'Developer',
      description: 'This role can access all.',
      isDeveloper: true,
    };
    const initialRole = await this.prisma.role.create({ data: createRoleData });
    return initialRole;
  }
  async roleTable(query: TableQueryDTO, body: TableBodyDTO) {
    this.tableHandler.initialize(query, body, 'role');
    const tableQuery = this.tableHandler.constructTableQuery();
    tableQuery['relationLoadStrategy'] = 'join';
    tableQuery['include'] = { roleScopes: { include: { scope: true } } };

    const {
      list: baseList,
      currentPage,
      pagination,
    } = await this.tableHandler.getTableData(
      this.prisma.role,
      query,
      tableQuery,
    );

    const list = await this.utility.mapFormatData(baseList, 'role');

    return { list, pagination, currentPage };
  }
  async addRole(params: RoleCreateDTO) {
    let parentRoleLevel = 0;
    if (params.parentRoleId) {
      const parentRole = await this.prisma.role.findUnique({
        where: { id: params.parentRoleId },
        select: { level: true },
      });

      if (!parentRole) throw new Error('Parent not found');

      parentRoleLevel = parentRole.level;
    }

    const childRoleLevel = parentRoleLevel + 1;

    const roleGroup = await this.prisma.roleGroup.findUnique({
      where: { id: params.roleGroupId },
    });

    if (!roleGroup) throw new Error('Role group not found');

    const createRoleData: Prisma.RoleCreateInput = {
      name: params.name,
      description: params.description,
      level: childRoleLevel,
      parentRole: params.parentRoleId
        ? {
            connect: {
              id: params.parentRoleId,
            },
          }
        : undefined,
      roleGroup: {
        connect: {
          id: params.roleGroupId,
        },
      },
    };

    const createResponse = await this.prisma.role.create({
      data: createRoleData,
    });
    const roleScopeUpdate = params.scopeIDs.map((scopeID) => {
      return this.#roleScopePatch(createResponse.id, scopeID);
    });

    await Promise.all(roleScopeUpdate);

    return this.utility.formatData(createResponse, 'role');
  }

  async #roleScopePatch(roleID, scopeID) {
    const checkRoleExist = await this.prisma.role.findFirst({
      where: { id: roleID },
    });
    if (checkRoleExist)
      await this.prisma.roleScope.create({ data: { roleID, scopeID } });
  }

  async updateRole({ id, name, description }) {
    const updateRoleData: Prisma.RoleUpdateInput = { id, name, description };
    const updateResponse = await this.prisma.role.update({
      where: { id },
      data: updateRoleData,
    });

    return this.utility.formatData(updateResponse, 'role');
  }
  async deleteRole({ id }) {
    const updateResponse = await this.prisma.role.update({
      where: { id },
      data: { isDeleted: true },
    });

    return this.utility.formatData(updateResponse, 'role');
  }

  async calculateRoleLevel(parentRoleId?: string): Promise<number> {
    let newRoleLevel = 0;
    if (parentRoleId) {
      const parentRole = await this.prisma.role.findUnique({
        where: { id: parentRoleId },
        select: { level: true },
      });

      if (!parentRole) throw new Error('Parent role not found');
      newRoleLevel = parentRole.level + 1;
    }

    return newRoleLevel;
  }

  async hasLevelOneRole(roleGroupId: string, level = 1): Promise<boolean> {
    const role = await this.prisma.role.findMany({
      where: { roleGroupId: roleGroupId, level: level },
    });
    if (!role) return false;

    return role.length >= 1;
  }

  async hasOneUserPerRoleHead(roleId: string): Promise<boolean> {
    try {
      return (
        (
          await this.prisma.role.findUnique({
            where: { id: roleId, level: 1 },
            include: {
              users: true,
            },
          })
        )?.users.length >= 1
      );
    } catch (error) {
      return false;
    }
  }
}
