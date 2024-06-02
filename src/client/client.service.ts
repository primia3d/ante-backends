import { Injectable, Inject } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'lib/prisma.service';
import { ClientCreateDTO } from 'dto/client.validator.dto';
import { UtilityService } from 'lib/utility.service';

@Injectable()
export class ClientService {
  @Inject() public prisma: PrismaService;
  @Inject() public utilityService: UtilityService;

  async createClient(clientDto: ClientCreateDTO) {
    const createClientData: Prisma.ClientCreateInput = {
      firstName: clientDto.firstName,
      lastName: clientDto.lastName,
      contactNumber: clientDto.contactNumber,
      email: clientDto.email,
      address: clientDto.address,
    };

    const createResponse = await this.prisma.client.create({
      data: createClientData,
    });

    return this.utilityService.formatData(createResponse, 'client');
  }
}
