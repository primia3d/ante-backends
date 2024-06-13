import { Controller, Post, Body, Res, HttpStatus, Get, Query, Param, Inject, } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseCreateDTO } from 'dto/warehouse.validator';
import { TableQueryDTO, TableBodyDTO } from 'lib/table.dto/table.dto';
import { UtilityService } from 'lib/utility.service';

@Controller('warehouse')
export class WarehouseController {
  @Inject() public warehouseService: WarehouseService;
  @Inject() public utility: UtilityService;
  @Get()
  async getWarehouseList(@Res() response, 
  @Query() query: TableQueryDTO, 
  @Body() body: TableBodyDTO,
  ) {
    try {
      const { list, pagination, currentPage } = await this.warehouseService.getWarehouseList(query, body);
      return response.status(HttpStatus.OK).json({
        message: 'Warehouses retrieved successfully',
        data: list,
        pagination,
        currentPage,
      });
    } catch (error) {
      return this.utility.errorResponse(
        response,
        error,
        'Error Fetching Warehouse List',
      );
    }
  }
  @Get('search')
  async searchWarehouseList(
    @Res() response,
    @Query() query: TableQueryDTO,
    @Body() body: TableBodyDTO,
  ) {
    try {   
      const result = await this.warehouseService.searchWarehouseList(query, body);   
      return response.status(HttpStatus.OK).json({
        message: 'Warehouse list fetched successfully',
        data: result,
      });
    } catch (error) {
      return this.utility.errorResponse(
        response,
        error,
        'Error Fetching Warehouse List',
      );
    }
  }


  @Get(':id')
  async getWarehouseById(@Res() response, @Param('id') id: string) {
    try {
      const warehouse = await this.warehouseService.getWarehouseById(id);
      return response.status(HttpStatus.OK).json({
        message: 'Warehouse retrieved successfully',
        data: warehouse,
      });
    } catch (error) {
      return this.utility.errorResponse(
        response,
        error,
        'Error Fetching Warehouse List',
      );
    }
  }

  @Post()
  async createWarehouse(@Res() response, @Body() warehouseCreateDTO: WarehouseCreateDTO) {
    try {
      const result = await this.warehouseService.createWarehouse(warehouseCreateDTO);
      return response.status(HttpStatus.CREATED).json({
        message: 'Warehouse created successfully',
        data: result,
      });
    } catch (error) {
      return this.utility.errorResponse(
        response,
        error,
        'Warehouse creation error.',
      );
    }
  }
}


