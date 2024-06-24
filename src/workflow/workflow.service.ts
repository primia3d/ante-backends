import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  WorkflowCreateDto,
  WorkflowIdDto,
  WorkflowUpdateDto,
} from '../../dto/workflow.validator.dto';
import { UtilityService } from 'lib/utility.service';
import { PrismaService } from 'lib/prisma.service';
import { TableHandlerService } from 'lib/table.handler/table.handler.service';
import { Prisma } from '@prisma/client';
import { TableBodyDTO, TableQueryDTO } from 'lib/table.dto/table.dto';
@Injectable()
export class WorkflowService {
  @Inject() public utilityService: UtilityService;
  @Inject() public prisma: PrismaService;
  @Inject() public tableHandlerService: TableHandlerService;

  async create(workflowCreateDto: WorkflowCreateDto) {
    const createWorkflowData: Prisma.WorkflowCreateInput = {
      name: workflowCreateDto.name,
      description: workflowCreateDto.description,
    };

    const createWorkflowResponse = await this.prisma.workflow.create({
      data: createWorkflowData,
    });

    return this.utilityService.formatData(createWorkflowResponse, 'workflow');
  }

  async findAll(query: TableQueryDTO, body: TableBodyDTO) {
    this.tableHandlerService.initialize(query, body, 'workflow');
    const tableQuery = this.tableHandlerService.constructTableQuery();
    const {
      list: baseList,
      currentPage,
      pagination,
    } = await this.tableHandlerService.getTableData(
      this.prisma.workflow,
      query,
      tableQuery,
    );

    const list = await this.utilityService.mapFormatData(baseList, 'workflow');
    return { list, pagination, currentPage };
  }

  async findOne(id: number) {
    await this.validateWorkflowId(id);
    const workflowInformation = await this.prisma.workflow.findFirst({
      where: { id },
    });

    return this.utilityService.formatData(workflowInformation, 'workflow');
  }

  async update(workflowUpdateDto: WorkflowUpdateDto) {
    await this.validateWorkflowId(workflowUpdateDto.id);
    const updateWorkflowData: Prisma.WorkflowUpdateInput = {
      name: workflowUpdateDto.name,
      description: workflowUpdateDto.description,
    };

    const updateWorkflowResponse = await this.prisma.workflow.update({
      where: { id: workflowUpdateDto.id },
      data: updateWorkflowData,
    });

    return this.utilityService.formatData(updateWorkflowResponse, 'workflow');
  }

  async remove(deleteWorkflowDto: WorkflowIdDto) {
    await this.validateWorkflowId(deleteWorkflowDto.id);
    const updateArguments: Prisma.WorkflowUpdateArgs = {
      where: { id: deleteWorkflowDto.id },
      data: { isDeleted: true },
    };
    const updatedWorkflowInformation =
      await this.prisma.workflow.update(updateArguments);
    return this.utilityService.formatData(
      updatedWorkflowInformation,
      'workflow',
    );
  }

  private async validateEntityById<T>(
    id: number,
    entity: {
      findFirst: (args: { where: { id: number } }) => Promise<T | null>;
    },
    errorMessage: string,
  ) {
    const entityInformation = await entity.findFirst({
      where: { id },
    });

    if (!entityInformation) {
      throw new NotFoundException(errorMessage);
    }
    return true;
  }

  protected async validateWorkflowId(id: number) {
    return this.validateEntityById(
      id,
      this.prisma.workflow,
      'Workflow Information is not existing',
    );
  }

  protected async validateWorkflowStateTypeId(id: number) {
    return this.validateEntityById(
      id,
      this.prisma.workflowStateTypeStatic,
      'State Type Information is not existing',
    );
  }

  protected async validateWorkflowStateId(id: number) {
    return this.validateEntityById(
      id,
      this.prisma.workflowState,
      'State Information is not existing',
    );
  }
}
