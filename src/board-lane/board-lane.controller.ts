import {
  Controller,
  Body,
  HttpStatus,
  Inject,
  Post,
  Patch,
  Response as NestResponse,
  Delete,
  Put,
  Query,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import { UtilityService } from 'lib/utility.service';
import { BoardLaneService } from './board-lane.service';
import {
  BoardLaneCreateDto,
  BoardLaneUpdateDto,
  BoardLaneDeleteDto,
  BoardLaneIdDto,
} from 'dto/board-lane.validator.dto';
import { TableBodyDTO, TableQueryDTO } from 'lib/table.dto/table.dto';

@Controller('board-lane')
export class BoardLaneController {
  @Inject() public utilityService: UtilityService;
  @Inject() public boardLaneService: BoardLaneService;

  @Post()
  async create(
    @Body() boardLaneDto: BoardLaneCreateDto,
    @NestResponse() response: Response,
  ) {
    try {
      const boardLaneInformation =
        await this.boardLaneService.createBoardLane(boardLaneDto);
      response.status(HttpStatus.CREATED).json({
        message: 'BoardLane created successfully',
        boardLaneInformation: boardLaneInformation,
      });
    } catch (error) {
      return this.utilityService.errorResponse(
        response,
        error,
        'Error in creating BoardLane',
      );
    }
  }

  @Patch()
  async update(
    @NestResponse() response: Response,
    @Body() boardLaneUpdateDto: BoardLaneUpdateDto,
  ) {
    try {
      const boardLaneInformation =
        await this.boardLaneService.updateBoardLaneInformation(
          boardLaneUpdateDto,
        );
      response.status(HttpStatus.OK).json({
        message: 'BoardLane updated successfully',
        boardLaneInformation: boardLaneInformation,
      });
    } catch (error) {
      return this.utilityService.errorResponse(
        response,
        error,
        'Error in updating BoardLane',
      );
    }
  }

  @Delete()
  async delete(
    @NestResponse() response: Response,
    @Body() parameters: BoardLaneDeleteDto,
  ) {
    try {
      const boardLaneInformation =
        await this.boardLaneService.deleteBoardLane(parameters);
      return response.status(HttpStatus.OK).json({
        message: 'Board Lane successfully deleted.',
        boardLaneInformation,
      });
    } catch (error) {
      return this.utilityService.errorResponse(
        response,
        error,
        'Board Lane cannot be deleted.',
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
      const boardLaneInformation = await this.boardLaneService.boardLaneTable(
        query,
        body,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Board Lane table successfully fetched.',
        boardLaneInformation,
      });
    } catch (error) {
      return this.utilityService.errorResponse(
        response,
        error,
        'Board Lane table cannot be fetched.',
      );
    }
  }
  @Get()
  async getProjectInformation(
    @NestResponse() response: Response,
    @Query() parameters: BoardLaneIdDto,
  ) {
    try {
      const boardLaneInformation =
        await this.boardLaneService.getBoardLaneById(parameters);
      return response.status(HttpStatus.OK).json({
        message: 'Board Lane Information successfully fetched.',
        boardLaneInformation,
      });
    } catch (error) {
      return this.utilityService.errorResponse(
        response,
        error,
        'Board Lane Information cannot be retrieved.',
      );
    }
  }
}
