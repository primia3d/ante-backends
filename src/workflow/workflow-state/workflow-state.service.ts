import { Inject, Injectable } from '@nestjs/common';
import {
  WorkflowStateCreateDto,
  WorkflowStateIdDto,
  WorkflowStateListDto,
  WorkflowStateUpdateDto,
} from 'dto/workflow-state.validator.dto';
import { PrismaService } from 'lib/prisma.service';
import { TableHandlerService } from 'lib/table.handler/table.handler.service';
import { UtilityService } from 'lib/utility.service';
import { WorkflowService } from '../workflow.service';
import { Prisma } from '@prisma/client';
import {
  WorkflowStateInterface,
  WorkflowStateResponseInterface,
} from 'interfaces/workflow.interface';
import { connect } from 'http2';
@Injectable()
export class WorkflowStateService extends WorkflowService {
  @Inject() public utilityService: UtilityService;
  @Inject() public prisma: PrismaService;
  @Inject() public tableHandlerService: TableHandlerService;

  async createStatePerWorkflow(createWorkflowStateDto: WorkflowStateCreateDto) {
    await this.validateWorkflowId(createWorkflowStateDto.workflowId);
    await this.validateWorkflowStateTypeId(
      createWorkflowStateDto.workflowStateTypeId,
    );
    const createWorkflowStateData: Prisma.WorkflowStateCreateInput = {
      workflow: { connect: { id: createWorkflowStateDto.workflowId } },
      workflowStateType: {
        connect: { id: createWorkflowStateDto.workflowStateTypeId },
      },
      name: createWorkflowStateDto.name,
      description: createWorkflowStateDto.description,
    };

    const createWorkflowStateResponse = await this.prisma.workflowState.create({
      data: createWorkflowStateData,
      include: {
        workflow: true,
        workflowStateType: true,
      },
    });
    return this.utilityService.formatData(
      createWorkflowStateResponse,
      'workflowState',
    );
  }

  async findAllStatePerWorkflow(
    workflowStateListDto: WorkflowStateListDto,
  ): Promise<WorkflowStateResponseInterface> {
    const { page = 1, perPage = 5, workflowId, name } = workflowStateListDto;
    const skip = (page - 1) * perPage;
    const take = perPage;

    await this.validateWorkflowId(workflowId);

    const where: Prisma.WorkflowStateWhereInput = {
      workflowId,
      ...(name && { name: { contains: name, mode: 'insensitive' } }),
    };

    const workflowStateList = await this.prisma.workflowState.findMany({
      where,
      skip,
      take,
      include: {
        workflow: true,
        workflowStateType: true,
      },
    });

    return { list: workflowStateList };
  }

  async findStateInformationPerWorkflow(
    workflowStateDto: WorkflowStateIdDto,
  ): Promise<WorkflowStateInterface> {
    const { id } = workflowStateDto;
    await this.validateWorkflowStateId(id);
    const workflowStateInformation = await this.prisma.workflowState.findUnique(
      {
        where: { id },
        include: {
          workflow: true,
          workflowStateType: true,
        },
      },
    );

    return workflowStateInformation;
  }

  async updateWorkflowStateInformation(
    workflowStateUpdateDto: WorkflowStateUpdateDto,
  ): Promise<WorkflowStateInterface> {
    await this.validateWorkflowStateId(workflowStateUpdateDto.id);
    workflowStateUpdateDto.workflowId &&
      (await this.validateWorkflowId(workflowStateUpdateDto.workflowId));
    workflowStateUpdateDto.workflowStateTypeId &&
      (await this.validateWorkflowStateTypeId(
        workflowStateUpdateDto.workflowStateTypeId,
      ));

    const updateWorkflowStateData: Prisma.WorkflowStateUpdateInput = {
      name: workflowStateUpdateDto.name,
      description: workflowStateUpdateDto.description,
      ...(workflowStateUpdateDto.workflowId && {
        workflow: { connect: { id: workflowStateUpdateDto.workflowId } },
      }),
      ...(workflowStateUpdateDto.workflowStateTypeId && {
        workflowStateType: {
          connect: { id: workflowStateUpdateDto.workflowStateTypeId },
        },
      }),
    };

    const updateArguments: Prisma.WorkflowStateUpdateArgs = {
      where: { id: workflowStateUpdateDto.id },
      data: updateWorkflowStateData,
      include: {
        workflow: true,
        workflowStateType: true,
      },
    };

    const updatedWorkflowStateInformation =
      await this.prisma.workflowState.update(updateArguments);

    return updatedWorkflowStateInformation as WorkflowStateInterface;
  }

  async removeWorkflowStatePerWorkflow(
    deleteWorkflowStateDto: WorkflowStateIdDto,
  ): Promise<WorkflowStateInterface> {
    const { id } = deleteWorkflowStateDto;
    await this.validateWorkflowStateId(id);

    const deleteArguments: Prisma.WorkflowStateDeleteArgs = {
      where: { id },
      include: {
        workflow: true,
        workflowStateType: true,
      },
    };

    const deletedWorkflowState =
      await this.prisma.workflowState.delete(deleteArguments);
    return deletedWorkflowState as WorkflowStateInterface;
  }
}
