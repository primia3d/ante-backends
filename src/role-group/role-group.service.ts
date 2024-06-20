import { Injectable, Inject } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'lib/prisma.service';
import { UtilityService } from 'lib/utility.service';
import { TableQueryDTO, TableBodyDTO } from 'lib/table.dto/table.dto';
import { TableHandlerService } from 'lib/table.handler/table.handler.service';
import { RoleGroup } from '@prisma/client';
@Injectable()
export class RoleGroupService {
  @Inject() public utilityService: UtilityService;
  @Inject() public prisma: PrismaService;
  @Inject() public tableHandlerService: TableHandlerService;

  async createRoleGroup({ name, description }) {
    const createRoleGroupData: Prisma.RoleGroupCreateInput = {
      name,
      description,
    };
    const createResponse = await this.prisma.roleGroup.create({
      data: createRoleGroupData,
    });

    return this.utilityService.formatData(createResponse, 'roleGroup');
  }

  async roleGroupTable(query: TableQueryDTO, body: TableBodyDTO) {
    this.tableHandlerService.initialize(query, body, 'roleGroup');
    const tableQuery = this.tableHandlerService.constructTableQuery();
    const {
      list: baseList,
      currentPage,
      pagination,
    } = await this.tableHandlerService.getTableData(
      this.prisma.roleGroup,
      query,
      tableQuery,
    );

    const list = await this.utilityService.mapFormatData(baseList, 'roleGroup');

    return { list, pagination, currentPage };
  }

  async getRoleGroupByID({ id }) {
    const roleGroupInformation = await this.prisma.roleGroup.findFirst({
      where: { id },
    });
    return this.utilityService.formatData(roleGroupInformation, 'roleGroup');
  }

  async updateRoleGroupInformation({ id, name, description }) {
    const updateRoleGroupData: Prisma.RoleGroupUpdateInput = {
      id,
      name,
      description,
    };

    const updateResponse = await this.prisma.roleGroup.update({
      where: { id },
      data: updateRoleGroupData,
    });

    return this.utilityService.formatData(updateResponse, 'roleGroup');
  }

  async deleteRoleGroup({ id }) {
    const updateResponse = await this.prisma.roleGroup.update({
      where: { id },
      data: { isDeleted: true },
    });

    return this.utilityService.formatData(updateResponse, 'roleGroup');
  }

  async getRoleGroupDropdownList() {
    const roleGroupInformation = await this.prisma.roleGroup.findMany({
      where: { isDeleted: false },
    });
    return this.utilityService.mapFormatData(roleGroupInformation, 'roleGroup');
  }

  async getRoleGroupDropdownListForSuperAdmin(): Promise<RoleGroup[]> {
    return await this.getRoleGroupDropdownList();
  }
  async getRoleGroupDropdownListForNonAdmin(): Promise<RoleGroup[]> {
    const currentUserInformation = this.utilityService.accountInformation;
    const { role } = currentUserInformation;
    return [role.roleGroup];
  }

  async getListOfRoles(id: string) {
    const roleGroupInformation = await this.prisma.roleGroup.findFirst({
      where: { id },
      include: { roles: true },
    });
    const { roles } = roleGroupInformation;

    return this.utilityService.mapFormatData(roles, 'role');
  }

  async searchRoleGroup(
    query: TableQueryDTO,
    body: TableBodyDTO,
    searchQuery?: string,
  ) {
    this.tableHandlerService.initialize(query, body, 'roleGroup');
    const tableQuery = this.tableHandlerService.constructTableQuery();
  
    if (searchQuery) {
      tableQuery['where'] = {
        name: { contains: searchQuery, mode: 'insensitive' },
      };
    }
  
    const {
      list: baseList,
      currentPage,
      pagination,
    } = await this.tableHandlerService.getTableData(
      this.prisma.roleGroup,
      query,
      tableQuery,
    );
  
    const list = await this.utilityService.mapFormatData(baseList, 'roleGroup');
  
    return { list, pagination, currentPage };
  }
  
}
