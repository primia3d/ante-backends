import {
  Inject,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  Delete,
  Body,
  Res,
  HttpStatus,
  Query,
  UsePipes,
} from "@nestjs/common";
import {
  RoleGetDTO,
  RoleCreateDTO,
  RoleUpdateDTO,
  RoleDeleteDTO,
  RoleParentDTO,
} from "dto/role.validator.dto";
import { RoleService } from "./role.service";
import { UtilityService } from "lib/utility.service";
import { TableQueryDTO, TableBodyDTO } from "lib/table.dto/table.dto";
import { EnsureUniqueLevelOneRolePipe } from "pipes/unique-role-level-one.pipe";
@Controller("role")
export class RoleController {
  @Inject() public roleService: RoleService;
  @Inject() public utility: UtilityService;

  @Get("by-group")
  async parent(@Res() response, @Query() params: RoleParentDTO) {
    try {
      const list = await this.roleService.getRoleByGroup(params);
      return response.status(HttpStatus.OK).json({
        message: "Role successfully fetched.",
        list,
      });
    } catch (err) {
      return this.utility.errorResponse(
        response,
        err,
        "Role information cannot be retrieved."
      );
    }
  }

  @Get("tree")
  async tree(@Res() response) {
    try {
      const tree = await this.roleService.getTree();
      return response.status(HttpStatus.OK).json({
        message: "Role tree successfully fetched.",
        tree,
      });
    } catch (err) {
      return this.utility.errorResponse(
        response,
        err,
        "Role information cannot be retrieved."
      );
    }
  }

  @Get()
  async get(@Res() response, @Query() params: RoleGetDTO) {
    try {
      const roleInformation = await this.roleService.getRole(params);
      return response.status(HttpStatus.OK).json({
        message: "Role successfully fetched.",
        roleInformation,
      });
    } catch (err) {
      return this.utility.errorResponse(
        response,
        err,
        "Role information cannot be retrieved."
      );
    }
  }

  @Put()
  async table(
    @Res() response,
    @Query() query: TableQueryDTO,
    @Body() body: TableBodyDTO
  ) {
    try {
      const roleInformation = await this.roleService.roleTable(query, body);
      return response.status(HttpStatus.OK).json({
        message: "Role table successfully fetched.",
        roleInformation,
      });
    } catch (err) {
      return this.utility.errorResponse(
        response,
        err,
        "Role table cannot be fetched."
      );
    }
  }

  @UsePipes(EnsureUniqueLevelOneRolePipe)
  @Post()
  async add(@Res() response, @Body() params: RoleCreateDTO) {
    try {
      const newRoleLevel = await this.roleService.calculateRoleLevel(
        params.parentRoleId
      );
      const adjustedParams = {
        ...params,
        level: newRoleLevel,
      };

      const roleInformation = await this.roleService.addRole(adjustedParams);
      return response.status(HttpStatus.OK).json({
        message: "Role successfully added.",
        roleInformation,
      });
    } catch (err) {
      return this.utility.errorResponse(response, err, "Rol create failed.");
    }
  }
  @Patch()
  async update(@Res() response, @Body() params: RoleUpdateDTO) {
    try {
      const roleInformation = await this.roleService.updateRole(params);
      return response.status(HttpStatus.OK).json({
        message: "Role successfully updated.",
        roleInformation,
      });
    } catch (err) {
      return this.utility.errorResponse(response, err, "Role update failed.");
    }
  }
  @Delete()
  async delete(@Res() response, @Body() params: RoleDeleteDTO) {
    try {
      const roleInformation = await this.roleService.deleteRole(params);
      return response.status(HttpStatus.OK).json({
        message: "Role successfully deleted.",
        roleInformation,
      });
    } catch (err) {
      return this.utility.errorResponse(response, err, "Role delete failed.");
    }
  }

  @Get("search-role")
  async searchRole(
    @Res() response,
    @Query() query: TableQueryDTO,
    @Query("searchQuery") searchQuery: string,
    @Body() body: TableBodyDTO
  ) {
    try {
      const roleInformation = await this.roleService.searchRole(
        query,
        body,
        searchQuery
      );
      return response.status(HttpStatus.OK).json({
        message: "Role table successfully fetched.",
        roleInformation,
      });
    } catch (err) {
      return this.utility.errorResponse(
        response,
        err,
        "Role table cannot be fetched."
      );
    }
  }
}
