import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Expose, Exclude } from 'class-transformer';

export class CreateStateDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  readonly stateTypeId: number;

  @IsNotEmpty()
  @IsNumber()
  readonly workflowId: number;
}

@Exclude()
export class StateCreateResponse {
  @Expose()
  @IsNumber()
  readonly id: number;

  @Expose()
  @IsString()
  readonly name: string;

  @Expose()
  @IsString()
  readonly description: string;

  @Expose()
  @IsNumber()
  readonly stateTypeId: number;

  @Expose()
  @IsNumber()
  readonly workflowId: number;
}
