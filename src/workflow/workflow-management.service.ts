import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  WorkflowCreateDto,
  WorkflowCreateResponse,
} from 'dto/workflow.validator.dto';
import { PrismaService } from 'lib/prisma.service';
import { UtilityService } from 'lib/utility.service';
import { plainToClass } from 'class-transformer';
import { CreateStateDto, StateCreateResponse } from 'dto/state.validator.dto';
import { CreateTransitionsDto } from 'dto/transitions.validator';
import { create } from 'domain';
import {
  ActionCreateResponse,
  CreateActionDto,
} from 'dto/actions.validator.dto';
import {
  ConditionCreateResponse,
  CreateConditionDto,
} from 'dto/conditions.validator.dto';

@Injectable()
export class WorkflowManagementService {
  @Inject() public utilityService: UtilityService;
  @Inject() public prisma: PrismaService;

  async createWorkflow(
    workflowCreateDto: WorkflowCreateDto,
  ): Promise<WorkflowCreateResponse> {
    const createWorkflowData: Prisma.WorkflowCreateInput = {
      name: workflowCreateDto.name,
      description: workflowCreateDto.description,
    };

    const workflowResponse = await this.prisma.workflow.create({
      data: createWorkflowData,
    });

    if (workflowResponse) {
      await this.addInitialStateForCreatedWorkflow(workflowResponse);
    }

    return plainToClass(WorkflowCreateResponse, workflowResponse);
  }

  async addInitialStateForCreatedWorkflow(workflowResponse) {
    let { id: initialStateType } = await this.prisma.stateTypeStatic.findFirst({
      where: { name: 'START' },
    });
    if (!initialStateType)
      throw new BadRequestException(
        'There is no Initial State Type with Start. Please use the migration seed first',
      );

    const stateParameters = {
      name: 'Initial State',
      description: `Initial state for ${workflowResponse.name}`,
      stateTypeId: initialStateType,
      workflowId: workflowResponse.id,
    };

    await this.prisma.state.create({
      data: stateParameters,
    });
  }

  async addState(createStateDto: CreateStateDto): Promise<StateCreateResponse> {
    await this.validateWorkflowId(createStateDto.workflowId);
    await this.validateStateTypeId(createStateDto.stateTypeId);

    const createStateData: Prisma.StateCreateInput = {
      name: createStateDto.name,
      description: createStateDto.description,
      workflow: { connect: { id: createStateDto.workflowId } },
      stateType: { connect: { id: createStateDto.stateTypeId } },
    };

    const stateResponse = await this.prisma.state.create({
      data: createStateData,
    });

    return plainToClass(StateCreateResponse, stateResponse);
  }

  private async validateWorkflowId(workflowId: number) {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id: workflowId },
    });
    if (!workflow) {
      throw new NotFoundException('Invalid workflowId. Workflow not found.');
    }
  }

  private async validateStateId(stateId: number) {
    const stateInformation = await this.prisma.state.findUnique({
      where: { id: stateId },
    });
    if (!stateInformation) {
      throw new NotFoundException('Invalid state id. State not found.');
    }
  }

  private async validateTransitionId(transitionId: number) {
    const transitionInformation = await this.prisma.transitions.findUnique({
      where: { id: transitionId },
    });
    if (!transitionInformation) {
      throw new NotFoundException(
        'Invalid transition id. Transition not found.',
      );
    }
  }

  private async validateConditionTypeId(conditionTypeId: number) {
    const conditionTypeInformation =
      await this.prisma.conditionTypeStatic.findUnique({
        where: { id: conditionTypeId },
      });
    if (!conditionTypeInformation) {
      throw new NotFoundException(
        'Invalid condition type id. Condition type not found.',
      );
    }
  }

  private async validateActionTypeId(actionTypeId: number) {
    const actionTypeInformation = await this.prisma.actionTypeStatic.findUnique(
      {
        where: { id: actionTypeId },
      },
    );
    if (!actionTypeInformation) {
      throw new NotFoundException(
        'Invalid action type id. Action Type not found.',
      );
    }
  }

  private async validateStateTypeId(stateTypeId: number) {
    const stateType = await this.prisma.stateTypeStatic.findUnique({
      where: { id: stateTypeId },
    });
    if (!stateType) {
      throw new NotFoundException('Invalid stateTypeId. State type not found.');
    }
  }

  async addTransitions(createTransitionDto: CreateTransitionsDto) {
    const transitionData: Prisma.TransitionsCreateInput = {
      name: createTransitionDto.name,
      description: createTransitionDto.description,
      workflow: { connect: { id: createTransitionDto.workflowId } },
    };
    const transitionResponse = await this.prisma.transitions.create({
      data: transitionData,
    });

    const stateTransitionResponse = transitionResponse
      ? await this.createStateTransition(
          createTransitionDto.currentStateId,
          createTransitionDto.nextStateId,
          transitionResponse.id,
          createTransitionDto.workflowId,
        )
      : null;

    return { transitionResponse, stateTransitionResponse };
  }

  async createStateTransition(
    currentStateId: number,
    nextStateId: number,
    transitionId: number,
    workflowId: number,
  ) {
    if (currentStateId === nextStateId) {
      throw new BadRequestException(
        'currentStateId must not be equal to nextStateId',
      );
    }
    await this.validateStateId(currentStateId);
    await this.validateStateId(nextStateId);
    await this.ensureStateHasWorkflow(currentStateId, workflowId);
    await this.ensureStateHasWorkflow(nextStateId, workflowId);

    const stateTransitionData: Prisma.StateTransitionsCreateInput = {
      currentState: { connect: { id: currentStateId } },
      nextState: { connect: { id: nextStateId } },
      transition: { connect: { id: transitionId } },
    };

    return await this.prisma.stateTransitions.create({
      data: stateTransitionData,
    });
  }

  private async ensureStateHasWorkflow(stateId: number, workflowId: number) {
    const stateInformation = await this.prisma.state.findUnique({
      where: { id: stateId },
    });
    const stateHasWorkflow = await this.prisma.state.findFirst({
      where: { name: stateInformation.name, workflowId: workflowId },
    });

    if (!stateHasWorkflow) {
      const stateInformation = await this.prisma.state.findUnique({
        where: { id: stateId },
      });
      await this.prisma.state.create({
        data: {
          name: stateInformation.name,
          description: stateInformation.description,
          stateType: { connect: { id: stateInformation.stateTypeId } },
          workflow: { connect: { id: workflowId } },
        },
      });
    }
  }

  async addActionToTransition(
    actionCreateDto: CreateActionDto,
  ): Promise<ActionCreateResponse> {
    const actionData: Prisma.ActionCreateInput = {
      name: actionCreateDto.name,
      description: actionCreateDto.description,
      transition: { connect: { id: actionCreateDto.transitionId } },
      actionType: { connect: { id: actionCreateDto.actionTypeId } },
    };

    await this.validateTransitionId(actionCreateDto.transitionId);
    await this.validateActionTypeId(actionCreateDto.actionTypeId);

    const actionResponse = await this.prisma.action.create({
      data: actionData,
    });

    return plainToClass(ActionCreateResponse, actionResponse);
  }

  async addConditionToTransition(conditionCreateDto: CreateConditionDto) {
    const conditionData: Prisma.ConditionCreateInput = {
      name: conditionCreateDto.name,
      description: conditionCreateDto.description,
      transition: { connect: { id: conditionCreateDto.transitionId } },
      conditionType: { connect: { id: conditionCreateDto.conditionTypeId } },
    };

    await this.validateTransitionId(conditionCreateDto.transitionId);
    await this.validateConditionTypeId(conditionCreateDto.conditionTypeId);

    const conditionResponse = await this.prisma.condition.create({
      data: conditionData,
    });

    return plainToClass(ConditionCreateResponse, conditionResponse);
  }
}
