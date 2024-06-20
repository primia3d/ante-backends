import {
  Controller,
  Post,
  Response as NestResponse,
  Inject,
  HttpStatus,
  Body,
  Get,
  Query,
  Patch,
  Put,
} from '@nestjs/common';
import { Response } from 'express';
import { UtilityService } from 'lib/utility.service';
import { TaskService } from './task.service';
import {
  TaskCreateDto,
  TaskFilterDto,
  TaskIdDto,
} from 'dto/task.validator.dto';

@Controller('task')
export class TaskController {
  @Inject() public utilityService: UtilityService;
  @Inject() public taskService: TaskService;

  @Post('create')
  async createTask(
    @NestResponse() response: Response,
    @Body() taskCreateDto: TaskCreateDto,
    @Body('collaboratorAccountIds') collaboratorDto?: string[],
  ) {
    try {
      const newTask = await this.taskService.createAndAssignTask(
        taskCreateDto,
        collaboratorDto,
      );

      response.status(HttpStatus.CREATED).json({
        message: 'Task created successfully',
        taskInformation: newTask,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: error.message,
      });
    }
  }

  @Get('own-task')
  async getOwnTaskList(
    @NestResponse() response: Response,
    @Query() taskFilter: TaskFilterDto,
  ) {
    try {
      const taskList = await this.taskService.getTaskByLoggedInUser(taskFilter);
      return response.status(HttpStatus.OK).json({
        message: 'Task list successfully fetched.',
        taskList,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: error.message,
      });
    }
  }

  @Get('quest-task')
  async getUnAssignedTaskList(
    @NestResponse() response: Response,
    @Query() taskFilter: TaskFilterDto,
  ) {
    try {
      const unAssignedTaskList =
        await this.taskService.getUnAssignedTask(taskFilter);
      return response.status(HttpStatus.OK).json({
        message: 'Unassigned task list successfully fetched.',
        unAssignedTaskList,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: error.message,
      });
    }
  }

  @Get('task-by-id')
  async getTaskById(
    @NestResponse() response: Response,
    @Query() taskFilter: { id: string },
  ) {
    try {
      const taskInformation = await this.taskService.getTaskById(taskFilter);
      return response.status(HttpStatus.OK).json({
        message: 'Task information successfully fetched.',
        taskInformation,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: error.message,
      });
    }
  }

  @Patch('/read')
  async readTask(
    @NestResponse() response: Response,
    @Query('id') taskId: string,
  ) {
    try {
      const taskInformation = await this.taskService.readTask({ id: taskId });
      return response.status(HttpStatus.OK).json({
        message: 'Task successfully read.',
        taskInformation,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: error.message,
      });
    }
  }

  @Put('start-task')
  async startTask(
    @NestResponse() response: Response,
    @Body() taskId: TaskIdDto,
  ) {
    try {
      const updatedTaskInformation = await this.taskService.moveTask(
        taskId,
        'IN_PROGRESS',
      );

      return response.status(HttpStatus.OK).json({
        message: 'Task successfully moved to in Progress.',
        updatedTaskInformation,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: error.response.statusCode,
        error: 'Bad Request',
        message: error.message,
      });
    }
  }

  @Put('mark-task-done')
  async markTaskAsDone(
    @NestResponse() response: Response,
    @Body() taskId: TaskIdDto,
  ) {
    try {
      const updatedTaskInformation = await this.taskService.moveTask(
        taskId,
        'DONE',
      );

      return response.status(HttpStatus.OK).json({
        message: 'Task successfully moved to Done.',
        updatedTaskInformation,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: error.response.statusCode,
        error: 'Bad Request',
        message: error.message,
      });
    }
  }

  @Put('move-task-to-backlog')
  async moveTaskToBacklog(
    @NestResponse() response: Response,
    @Body() taskId: TaskIdDto,
  ) {
    try {
      const updatedTaskInformation = await this.taskService.moveTask(
        taskId,
        'BACKLOG',
      );

      return response.status(HttpStatus.OK).json({
        message: 'Task successfully moved to Backlog.',
        updatedTaskInformation,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: error.response.statusCode,
        error: 'Bad Request',
        message: error.message,
      });
    }
  }
}
