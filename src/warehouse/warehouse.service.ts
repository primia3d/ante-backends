import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'lib/prisma.service';
import { UtilityService } from 'lib/utility.service';
import { WarehouseCreateDTO } from 'dto/warehouse.validator';
import { TableHandlerService } from 'lib/table.handler/table.handler.service';
import { TableBodyDTO, TableQueryDTO } from 'lib/table.dto/table.dto';

@Injectable()
export class WarehouseService {
  @Inject() public prisma: PrismaService;
  @Inject() public utility: UtilityService;
  @Inject() public tableHandler: TableHandlerService;

  async searchWarehouseList(query: TableQueryDTO, body: TableBodyDTO) {
    this.tableHandler.initialize(query, body, 'warehouse');
    const tableQuery = this.tableHandler.constructTableQuery();
  
    if (query.search) {
      tableQuery['where'] = {
        AND: [
          tableQuery['where'],
          {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' } },
            ],
          },
        ],
      };
    }
    tableQuery['select'] = {
      id: true,
      name: true,
      location: true,
      size: true,
    };
    const { list: baseList, currentPage, pagination } = await this.tableHandler.getTableData(
      this.prisma.warehouse,
      query,
      tableQuery,
    );
    const list = await this.utility.mapFormatData(baseList, 'warehouse');
  
    return { list, pagination, currentPage };
}
  async getWarehouseList(query: TableQueryDTO, body: TableBodyDTO) {
    this.tableHandler.initialize(query, body, 'warehouse');
    const tableQuery = this.tableHandler.constructTableQuery();

    tableQuery['select'] = {
      id: true,
      name: true,
      location: true,
      size: true,
    };

    tableQuery['where'] = {
      AND: [
        { isDeleted: false }, 
    ],
    };

    const { list: baseList, currentPage, pagination } = await this.tableHandler.getTableData(
      this.prisma.warehouse,
      query,
      tableQuery,
    );

  
    const list = await this.utility.mapFormatData(baseList, 'warehouse');
    return { list, pagination, currentPage };
}
  async getWarehouseById(id: string) {
    const warehouse = await this.prisma.warehouse.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
        location: true,
        size: true,
        storageCapacity: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    return this.utility.formatData(warehouse, 'warehouse');
  }

  async createWarehouse(warehouseDto: WarehouseCreateDTO) {
    const accountInformation = this.utility.accountInformation;

    const existingWarehouse = await this.prisma.warehouse.findFirst({
        where: {
          name: warehouseDto.name,
        },
      });
  
      if (existingWarehouse && existingWarehouse.createdById === accountInformation.id) {
        throw new ConflictException('A warehouse with the same name already exists');
      }
    
    const createWarehouseData: Prisma.WarehouseCreateInput = {
      name: warehouseDto.name,
      location: warehouseDto.location,
      size: warehouseDto.size,
      storageCapacity: warehouseDto.storageCapacity,
      createdBy: { connect: { id: accountInformation.id } },
      updatedBy: { connect: { id: accountInformation.id } },
    };

    const createResponse = await this.prisma.warehouse.create({
      data: createWarehouseData,
    });

    return this.utility.formatData(createResponse, 'warehouse');
  }
}
