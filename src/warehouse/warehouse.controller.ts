import { Controller, Post, Body, Res, HttpStatus, Get, Query, Param, } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseCreateDTO } from 'dto/warehouse.validator';
import { TableQueryDTO, TableBodyDTO } from 'lib/table.dto/table.dto';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get()
  async getWarehouseList(@Res() response, 
  @Query() query: TableQueryDTO, 
  @Body() body: TableBodyDTO,
  @Query('createdById') createdById: string,
  ) {
    try {
      const { list, pagination, currentPage } = await this.warehouseService.getWarehouseList(query, body,createdById);
      return response.status(HttpStatus.OK).json({
        message: 'Warehouses retrieved successfully',
        data: list,
        pagination,
        currentPage,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error retrieving warehouses',
        error: error.message,
      });
    }
  }
  @Get('search')
  async searchWarehouseList(
    @Res() response,
    @Query() query: TableQueryDTO,
    @Body() body: TableBodyDTO,
    @Query('createdById') createdById: string,
  ) {
    try {   
      const result = await this.warehouseService.searchWarehouseList(query, body, createdById);   
      return response.status(HttpStatus.OK).json({
        message: 'Warehouse list fetched successfully',
        data: result,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error fetching warehouse list',
        error: error.message,
      });
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
      return response.status(HttpStatus.NOT_FOUND).json({
        message: 'Warehouse not found',
        error: error.message,
      });
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
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error creating warehouse',
        error: error.message,
      });
    }
  }
}
function Req(): (target: WarehouseController, propertyKey: "searchWarehouseList", parameterIndex: 3) => void {
  throw new Error('Function not implemented.');
}

