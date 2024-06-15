import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Expose, Exclude } from 'class-transformer';

export class WorkflowCreateDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;
}

@Exclude()
export class WorkflowCreateResponse {
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;

  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly description: string;
}
