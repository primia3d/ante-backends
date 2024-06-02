import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { TableBodyDTO, TableQueryDTO } from 'lib/table.dto/table.dto';
import { PrismaService } from 'lib/prisma.service';
import { TableHandlerService } from 'lib/table.handler/table.handler.service';
import { UtilityService } from 'lib/utility.service';
import { AuthService } from 'src/auth/auth.service';
import { EncryptionService } from 'lib/encryption.service';
import { AccountCreateDTO, AccountUpdateDTO } from 'dto/account.validator.dto';

@Injectable()
export class AccountService {
  @Inject() public utility: UtilityService;
  @Inject() public authService: AuthService;
  @Inject() public prisma: PrismaService;
  @Inject() public tableHandler: TableHandlerService;
  @Inject() private crypt: EncryptionService;

  async accountTable(query: TableQueryDTO, body: TableBodyDTO) {
    this.tableHandler.initialize(query, body, 'account');
    const tableQuery = this.tableHandler.constructTableQuery();
    tableQuery['relationLoadStrategy'] = 'join';
    tableQuery['include'] = { role: { include: true } };
    const {
      list: baseList,
      currentPage,
      pagination,
    } = await this.tableHandler.getTableData(
      this.prisma.account,
      query,
      tableQuery,
    );
    const list = await this.utility.mapFormatData(baseList, 'account');
    return { list, pagination, currentPage };
  }
  async getAccountInformation({ id }) {
    const accountInformation = await this.prisma.account.findFirst({
      where: { id },
      include: {
        role: { include: { roleScopes: { include: { scope: true } } } },
      },
    });
    return this.utility.formatData(accountInformation, 'account');
  }
  async createAccount(accountData: AccountCreateDTO) {
    const developerKey = process.env.DEVELOPER_KEY;
    const assignedRole = await this.prisma.role.findFirst({
      where: { id: accountData.roleID },
    });
    if (!assignedRole) throw new NotFoundException(`Invalid Role ID`);

    return await this.authService.createAccount({
      firstName: accountData.firstName,
      lastName: accountData.lastName,
      contactNumber: accountData.contactNumber,
      email: accountData.email,
      username: accountData.username,
      password: accountData.password,
      developerKey,
      assignedRole,
      parentAccountId: accountData.parentAccountId,
    });
  }
  async updateAccount(accountData: AccountUpdateDTO) {
    const assignedRole = await this.prisma.role.findFirst({
      where: { id: accountData.roleID },
    });
    if (!assignedRole) throw new NotFoundException(`Invalid Role ID`);

    const passwordEncryption = await this.crypt.encrypt(accountData.password);
    accountData.password = passwordEncryption.encrypted;
    const key = passwordEncryption.iv;
    const updateAccountData = {
      firstName: accountData.firstName,
      lastName: accountData.lastName,
      contactNumber: accountData.contactNumber,
      email: accountData.email,
      username: accountData.username,
      password: accountData.password,
      key,
      ...(accountData.parentAccountId
        ? { parentAccountId: accountData.parentAccountId }
        : {}),
    };

    const updateResponse = await this.prisma.account.update({
      where: { id: accountData.id },
      data: updateAccountData,
    });

    const formattedResponse = this.utility.formatData(
      updateResponse,
      'account',
    );
    return formattedResponse;
  }
  async deleteUser({ id }) {
    const updateResponse = await this.prisma.account.update({
      where: { id },
      data: { isDeleted: true },
    });

    return this.utility.formatData(updateResponse, 'account');
  }
  async searchCollaborators(
    query: TableQueryDTO,
    body: TableBodyDTO,
    currentUserId: string,
  ) {
    this.tableHandler.initialize(query, body, 'account');
    const tableQuery = this.tableHandler.constructTableQuery();

    if (query.search) {
      tableQuery['where'] = {
        isDeleted: false,
        OR: [
          { firstName: { contains: query.search, mode: 'insensitive' } },
          { lastName: { contains: query.search, mode: 'insensitive' } },
        ],
      };
    }

    tableQuery['orderBy'] = [{ firstName: 'asc' }, { lastName: 'asc' }];

    tableQuery['include'] = { role: true };

    const { list, currentPage, pagination } =
      await this.tableHandler.getTableData(
        this.prisma.account,
        query,
        tableQuery,
      );

    const results = list.map((item) => ({
      id: item.id,
      fullName:
        item.id === currentUserId
          ? `${item.firstName} ${item.lastName} (Me)`
          : `${item.firstName} ${item.lastName}`,
      roleName: item.role.name,
    }));

    return { list: results, pagination, currentPage };
  }
  async searchAssignees(
    query: TableQueryDTO,
    body: TableBodyDTO,
    currentUserId: string,
  ) {
    this.tableHandler.initialize(query, body, 'account');
    const tableQuery = this.tableHandler.constructTableQuery();

    if (query.search) {
      tableQuery['where'] = {
        isDeleted: false,
        OR: [
          { firstName: { contains: query.search, mode: 'insensitive' } },
          { lastName: { contains: query.search, mode: 'insensitive' } },
        ],
      };
    }

    tableQuery['orderBy'] = [{ firstName: 'asc' }, { lastName: 'asc' }];

    const accounts = await this.prisma.account.findMany({
      where: {
        isDeleted: false,
        ...tableQuery.where,
      },
      include: {
        role: true,
      },
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
    });

    const results = accounts.map((account) => ({
      id: account.id,
      fullName:
        account.id === currentUserId
          ? `${account.firstName} ${account.lastName} (Me)`
          : `${account.firstName} ${account.lastName}`,
      role: account.role.name,
    }));

    const groupedResults = results.reduce((acc, account) => {
      if (!acc[account.role]) {
        acc[account.role] = [];
      }
      acc[account.role].push({
        id: account.id,
        fullName: account.fullName,
      });
      return acc;
    }, {});

    const categorizedResults = Object.keys(groupedResults).map((role) => ({
      role,
      users: groupedResults[role],
    }));

    return {
      list: categorizedResults,
      pagination: {
        currentPage: 1,
        perPage: accounts.length,
        total: accounts.length,
      },
    };
  }
}
