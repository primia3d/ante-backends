import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class WorkflowCreateDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;
}

export class WorkflowIdDto {
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;
}

export class WorkflowUpdateDto {
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;

  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description: string;
}
