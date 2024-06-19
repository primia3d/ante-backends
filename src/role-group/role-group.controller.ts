import {
  Controller,
  Body,
  HttpStatus,
  Inject,
  Post,
  Response as NestResponse,
  Put,
  Query,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  RoleGroupCreateDTO,
  RoleGroupUpdateDTO,
} from 'dto/role-group.validator.dto';
import { UtilityService } from 'lib/utility.service';
import { RoleGroupService } from './role-group.service';
import { Response } from 'express';
import { TableBodyDTO, TableQueryDTO } from 'lib/table.dto/table.dto';
import { error } from 'console';
import { CommonIdDTO } from 'dto/common.id.dto';
import configReference from 'reference/config.reference';

@Controller('role-group')
export class RoleGroupController {
  @Inject() public roleGroupService: RoleGroupService;
  @Inject() public utilityService: UtilityService;

  @Post()
  async create(
    @NestResponse() response: Response,
    @Body() params: RoleGroupCreateDTO,
  ) {
    try {
      const roleGroupInformation =
        await this.roleGroupService.createRoleGroup(params);
      return response.status(HttpStatus.OK).json({
        message: 'Role Group created successfully',
        roleGroupInformation,
      });
    } catch (error) {
      return this.utilityService.errorResponse(
        response,
        error,
        'Error in creating Role Group',
      );
    }
  }

  @Put()
  async table(
    @NestResponse() response: Response,
    @Query() query: TableQueryDTO,
    @Body() body: TableBodyDTO,
  ) {
    try {
      const roleGroupInformation = await this.roleGroupService.roleGroupTable(
        query,
        body,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Role Group has been successfully fetched',
        roleGroupInformation,
      });
    } catch (error) {}
    return this.utilityService.errorResponse(
      response,
      error,
      'Role Group table has error when fetching',
    );
  }

  @Get()
  async getRoleGroupInformation(
    @NestResponse() response: Response,
    @Query() params: CommonIdDTO,
  ) {
    try {
      const roleGroupInformation =
        await this.roleGroupService.getRoleGroupByID(params);
      return response.status(HttpStatus.OK).json({
        message: `Role Group Id  has been successfully fetched`,
        roleGroupInformation,
      });
    } catch (error) {
      return this.utilityService.errorResponse(
        response,
        error,
        `Role Id is not found`,
      );
    }
  }

  @Patch()
  async updateRoleGroup(
    @NestResponse() response: Response,
    @Body() params: RoleGroupUpdateDTO,
  ) {
    try {
      const roleGroupInformation =
        await this.roleGroupService.updateRoleGroupInformation(params);
      return response.status(HttpStatus.OK).json({
        message: `Role Group Information has been successfully updated`,
        roleGroupInformation,
      });
    } catch (error) {
      return this.utilityService.errorResponse(
        response,
        error,
        `Role group update failed.`,
      );
    }
  }

  @Delete()
  async delete(
    @NestResponse() response: Response,
    @Body() params: CommonIdDTO,
  ) {
    try {
      const roleGroupInformation =
        await this.roleGroupService.deleteRoleGroup(params);
      return response.status(HttpStatus.OK).json({
        message: `Delete successful for role group id: ${params.id}`,
        roleGroupInformation,
      });
    } catch (error) {
      return this.utilityService.errorResponse(
        response,
        error,
        `Delete failed for role group id: ${params.id}`,
      );
    }
  }
  @Get('dropdown-list')
  async dropdownList(@NestResponse() response: Response) {
    const currentUserInformation = this.utilityService.accountInformation;
    const { role } = currentUserInformation;

    try {
      let roleGroupInformation;
      if (role.level === configReference.level.SUPER_ADMIN) {
        roleGroupInformation =
          await this.roleGroupService.getRoleGroupDropdownListForSuperAdmin();
      } else {
        roleGroupInformation =
          await this.roleGroupService.getRoleGroupDropdownListForNonAdmin();
      }

      return response.status(HttpStatus.OK).json({
        message: 'Role Group has been successfully fetched',
        roleGroupInformation,
      });
    } catch (error) {
      return this.utilityService.errorResponse(
        response,
        error,
        'Error fetching Role Group information',
      );
    }
  }

  @Get('role-list')
  async getRoleListsPerRoleGroup(
    @NestResponse() response: Response,
    @Query() params: CommonIdDTO,
  ) {
    const roleList = await this.roleGroupService.getListOfRoles(params.id);
    return response.status(HttpStatus.OK).json({
      message: 'Role List has been successfully fetched',
      roleList,
    });
  }

  @Get('search-role-group')
  async searchRoleGroup(
    @NestResponse() response: Response,
    @Query() query: TableQueryDTO,
    @Query('searchQuery') searchQuery: string,
    @Body() body: TableBodyDTO,
  ) {
    try {
      const roleGroupInformation = await this.roleGroupService.searchRoleGroup(
        query,
        body,
        searchQuery,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Role Group has been successfully fetched',
        roleGroupInformation,
      });
    } catch (error) {}
    return this.utilityService.errorResponse(
      response,
      error,
      'Role Group table has error when fetching',
    );
  }

  
}
