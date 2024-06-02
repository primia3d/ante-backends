import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'lib/prisma.service';
import { UtilityService } from 'lib/utility.service';
import { AccountTokenInterface } from 'interfaces';

@Injectable()
export class WsAdminGuard implements CanActivate {
  private readonly logger = new Logger(WsAdminGuard.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly utilityService: UtilityService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const { token } = client.handshake.auth?.token
      ? client.handshake.auth
      : client.handshake.headers;

    const checkToken = await this.authenticateClient(token);
    if (!checkToken) return false;

    const accountInformation = await this.fetchClientInformation(checkToken);

    if (!accountInformation) return false;

    this.utilityService.setAccountInformation(accountInformation);

    return true;
  }

  async authenticateClient(token: string): Promise<AccountTokenInterface> {
    const checkToken = await this.prisma.accountToken.findFirst({
      where: { token },
    });
    return checkToken;
  }

  async fetchClientInformation(checkToken: AccountTokenInterface) {
    const accountInformation = await this.prisma.account.findFirst({
      where: { id: checkToken.accountId },
      include: {
        role: {
          include: {
            roleGroup: true,
          },
        },
      },
    });

    return accountInformation;
  }
}
