import { Injectable, Inject, NotFoundException, Headers } from '@nestjs/common';
import { PrismaService } from 'lib/prisma.service';
import { Prisma } from '@prisma/client';
import { EncryptionService } from 'lib/encryption.service';
import { UtilityService } from 'lib/utility.service';
import { RoleService } from 'src/role/role.service';
import { ScopeService } from 'src/scope/scope.service';
import scopeReference from 'reference/scope.reference';

@Injectable()
export class AuthService {
  @Inject() private prisma: PrismaService;
  @Inject() private crypt: EncryptionService;
  @Inject() private utility: UtilityService;
  @Inject() private roleService: RoleService;
  @Inject() private scopeService: ScopeService;

  async login({ username, password }, headers: Headers, ip: string) {
    const userAgent = headers['user-agent'];
    const accountInformation = await this.prisma.account.findFirst({
      where: {
        OR: [{ email: username }, { username }],
      },
      include: { role: true },
    });

    /* validate email */
    if (!accountInformation) throw new NotFoundException(`Invalid Account`);

    const rawPassword = await this.crypt.decrypt(
      accountInformation.password,
      accountInformation.key,
    );

    /* validate password */
    if (rawPassword != password) throw new NotFoundException(`Invalid Account`);

    /* generate a token */
    const token = this.utility.randomString();

    const insertToken: Prisma.AccountTokenCreateInput = {
      account: { connect: accountInformation },
      payload: Buffer.from(JSON.stringify(accountInformation)).toString(
        'base64',
      ),
      userAgent: userAgent,
      token: token,
      ipAddress: ip,
      status: 'active',
      updatedAt: new Date(),
    };

    await this.prisma.accountToken.create({ data: insertToken });

    this.utility.log(
      'info',
      'auth_login',
      accountInformation.email + ' has successfully logged-in.',
    );

    const formattedResponse = this.utility.formatData(
      accountInformation,
      'account',
    );
    formattedResponse['token'] = token;
    formattedResponse['roleAccess'] =
      await this.getRoleAccess(accountInformation);
    return formattedResponse;
  }
  async getRoleAccess(accountInformation) {
    let roleAcces = [];

    if (accountInformation.hasOwnProperty('role')) {
      if (accountInformation.role.isDeveloper) {
        roleAcces = scopeReference.map((scope) => {
          return scope.id;
        });
      } else {
        roleAcces = await this.scopeService.getScopeArrayIDBasedOnRole(
          accountInformation.role.id,
        );
      }
    }

    return roleAcces;
  }
  async createAccount({
    firstName,
    lastName,
    contactNumber,
    email,
    username,
    password,
    developerKey,
    assignedRole = null,
    parentAccountId = null,
    image = '/images/person01.webp'
  }) {
    if (developerKey != process.env.DEVELOPER_KEY)
      throw new NotFoundException(`Invalid Developer Key`);

    email = email.toLowerCase();
    username = username.toLowerCase();
    const password_encryption = await this.crypt.encrypt(password);
    password = password_encryption.encrypted;
    const key = password_encryption.iv;
    const checkEmailExist = await this.prisma.account.findFirst({
      where: { email },
    });
    const checkUsernameExist = await this.prisma.account.findFirst({
      where: { username },
    });

    let dataInitialRole;

    if (!assignedRole) {
      dataInitialRole = await this.prisma.role.findFirst({
        where: { isDeveloper: true },
      });
      if (!dataInitialRole) {
        dataInitialRole = await this.roleService.seedInitialRole();
      }
    } else {
      dataInitialRole = assignedRole;
    }

    if (checkEmailExist) throw new NotFoundException(`Email already exist.`);
    if (checkUsernameExist)
      throw new NotFoundException(`Username already exist.`);

    const createParameters: Prisma.AccountCreateInput = {
      username,
      firstName,
      lastName,
      contactNumber,
      email,
      password,
      key,
      role: { connect: dataInitialRole },
      ...(parentAccountId
        ? { parent: { connect: { id: parentAccountId } } }
        : {}),
      image
    };

    const createResponse = await this.prisma.account.create({
      data: createParameters,
    });

    this.utility.log(
      'info',
      'authorization',
      email + ' has successfully created an account.',
    );

    const formattedResponse = this.utility.formatData(
      createResponse,
      'account',
    );
    return formattedResponse;
  }
}
