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
  AccountGetDTO,
  AccountCreateDTO,
  AccountUpdateDTO,
  AccountDeleteDTO,
} from "dto/account.validator.dto";
import { AccountService } from "./account.service";
import { UtilityService } from "lib/utility.service";
import { TableQueryDTO, TableBodyDTO } from "lib/table.dto/table.dto";
import { AuthService } from "src/auth/auth.service";
import { EnsureOneUserPerRoleHeadPipe } from "pipes/unique-role-head.pipe.ts";

@Controller("account")
export class AccountController {
  @Inject() public accountService: AccountService;
  @Inject() public utility: UtilityService;
  @Inject() public auth: AuthService;

  @Get("my_account")
  async myAccount(@Res() response) {
    const myAccountInformation = this.utility.formatData(
      this.utility.accountInformation,
      "account"
    );
    myAccountInformation["roleAccess"] =
      await this.auth.getRoleAccess(myAccountInformation);

    try {
      return response.status(HttpStatus.CREATED).json({
        message: "Account Information Succesfully fetched.",
        myAccountInformation,
      });
    } catch (err) {
      return this.utility.errorResponse(
        response,
        err,
        "Account creation error."
      );
    }
  }

  @Get()
  async get(@Res() response, @Query() params: AccountGetDTO) {
    try {
      const accountInformation =
        await this.accountService.getAccountInformation(params);
      return response.status(HttpStatus.OK).json({
        message: "Account successfully fetched.",
        data: accountInformation,
      });
    } catch (err) {
      return this.utility.errorResponse(
        response,
        err,
        "Account information cannot be retrieved."
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
      const accountInformation = await this.accountService.accountTable(
        query,
        body
      );
      return response.status(HttpStatus.OK).json({
        message: "Account table successfully fetched.",
        accountInformation,
      });
    } catch (err) {
      return this.utility.errorResponse(
        response,
        err,
        "Account table cannot be fetched."
      );
    }
  }

  @UsePipes(EnsureOneUserPerRoleHeadPipe)
  @Post()
  async add(@Res() response, @Body() params: AccountCreateDTO) {
    try {
      const accountInformation =
        await this.accountService.createAccount(params);
      return response.status(HttpStatus.OK).json({
        message: "Account successfully added.",
        accountInformation,
      });
    } catch (err) {
      return this.utility.errorResponse(
        response,
        err,
        "Account create failed."
      );
    }
  }
  @Patch()
  async update(@Res() response, @Body() params: AccountUpdateDTO) {
    try {
      const accountInformation =
        await this.accountService.updateAccount(params);
      return response.status(HttpStatus.OK).json({
        message: "Account successfully updated.",
        accountInformation,
      });
    } catch (err) {
      return this.utility.errorResponse(
        response,
        err,
        "Account update failed."
      );
    }
  }
  @Delete()
  async delete(@Res() response, @Body() params: AccountDeleteDTO) {
    try {
      const accountInformation = await this.accountService.deleteUser(params);
      return response.status(HttpStatus.OK).json({
        message: "Account successfully deleted.",
        accountInformation,
      });
    } catch (err) {
      return this.utility.errorResponse(
        response,
        err,
        "Account delete failed."
      );
    }
  }

  @Get("search-collab")
  async searchCollab(
    @Res() response,
    @Query() query: TableQueryDTO,
    @Query("currentUserId") currentUserId: string,
    @Body() body: TableBodyDTO
  ) {
    try {
      const result = await this.accountService.searchCollaborators(
        query,
        body,
        currentUserId
      );
      return response.status(HttpStatus.OK).json({
        message: "Collaborators fetched successfully",
        data: result,
      });
    } catch (err) {
      return this.utility.errorResponse(
        response,
        err,
        "Search results cannot be retrieved"
      );
    }
  }

  @Get("search-assignees")
  async searchAssignee(
    @Res() response,
    @Query() query: TableQueryDTO,
    @Query("currentUserId") currentUserId: string,
    @Body() body: TableBodyDTO
  ) {
    try {
      const result = await this.accountService.searchAssignees(
        query,
        body,
        currentUserId
      );
      return response.status(HttpStatus.OK).json({
        message: "Assignees fetched successfully",
        data: result,
      });
    } catch (err) {
      return this.utility.errorResponse(
        response,
        err,
        "Search results cannot be retrieved"
      );
    }
  }
  
  @Get("search-account")
  async searchAccount(
    @Res() response,
    @Query() query: TableQueryDTO,
    @Query("searchQuery") searchQuery: string,
    @Body() body: TableBodyDTO
  ) {
    try {
      const accountInformation = await this.accountService.searchAccount(
        query,
        body,
        searchQuery
      );
      return response.status(HttpStatus.OK).json({
        message: "Account table successfully fetched.",
        accountInformation,
      });
    } catch (err) {
      return this.utility.errorResponse(
        response,
        err,
        "Account table cannot be fetched."
      );
    }
  }
}
