import {
  Inject,
  Controller,
  Get,
  Post,
  Put,
  Body,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ScopeListDTO, ScopeTreeDTO } from 'dto/scope.validator.dto';
import { ScopeService } from './scope.service';
import { UtilityService } from 'lib/utility.service';
import { TableQueryDTO, TableBodyDTO } from 'lib/table.dto/table.dto';

@Controller('scope')
export class ScopeController {
  @Inject() public scopeService: ScopeService;
  @Inject() public utility: UtilityService;

  @Post('sync')
  async synchronizeScope(@Res() response) {
    try {
      const scopeUpdateList = await this.scopeService.syncScope();
      return response.status(HttpStatus.OK).json({
        message: 'Scope information has been succesfully synced.',
        scopeUpdateList,
      });
    } catch (err) {
      return this.utility.errorResponse(response, err, 'Scope cannot sync.');
    }
  }

  @Put()
  async getScopeTable(
    @Res() response,
    @Query() query: TableQueryDTO,
    @Body() body: TableBodyDTO,
  ) {
    try {
      const scopeInformation = await this.scopeService.getScopeList(
        query,
        body,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Scope table successfully fetched.',
        scopeInformation,
      });
    } catch (err) {
      return this.utility.errorResponse(
        response,
        err,
        'Scope list cannot be retrieved.',
      );
    }
  }
  @Get('tree')
  async getScopeTree(@Res() response, @Query() query: ScopeTreeDTO) {
    try {
      const scopeTree = await this.scopeService.getScopeTree(query);
      return response.status(HttpStatus.OK).json({
        message: 'Scope tree has been fetched.',
        scopeTree,
      });
    } catch (err) {
      return this.utility.errorResponse(
        response,
        err,
        'Scope list cannot be retrieved.',
      );
    }
  }
  @Get('list')
  async getScopeList(@Res() response, @Query() query: ScopeListDTO) {
    try {
      const scopeTree = await this.scopeService.getList(query);
      return response.status(HttpStatus.OK).json({
        message: 'Scope list has been fetched.',
        scopeTree,
      });
    } catch (err) {
      return this.utility.errorResponse(
        response,
        err,
        'Scope list cannot be retrieved.',
      );
    }
  }
}
