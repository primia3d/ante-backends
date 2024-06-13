import {
  Controller,
  Post,
  Body,
  Param,
  HttpStatus,
  NotFoundException,
  ConflictException,
  Res,
  Inject,
  Get,
  Query,
} from "@nestjs/common";
import { InventoryService } from "./inventory.service";
import { CreateGeneralInventoryDTO } from "dto/general-inventory.create.dto";
import { UtilityService } from "lib/utility.service";
import { TableQueryDTO, TableBodyDTO } from "lib/table.dto/table.dto";

@Controller("inventory")
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}
  @Inject() public utility: UtilityService;
  
  
  @Get()
  async getGeneralInventoryList(@Res() response, 
  @Query() query: TableQueryDTO, 
  @Body() body: TableBodyDTO,
  @Query('warehouseId') warehouseId: string,
  ) {
    try {
      const { list, pagination, currentPage } = await this.inventoryService.getGeneralInventoryList(query, body,warehouseId);
      return response.status(HttpStatus.OK).json({
        message: 'General Inventory fetched successfully',
        data: list,
        pagination,
        currentPage,
      });
    } catch (error) {
      return this.utility.errorResponse(
        response,
        error,
        'Error Fetching General Inventory List',
      );
    }
  }
  @Get('search-general')
  async searchGeneralInventoryList(
    @Res() response,
    @Query() query: TableQueryDTO,
    @Body() body: TableBodyDTO,
    @Query('warehouseId') warehouseId: string,
  ) {
    try {   
      const result = await this.inventoryService.searchGeneralInventoryList(query, body, warehouseId);   
      return response.status(HttpStatus.OK).json({
        message: 'General Inventory list fetched successfully',
        data: result,
      });
    } catch (error) {
      return this.utility.errorResponse(
        response,
        error,
        'Error Fetching General Inventory List',
      );
    }
  }
  @Get('get-variant')
  async getVariantInventoryList(@Res() response, 
  @Query() query: TableQueryDTO, 
  @Body() body: TableBodyDTO,
  @Query('generalInventoryId') generalInventoryId: string,
  ) {
    try {
      const { list, pagination, currentPage } = await this.inventoryService.getVariantInventoryList(query, body,generalInventoryId);
      return response.status(HttpStatus.OK).json({
        message: 'Variant Inventory retrieved successfully',
        data: list,
        pagination,
        currentPage,
      });
    } catch (error) {
      return this.utility.errorResponse(
        response,
        error,
        'Error Fetching Variant Inventory List',
      );
    }
  }
  @Get('search-variant')
  async searchVariantInventoryList(
    @Res() response,
    @Query() query: TableQueryDTO,
    @Body() body: TableBodyDTO,
    @Query('generalInventoryId') generalInventoryId: string,
  ) {
    try {   
      const result = await this.inventoryService.searchVariantInventoryList(query, body, generalInventoryId);   
      return response.status(HttpStatus.OK).json({
        message: 'Variant Inventory list fetched successfully',
        data: result,
      });
    } catch (error) {
      return this.utility.errorResponse(
        response,
        error,
        'Error Fetching Variant Inventory List',
      );
    }
  }
  @Post(":warehouseId")
  async createInventory(
    @Res() response,
    @Param("warehouseId") warehouseId: string,
    @Body() createGeneralInventoryDTO: CreateGeneralInventoryDTO
  ) {
    try {
      const result = await this.inventoryService.createInventory(
        createGeneralInventoryDTO,
        warehouseId
      );
      return response.status(HttpStatus.CREATED).json({
        message: "Inventory created successfully",
        data: result,
      });
    } catch (error) {
      return this.utility.errorResponse(
        response,
        error,
        'Inventory creation error.',
      );
    }
  }
}
