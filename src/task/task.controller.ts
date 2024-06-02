import {
  Controller,
  Post,
  Response as NestResponse,
  Inject,
  HttpStatus,
  Body,
  Get,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { UtilityService } from 'lib/utility.service';
import { TaskService } from './task.service';
import { TaskCreateDto, TaskFilterDto } from 'dto/task.validator.dto';

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
}
