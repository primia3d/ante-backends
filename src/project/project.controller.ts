import {
  Controller,
  Body,
  HttpStatus,
  Inject,
  Post,
  Response as NestResponse,
  Query,
  Put,
  Get,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ProjectCreateDto } from 'dto/project.validator.dto';
import { ProjectService } from './project.service';
import { ClientService } from '@/client/client.service';
import { UtilityService } from 'lib/utility.service';
import { TableBodyDTO, TableQueryDTO } from 'lib/table.dto/table.dto';
import {
  ProjectIdDto,
  ProjectUpdateDto,
  ProjectDeleteDto,
} from 'dto/project.validator.dto';
import { HasRoleScopeGuard } from 'guards/has-role-scope.guard';

@UseGuards(HasRoleScopeGuard)
@Controller('project')
export class ProjectController {
  @Inject() public projectService: ProjectService;
  @Inject() public clientService: ClientService;
  @Inject() public utilityService: UtilityService;

  @Post()
  async create(
    @Body() createProjectDto: ProjectCreateDto,
    @NestResponse() response: Response,
  ) {
    try {
      const newClient = await this.clientService.createClient(
        createProjectDto.clientInformation,
      );
      const newProject = await this.projectService.createProject(
        createProjectDto,
        newClient['id'],
      );

      response.status(HttpStatus.CREATED).json({
        message: 'Project created successfully',
        projectInformation: newProject,
      });
    } catch (error) {
      return this.utilityService.errorResponse(
        response,
        error,
        'Error in creating Project',
      );
    }
  }

  @Put()
  async table(
    @NestResponse() response: Response,
    @Query() query: TableQueryDTO,
    @Body() body: TableBodyDTO,
  ) {
    try {
      const projectInformation = await this.projectService.projectTable(
        query,
        body,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Project table successfully fetched.',
        projectInformation,
      });
    } catch (error) {
      return this.utilityService.errorResponse(
        response,
        error,
        'Project table cannot be fetched.',
      );
    }
  }

  @Get()
  async getProjectInformation(
    @NestResponse() response: Response,
    @Query() parameters: ProjectIdDto,
  ) {
    try {
      const projectInformation =
        await this.projectService.getProjectInformationByID(parameters);
      return response.status(HttpStatus.OK).json({
        message: 'Project Information successfully fetched.',
        projectInformation,
      });
    } catch (error) {
      return this.utilityService.errorResponse(
        response,
        error,
        'Project information cannot be retrieved.',
      );
    }
  }

  @Patch()
  async updateProjectInformation(
    @NestResponse() response: Response,
    @Body() parameters: ProjectUpdateDto,
  ) {
    try {
      const projectInformation =
        await this.projectService.updateProjectInformation(parameters);
      return response.status(HttpStatus.OK).json({
        message: 'Project information successfully updated.',
        projectInformation,
      });
    } catch (error) {}
  }

  @Delete()
  async delete(
    @NestResponse() response: Response,
    @Body() parameters: ProjectDeleteDto,
  ) {
    try {
      const projectInformation =
        await this.projectService.deleteProject(parameters);
      return response.status(HttpStatus.OK).json({
        message: 'Project information successfully deleted.',
        projectInformation,
      });
    } catch (error) {
      return this.utilityService.errorResponse(
        response,
        error,
        'Project information cannot be deleted.',
      );
    }
  }
}
