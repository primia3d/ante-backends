import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class WorkflowStateCreateDto {
  @IsNotEmpty()
  @IsNumber()
  readonly workflowId: number;

  @IsNotEmpty()
  @IsNumber()
  readonly workflowStateTypeId: number;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;
}

export class WorkflowStateIdDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly id: number;
}

export class WorkflowStateUpdateDto {
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;

  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsNumber()
  readonly workflowId: number;

  @IsOptional()
  @IsNumber()
  readonly workflowStateTypeId: number;
}

export class WorkflowStateListDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly page: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly perPage: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly workflowId: number;

  @IsOptional()
  @IsString()
  name?: string;
}
