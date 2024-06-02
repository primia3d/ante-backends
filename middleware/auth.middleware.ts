import {
  Injectable,
  NestMiddleware,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'lib/prisma.service';
import { UtilityService } from 'lib/utility.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  @Inject() private prisma: PrismaService;
  @Inject() private utility: UtilityService;
  @Inject() private auth: AuthService;

  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.token) throw new NotFoundException(`Invalid Token`);

    const token = req.headers.token.toString();
    const checkToken = await this.prisma.accountToken.findFirst({
      where: { token },
    });

    if (!checkToken) throw new NotFoundException(`Invalid Token`);

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

    if (!accountInformation) throw new NotFoundException(`Invalid Account`);

    this.utility.setAccountInformation(accountInformation);

    next();
  }
}
