import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ClientCreateDTO } from './client.validator.dto';
import { IsDateGreaterThan } from './validators/date-range.validator';

enum ProjectStatus {
  PROJECT = 'PROJECT',
  LEAD = 'LEAD',
}

export class ProjectCreateDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  readonly budget: number;

  @IsNotEmpty()
  @IsDateString()
  readonly startDate: string;

  @IsNotEmpty()
  @IsDateString()
  @IsDateGreaterThan('startDate')
  readonly endDate: string;

  @IsNotEmpty()
  readonly status: ProjectStatus;

  @IsNotEmpty()
  readonly clientInformation: ClientCreateDTO;
}

export class ProjectUpdateDto {
  @IsNotEmpty()
  readonly id: string;

  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsNumber()
  @IsOptional()
  readonly budget?: number;

  @IsDateString()
  @IsOptional()
  readonly startDate?: Date;

  @IsDateString()
  @IsOptional()
  @IsDateGreaterThan('startDate')
  readonly endDate?: Date;
}

export class ProjectIdDto {
  @IsNotEmpty()
  readonly id: string;
}

export class ProjectDeleteDto {
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsNotEmpty()
  readonly id: string;
}
