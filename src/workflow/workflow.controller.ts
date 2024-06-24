import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Response as NestResponse,
  Inject,
  HttpStatus,
  Query,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { WorkflowService } from './workflow.service';
import {
  WorkflowCreateDto,
  WorkflowIdDto,
  WorkflowUpdateDto,
} from '../../dto/workflow.validator.dto';
import { TableBodyDTO, TableQueryDTO } from 'lib/table.dto/table.dto';

@Controller('workflow')
export class WorkflowController {
  @Inject() public workflowService: WorkflowService;

  @Post('create')
  async create(
    @Body() parameters: WorkflowCreateDto,
    @NestResponse() response: Response,
  ) {
    try {
      const newWorkflow = await this.workflowService.create(parameters);
      return response.status(HttpStatus.CREATED).json({
        message: 'Workflow has been created successfully',
        workflowInformation: newWorkflow,
      });
    } catch (error) {
      return this.handleErrorResponse(response, error);
    }
  }

  @Put('table')
  async findAll(
    @NestResponse() response: Response,
    @Query() query: TableQueryDTO,
    @Body() body: TableBodyDTO,
  ) {
    try {
      const workflowInformation = await this.workflowService.findAll(
        query,
        body,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Workflow List has been successfully fetched',
        workflowInformation,
      });
    } catch (error) {
      return this.handleErrorResponse(response, error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @NestResponse() response: Response) {
    try {
      const workflowInformation = await this.workflowService.findOne(+id);
      return response.status(HttpStatus.OK).json({
        message: 'Workflow Information has been successfully fetched',
        workflowInformation,
      });
    } catch (error) {
      return this.handleErrorResponse(response, error);
    }
  }

  @Patch()
  async update(
    @NestResponse() response: Response,
    @Body() parameters: WorkflowUpdateDto,
  ) {
    try {
      const updatedWorkflowInformation =
        await this.workflowService.update(parameters);
      return response.status(HttpStatus.OK).json({
        message: 'Workflow Information has been successfully updated',
        updatedWorkflowInformation,
      });
    } catch (error) {
      return this.handleErrorResponse(response, error);
    }
  }

  @Delete()
  async remove(
    @NestResponse() response: Response,
    @Body() parameters: WorkflowIdDto,
  ) {
    try {
      const deletedWorkflowInformation =
        await this.workflowService.remove(parameters);
      return response.status(HttpStatus.OK).json({
        message: 'Workflow Information has been successfully deleted',
        deletedWorkflowInformation,
      });
    } catch (error) {
      return this.handleErrorResponse(response, error);
    }
  }

  private handleErrorResponse(response: Response, error: Error) {
    if (error instanceof NotFoundException) {
      return response.status(HttpStatus.NOT_FOUND).json({
        status: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: error.message,
      });
    }

    return response.status(HttpStatus.BAD_REQUEST).json({
      status: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: error.message,
    });
  }
}
