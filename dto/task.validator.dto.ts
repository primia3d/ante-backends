import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsDateString,
} from 'class-validator';
export class TaskCreateDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  readonly projectId: number;

  @IsNotEmpty()
  @IsNumber()
  readonly boardLaneId: number;

  @IsNumber()
  @IsOptional()
  readonly order: number;

  @IsString()
  @IsOptional()
  readonly assignedToId: string;

  @IsString()
  @IsOptional()
  readonly assignedMode: string;

  @IsDateString()
  @IsOptional()
  readonly dueDate?: string;
}

export class TaskUpdateDto {
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;

  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly updatedById: string;
}

export class TaskDeleteDto {
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;
}

export class TaskAssignToIdDto {
  @IsString()
  @IsOptional()
  readonly assignedToId: string;

  @IsString()
  @IsOptional()
  readonly assignedMode: string;
}

export class TaskWatcherDto {
  @IsArray()
  accountIds: string[];

  @IsNumber()
  taskId: number;
}

export class TaskIdDto {
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;
}

export class TaskFilterDto {
  @IsOptional()
  projectId;
}
