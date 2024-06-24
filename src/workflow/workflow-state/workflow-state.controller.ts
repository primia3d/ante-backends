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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { WorkflowStateService } from './workflow-state.service';
import {
  WorkflowStateCreateDto,
  WorkflowStateIdDto,
  WorkflowStateListDto,
  WorkflowStateUpdateDto,
} from 'dto/workflow-state.validator.dto';

@UsePipes(new ValidationPipe({ transform: true }))
@Controller('workflow-state')
export class WorkflowStateController {
  @Inject() public workflowStateService: WorkflowStateService;

  @Post()
  async create(
    @NestResponse() response: Response,
    @Body() parameters: WorkflowStateCreateDto,
  ) {
    try {
      const newWorkflowState =
        await this.workflowStateService.createStatePerWorkflow(parameters);
      return response.status(HttpStatus.CREATED).json({
        message: 'Workflow State has been created successfully',
        workflowStateInformation: newWorkflowState,
      });
    } catch (error) {
      return this.handleErrorResponse(response, error);
    }
  }

  @Get('list')
  async fetchAll(
    @NestResponse() response: Response,
    @Query() query: WorkflowStateListDto,
  ) {
    try {
      const workflowStatesList =
        await this.workflowStateService.findAllStatePerWorkflow(query);
      return response.status(HttpStatus.OK).json({
        message: 'Workflow State List has been fetched successfully',
        workflowStateInformation: workflowStatesList,
      });
    } catch (error) {
      return this.handleErrorResponse(response, error);
    }
  }

  @Get()
  async findOne(
    @NestResponse() response: Response,
    @Query() query: WorkflowStateIdDto,
  ) {
    try {
      const workflowStateInformation =
        await this.workflowStateService.findStateInformationPerWorkflow(query);
      return response.status(HttpStatus.OK).json({
        message: 'Workflow State Information has been fetched successfully',
        workflowStateInformation: workflowStateInformation,
      });
    } catch (error) {
      return this.handleErrorResponse(response, error);
    }
  }

  @Patch()
  async update(
    @NestResponse() response: Response,
    @Body() parameters: WorkflowStateUpdateDto,
  ) {
    try {
      const updatedWorkflowStateInformation =
        await this.workflowStateService.updateWorkflowStateInformation(
          parameters,
        );
      return response.status(HttpStatus.OK).json({
        message: 'Workflow State Information has been updated successfully',
        workflowStateInformation: updatedWorkflowStateInformation,
      });
    } catch (error) {
      return this.handleErrorResponse(response, error);
    }
  }

  @Delete()
  async remove(
    @NestResponse() response: Response,
    @Body() parameters: WorkflowStateIdDto,
  ) {
    try {
      const deletedWorkflowStateInformation =
        await this.workflowStateService.removeWorkflowStatePerWorkflow(
          parameters,
        );
      return response.status(HttpStatus.OK).json({
        message: 'Workflow State Information has been successfully deleted',
        deletedWorkflowStateInformation,
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
