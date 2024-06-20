import { BoardLaneService } from '@/board-lane/board-lane.service';
import { NotificationService } from '@/notification/notification.service';
import { ProjectService } from '@/project/project.service';
import { SocketService } from '@/socket/socket.service';
import { formatDistanceToNowStrict } from 'date-fns';
import {
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import {
  TaskAssignToIdDto,
  TaskCreateDto,
  TaskDeleteDto,
  TaskFilterDto,
  TaskUpdateDto,
  TaskWatcherDto,
} from 'dto/task.validator.dto';
import { CustomWsException } from 'filters/custom-ws.exception';
import { CombinedTaskResponseInterface } from 'interfaces/task.interface';
import { PrismaService } from 'lib/prisma.service';
import { UtilityService } from 'lib/utility.service';


@Injectable()
export class TaskService {
  @Inject() public utilityService: UtilityService;
  @Inject() public prisma: PrismaService;
  @Inject() public socketService: SocketService;
  @Inject() public projectService: ProjectService;
  @Inject() public boardLaneService: BoardLaneService;
  @Inject() public notificationService: NotificationService;

  async createTask(createTaskDto: TaskCreateDto) {
    const taskCreateDtoInstance = plainToClass(TaskCreateDto, createTaskDto);
    const errors = await validate(taskCreateDtoInstance);
    if (errors.length > 0)
      throw new CustomWsException(
        400,
        'Validation failed',
        'VALIDATION_FAILED',
      );
    const accountInformation = this.utilityService.accountInformation;
    const additionalParameters = {
      createdById: accountInformation.id,
      updatedBy: accountInformation.id,
      order: await this.getNextTaskOrder(createTaskDto.boardLaneId),
    };

    const createTaskLaneData: Prisma.TaskCreateInput = {
      title: createTaskDto.title,
      description: createTaskDto.description,
      createdBy: { connect: { id: additionalParameters.createdById } },
      updatedBy: { connect: { id: additionalParameters.updatedBy } },
      order: additionalParameters.order,
      boardLane: { connect: { id: createTaskDto.boardLaneId } },
      project: { connect: { id: createTaskDto.projectId } },
    };

    const createResponse = await this.prisma.task.create({
      data: createTaskLaneData,
    });
    return createResponse;
  }

  private async getNextTaskOrder(boardLaneId: number): Promise<number> {
    const highestOrderInBoardLane = await this.prisma.task.findMany({
      where: { boardLaneId: boardLaneId },
      orderBy: { order: 'desc' },
      take: 1,
    });

    const nextOrder =
      highestOrderInBoardLane.length > 0
        ? highestOrderInBoardLane[0].order + 1
        : 1;

    return nextOrder;
  }

  async updateTaskInformation(taskUpdateDto: TaskUpdateDto) {
    const taskUpdateDtoInstance = plainToClass(TaskUpdateDto, taskUpdateDto);
    const errors = await validate(taskUpdateDtoInstance);
    if (errors.length > 0)
      throw new CustomWsException(
        400,
        'Validation failed',
        'VALIDATION_FAILED',
      );
    const taskUpdateData: Prisma.TaskUpdateInput = {
      title: taskUpdateDto.title,
      updatedBy: { connect: { id: taskUpdateDto.updatedById } },
    };

    const updateResponse = await this.prisma.task.update({
      where: { id: taskUpdateDto.id },
      data: taskUpdateData,
    });

    return updateResponse;
  }

  async deleteTask(deleteTaskDto: TaskDeleteDto) {
    const taskDeleteDtoInstance = plainToClass(TaskDeleteDto, deleteTaskDto);

    const errors = await validate(taskDeleteDtoInstance);
    if (errors.length > 0)
      throw new CustomWsException(
        400,
        'Validation failed',
        'VALIDATION_FAILED',
      );

    const deleteResponse = await this.prisma.task.update({
      where: { id: deleteTaskDto.id },
      data: { isDeleted: true },
    });

    return deleteResponse;
  }

  async reOrderTaskVertical(containerArray) {
    await Promise.all(
      containerArray.map(async (item, index) => {
        const newOrder = index + 1;

        for (const subItem of item.items) {
          const task = await this.prisma.task.findUnique({
            where: { id: subItem.id },
          });

          if (!task) {
            throw new Error(`Task with id ${subItem.id} not found.`);
          }

          await this.prisma.task.update({
            where: { id: task.id },
            data: { order: newOrder },
          });
        }
      }),
    );
  }

  /**
   * Creates a task for the logged-in user.
   * @param createTaskDto The data for the new task.
   * @param collaboratorIds Optional array of IDs for the collaborators to be created.
   * @returns The newly created task.
   */

  async createAndAssignTask(
    createTaskDto: TaskCreateDto,
    collaboratorIds?: string[],
  ): Promise<CombinedTaskResponseInterface> {
    const assignedToId = this.getAssignedToId(createTaskDto);
    const dueDate = createTaskDto.dueDate
      ? new Date(createTaskDto.dueDate)
      : new Date();

    const newTaskData: Prisma.TaskCreateInput = {
      title: createTaskDto.title,
      description: createTaskDto.description,
      dueDate: dueDate,
      createdBy: { connect: { id: this.utilityService.accountInformation.id } },
      updatedBy: { connect: { id: this.utilityService.accountInformation.id } },
      order: await this.getNextTaskOrder(createTaskDto.boardLaneId),
      boardLane: { connect: { id: createTaskDto.boardLaneId } },
      project: { connect: { id: createTaskDto.projectId } },
    };

    if (assignedToId) {
      newTaskData.assignedTo = { connect: { id: assignedToId } };
    }

    const checkProjectId = await this.projectService.checkIfProjectExists(
      createTaskDto.projectId,
    );
    if (!checkProjectId)
      throw new NotFoundException('Project Id is not existing in the database');

    const checkBoardLaneId = await this.boardLaneService.checkIfBoardLaneExists(
      createTaskDto.boardLaneId,
    );
    if (!checkBoardLaneId)
      throw new NotFoundException(
        'Board Lane Id is not existing in the database',
      );

    const createResponse = await this.prisma.task.create({
      data: newTaskData,
    });

    await this.addCollaborators(collaboratorIds, createResponse.id);

    const collaborators = await this.prisma.collaborators.findMany({
      where: { taskId: createResponse.id },
    });

    let allAccountIds = [assignedToId];
    if (Array.isArray(collaboratorIds)) {
      allAccountIds = [...allAccountIds, ...collaboratorIds];
    }

    const projectInformation =
      await this.projectService.fetchProjectInformation(
        createResponse.projectId,
      );

    const enhancedResponse = {
      ...createResponse,
      collaborators: collaborators,
      projectInformation: projectInformation,
    };

    if (createResponse) {
      const { id: accountId } = this.utilityService.accountInformation;
      const sockets = this.socketService.getSocketsByAccountId(accountId);
      const { projectInformation } = enhancedResponse;

      const notification =
        await this.notificationService.createProjectNotification(
          projectInformation.name,
        );

      if (allAccountIds[0] != null) {
        await this.addToTaskWatcher({
          accountIds: allAccountIds,
          taskId: createResponse.id,
        });

        await this.notificationService.createTaskProjectNotificationsForAccounts(
          notification.id,
          projectInformation,
          createResponse,
          allAccountIds,
        );

        if (sockets && sockets.length > 0) {
          const rooms = Array.from(sockets[0].rooms.values());
          const projectTopic = rooms.find(
            (room) => room === projectInformation.name,
          );

          await this.socketService.broadcastToRoom(
            projectTopic,
            'BROADCAST_TASK_CREATED',
            `New task has been created under Project ${projectTopic}`,
          );
        }
      }
    }

    return enhancedResponse;
  }

  /**
   * Creates collaborators for a specific task.
   * @param collaboratorIds Array of IDs for the collaborators to be created.
   * @param taskId The ID of the task for which collaborators are being created.
   */
  private async addCollaborators(
    collaboratorIds: string[],
    taskId: number,
  ): Promise<void> {
    if (collaboratorIds && collaboratorIds.length > 0) {
      try {
        const allExist = await this.checkAllAccountIdsExist(collaboratorIds);
        if (!allExist) {
          throw new HttpException(
            'Account Id does not exist',
            HttpStatus.BAD_REQUEST,
          );
        }

        await this.prisma.$transaction(
          collaboratorIds.map((accountId) =>
            this.prisma.collaborators.create({
              data: {
                taskId: taskId,
                accountId: accountId.toString(),
              },
            }),
          ),
        );
      } catch (error) {
        if (
          error instanceof HttpException &&
          error.getStatus() === HttpStatus.BAD_REQUEST
        ) {
          throw error;
        } else {
          throw new HttpException(
            'Failed to add collaborators',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    }
  }

  private async checkAllAccountIdsExist(
    accountIds: string[],
  ): Promise<boolean> {
    const allExist = await Promise.all(
      accountIds.map(async (accountId) => {
        const account = await this.prisma.account.findUnique({
          where: { id: accountId.toString() },
        });
        return !!account;
      }),
    );

    return allExist.every(Boolean);
  }

  private getAssignedToId(
    taskAssignedToIdDto: TaskAssignToIdDto,
  ): string | null {
    let assignedToId: string | null = null;
    switch (taskAssignedToIdDto.assignedMode) {
      case 'assign_to_self':
        assignedToId = this.utilityService.accountInformation.id;
        break;
      case 'assign_to_others':
        assignedToId = taskAssignedToIdDto.assignedToId || null;
        break;
      default:
        assignedToId = taskAssignedToIdDto.assignedToId || null;
    }

    return assignedToId;
  }

  async addToTaskWatcher(taskWatcherDto: TaskWatcherDto): Promise<void> {
    await Promise.all(
      taskWatcherDto.accountIds.map(async (accountId) => {
        await this.prisma.taskWatcher.create({
          data: {
            taskId: taskWatcherDto.taskId,
            accountId: accountId,
          },
        });
      }),
    );
  }

  async getTaskByLoggedInUser(taskFilter: TaskFilterDto) {
    const { id } = this.utilityService.accountInformation;

  if (taskFilter.projectId) {
    taskFilter.projectId = Number(taskFilter.projectId);
  }

  const query = {
    assignedToId: id,
    isDeleted: false,
  };

  if (taskFilter.projectId) {
    query['projectId'] = taskFilter.projectId;
  }

  const taskList = await this.prisma.task.findMany({
    where: query,
    include: {
      assignedTo: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      createdBy: {
        select: {
          firstName: true,
          lastName: true,
          image: true,
        },
      },
      boardLane: {
        select: {
          name: true,
        },
      },
    },
  });

  return taskList.map(task => ({
    ...task,
    assignedTo: task.assignedTo
      ? {
          name: `${task.assignedTo.firstName} ${task.assignedTo.lastName}`,
        }
      : null,
    createdBy: task.createdBy
      ? {
          name: `${task.createdBy.firstName} ${task.createdBy.lastName}`,
          image: task.createdBy.image, 
        }
      : null,
    boardLane: task.boardLane ? { name: task.boardLane.name } : null,
    timeAgo: formatDistanceToNowStrict(new Date(task.createdAt), { addSuffix: true }),
  }));
  }

  async getUnAssignedTask(taskFilter: TaskFilterDto) {
    if (taskFilter.projectId) {
      taskFilter.projectId = Number(taskFilter.projectId);
    }
    const query = {
      assignedToId: null,
      isDeleted: false,
    };

    if (taskFilter.projectId) {
      query['projectId'] = taskFilter.projectId;
    }

    const unAssignedTaskList = await this.prisma.task.findMany({
      where: query,
    });
    return unAssignedTaskList;
  }

  async getTaskById(taskFilter: { id: string }) {
    const taskId = Number(taskFilter.id);
    const query = {
      id: taskId,
    };

    if (taskFilter.id) {
      query['id'] = taskId;
    }

    const taskInformation = await this.prisma.task.findUnique({
      where: query,
    });
    return taskInformation;
  }

  async readTask(taskFilter: { id: string }) {
    const task = await this.getTaskById(taskFilter);

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskFilter.id} not found.`);
    }

    const updateParameters: Prisma.TaskUpdateInput = {
      isRead: true,
    };

    const readTask = await this.prisma.task.update({
      where: { id: task.id },
      data: updateParameters,
    });   

    const taskInformation = await this.prisma.task.findUnique({
      where: readTask,
    });
    return taskInformation;  
  }
}
