import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'lib/prisma.service';
import { UtilityService } from 'lib/utility.service';
import { TableQueryDTO, TableBodyDTO } from 'lib/table.dto/table.dto';
import { TableHandlerService } from 'lib/table.handler/table.handler.service';
import {
  ProjectCreateDto,
  ProjectUpdateDto,
  ProjectDeleteDto,
} from 'dto/project.validator.dto';
import configReference from 'reference/config.reference';

@Injectable()
export class ProjectService {
  @Inject() public utilityService: UtilityService;
  @Inject() public prisma: PrismaService;
  @Inject() public tableHandlerService: TableHandlerService;

  async createProject(projectDto: ProjectCreateDto, clientId: string) {
    const createProjectData: Prisma.ProjectCreateInput = {
      name: projectDto.name,
      description: projectDto.description,
      budget: projectDto.budget,
      client: {
        connect: {
          id: clientId,
        },
      },
      startDate: new Date(projectDto.startDate),
      endDate: new Date(projectDto.endDate),
      status: projectDto.status,
    };

    const createResponse = await this.prisma.project.create({
      data: createProjectData,
    });

    return this.utilityService.formatData(createResponse, 'project');
  }

  async projectTable(query: TableQueryDTO, body: TableBodyDTO) {
    this.tableHandlerService.initialize(query, body, 'project');
    const tableQuery = this.tableHandlerService.constructTableQuery();
    tableQuery['relationLoadStrategy'] = 'join';
    tableQuery['include'] = { client: true };
    const {
      list: baseList,
      currentPage,
      pagination,
    } = await this.tableHandlerService.getTableData(
      this.prisma.project,
      query,
      tableQuery,
    );

    const list = await this.utilityService.mapFormatData(baseList, 'project');
    for (const items of list) {
      const now = new Date();
      const startDate = new Date(items.startDate.raw);
      const endDate = new Date(items.endDate.raw);
      items['computedDate'] = this.calculateDaysRemaining(
        now,
        startDate,
        endDate,
      );
    }

    return { list, pagination, currentPage };
  }

  async getProjectInformationByID({ id }) {
    const intId = parseInt(id, 10);

    const projectInformation = await this.prisma.project.findFirst({
      where: { id: intId },
      include: {
        client: true,
      },
    });
    const now = new Date();
    const startDate = new Date(projectInformation.startDate);
    const endDate = new Date(projectInformation.endDate);
    projectInformation['computedDate'] = this.calculateDaysRemaining(
      now,
      startDate,
      endDate,
    );

    return this.utilityService.formatData(projectInformation, 'project');
  }

  private calculateDaysRemaining(
    now: Date,
    startDate: Date,
    endDate: Date,
  ): string {
    const currentTime = now.getTime();
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();

    const totalDurationInDays = Math.ceil(
      (endTime - startTime) / (1000 * 60 * 60 * 24),
    );

    const remainingDurationInDays =
      currentTime < startTime
        ? totalDurationInDays
        : Math.ceil((endTime - currentTime) / (1000 * 60 * 60 * 24));

    const formatDuration = (totalDays, remainingDays) => {
      if (totalDays < 30) {
        return `${totalDays} days (${remainingDays} days remaining)`;
      } else {
        const totalMonths = Math.ceil(totalDays / 30);
        const remainingMonths = Math.ceil(remainingDays / 30);
        return `${totalMonths} months (${remainingMonths} months remaining)`;
      }
    };

    const conditions = [
      {
        condition: () => currentTime < startTime,
        message: () =>
          formatDuration(totalDurationInDays, remainingDurationInDays),
      },
      {
        condition: () => currentTime >= startTime && currentTime < endTime,
        message: () =>
          formatDuration(totalDurationInDays, remainingDurationInDays),
      },
      {
        condition: () => currentTime >= endTime,
        message: () => 'Project has ended',
      },
    ];

    const condition = conditions.find((c) => c.condition());
    return condition ? condition.message() : '';
  }

  async updateProjectInformation(projectUpdateDto: ProjectUpdateDto) {
    const updateProjectData: Prisma.ProjectUpdateInput = {
      name: projectUpdateDto.name,
      description: projectUpdateDto.description,
      budget: projectUpdateDto.budget,
      startDate: new Date(projectUpdateDto.startDate),
      endDate: new Date(projectUpdateDto.endDate),
    };

    const updateResponse = await this.prisma.project.update({
      where: { id: parseInt(projectUpdateDto.id) },
      data: updateProjectData,
    });
    return this.utilityService.formatData(updateResponse, 'project');
  }

  async deleteProject(projectDeleteDto: ProjectDeleteDto) {
    if (projectDeleteDto.password !== configReference.default_password)
      throw new BadRequestException(
        'Invalid password provided for project deletion.',
      );

    const deleteResponse = await this.prisma.project.update({
      where: { id: parseInt(projectDeleteDto.id) },
      data: { isDeleted: true },
    });
    return this.utilityService.formatData(deleteResponse, 'project');
  }

  async checkIfProjectExists(projectId: number): Promise<boolean> {
    const projectInformation = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    return !!projectInformation;
  }

  async fetchProjectInformation(projectId: number) {
    const projectInformation = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    return projectInformation;
  }
}
