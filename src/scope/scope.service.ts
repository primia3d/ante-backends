import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from 'lib/prisma.service';
import { UtilityService } from 'lib/utility.service';
import scopeReference from 'reference/scope.reference';
import { TableBodyDTO, TableQueryDTO } from 'lib/table.dto/table.dto';
import { TableHandlerService } from 'lib/table.handler/table.handler.service';
import { ScopeInterface } from 'interfaces';

@Injectable()
export class ScopeService {
  @Inject() public utility: UtilityService;
  @Inject() public prisma: PrismaService;
  @Inject() public tableHandler: TableHandlerService;

  async syncScope() {
    const scopeUpdate = scopeReference.map((scope) => {
      return this.#addUpdateScope(scope);
    });

    return await Promise.all(scopeUpdate);
  }
  async #addUpdateScope(scope) {
    const checkExistScope = await this.prisma.scope.findFirst({
      where: { id: scope.id },
    });

    if (scope.parentID) {
      const parentScopeExists = await this.prisma.scope.findFirst({
        where: { id: scope.parentID },
      });

      if (!parentScopeExists) {
        throw new Error(
          `Parent scope with ID ${scope.parentID} does not exist.`,
        );
      }
    }

    let response: ScopeInterface | undefined;

    if (!checkExistScope) {
      await this.prisma.scope.create({ data: scope });
      response = (await this.prisma.scope.findUnique({
        where: { id: scope.id },
        include: {
          roleScopes: true,
          parent: true,
          Scope: true,
        },
      })) as ScopeInterface;
    } else {
      await this.prisma.scope.update({
        where: { id: scope.id },
        data: scope,
      });
      response = (await this.prisma.scope.findUnique({
        where: { id: scope.id },
        include: {
          roleScopes: true,
          parent: true,
          Scope: true,
        },
      })) as ScopeInterface;
    }

    return response;
  }
  async getList({ roleGroupId = null }: { roleGroupId?: string }) {
    const rolesUnderRoleGroup = await this.prisma.roleGroup.findMany({
      where: { id: roleGroupId },
      include: {
        roles: {
          include: {
            roleScopes: {
              include: {
                scope: true,
              },
            },
          },
        },
      },
    });

    if (rolesUnderRoleGroup.length === 0) {
      throw new Error('No roles found under the specified role group');
    }

    const lowestLevelRole = this.findLowestLevelRole(rolesUnderRoleGroup);
    const scopeList = this.mapRoleScopesToScope(lowestLevelRole.roleScopes);

    return scopeList;
  }

  private findLowestLevelRole(roleGroups: any[]): any {
    return roleGroups
      .flatMap((roleGroup) => roleGroup.roles)
      .reduce(
        (lowest, role) => (lowest.level < role.level ? lowest : role),
        roleGroups.flatMap((roleGroup) => roleGroup.roles)[0],
      );
  }

  private mapRoleScopesToScope(roleScopes: any[]): any[] {
    return roleScopes.map((roleScope) => roleScope.scope);
  }

  async getScopeTree({ roleID = null }) {
    let roleScopeList = [];
    if (roleID) roleScopeList = await this.getScopeArrayIDBasedOnRole(roleID);
    const scopeList = await this.#loadScope(null, roleScopeList);
    return scopeList;
  }
  async getScopeArrayIDBasedOnRole(roleID: string) {
    const scopeList = await this.prisma.roleScope.findMany({
      where: { roleID },
    });
    const roleAcces = scopeList.map((scope) => {
      return scope.scopeID;
    });
    return roleAcces;
  }
  async #loadScope(parentID: string = null, roleScopeList) {
    const where = { isDeleted: false, parentID: parentID };
    if (roleScopeList.length > 0) {
      where['id'] = { in: roleScopeList };
    }
    const scopeList = await this.prisma.scope.findMany({ where });

    for (const scopeData of scopeList) {
      delete scopeData['isDeleted'];
      scopeData['child'] = await this.#loadScope(scopeData.id, roleScopeList);
    }

    return scopeList;
  }
  async getScopeList(query: TableQueryDTO, body: TableBodyDTO) {
    this.tableHandler.initialize(query, body, 'scope');
    const tableQuery = this.tableHandler.constructTableQuery();

    const { list, currentPage, pagination } =
      await this.tableHandler.getTableData(
        this.prisma.scope,
        query,
        tableQuery,
      );

    return {
      list: await this.utility.mapFormatData(list, 'scope'),
      pagination,
      currentPage,
    };
  }
}
