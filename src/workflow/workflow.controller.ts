import {
  Controller,
  Body,
  HttpStatus,
  Inject,
  Post,
  Response as NestResponse,
} from '@nestjs/common';
import { UtilityService } from 'lib/utility.service';
import { Response } from 'express';
import { WorkflowManagementService } from './workflow-management.service';
import { WorkflowCreateDto } from 'dto/workflow.validator.dto';
import { CreateStateDto } from 'dto/state.validator.dto';
import { CreateTransitionsDto } from 'dto/transitions.validator';
import { CreateActionDto } from 'dto/actions.validator.dto';
import { CreateConditionDto } from 'dto/conditions.validator.dto';

@Controller('workflow')
export class WorkflowController {
  @Inject() public utilityService: UtilityService;
  @Inject() public workflowManagementService: WorkflowManagementService;

  @Post('create')
  async createWorkflow(
    @NestResponse() response: Response,
    @Body() workflowCreateDto: WorkflowCreateDto,
  ) {
    try {
      const newWorkflow =
        await this.workflowManagementService.createWorkflow(workflowCreateDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Workflow created successfully',
        workFlowInformation: newWorkflow,
      });
    } catch (error) {
      return this.utilityService.errorResponse(
        response,
        error,
        'Error in creating Workflow',
      );
    }
  }

  @Post('add-state')
  async addStateToWorkFlow(
    @NestResponse() response: Response,
    @Body() stateCreateDto: CreateStateDto,
  ) {
    try {
      const newState =
        await this.workflowManagementService.addState(stateCreateDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'State has been created successfully',
        stateInformation: newState,
      });
    } catch (error) {
      return this.utilityService.errorResponse(
        response,
        error,
        'Error in creating State',
      );
    }
  }

  @Post('add-transition')
  async addTransitionToState(
    @NestResponse() response: Response,
    @Body() transitionDto: CreateTransitionsDto,
  ) {
    try {
      const newTransition =
        await this.workflowManagementService.addTransitions(transitionDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Transition has been created successfully',
        transitionInformation: newTransition,
      });
    } catch (error) {
      return this.utilityService.errorResponse(
        response,
        error,
        'Error in creating Transition',
      );
    }
  }

  @Post('add-action')
  async addActionToTransition(
    @NestResponse() response: Response,
    @Body() actionCreateDto: CreateActionDto,
  ) {
    try {
      const newAction =
        await this.workflowManagementService.addActionToTransition(
          actionCreateDto,
        );
      return response.status(HttpStatus.CREATED).json({
        message: 'Action has been created successfully',
        actionInformation: newAction,
      });
    } catch (error) {
      return this.utilityService.errorResponse(
        response,
        error,
        'Error in creating Action',
      );
    }
  }

  @Post('add-condition')
  async addConditionToTransition(
    @NestResponse() response: Response,
    @Body() conditionCreateDto: CreateConditionDto,
  ) {
    try {
      const newCondition =
        await this.workflowManagementService.addConditionToTransition(
          conditionCreateDto,
        );
      return response.status(HttpStatus.CREATED).json({
        message: 'Condition has been created successfully',
        conditionInformation: newCondition,
      });
    } catch (error) {
      return this.utilityService.errorResponse(
        response,
        error,
        'Error in creating Condition',
      );
    }
  }
}
