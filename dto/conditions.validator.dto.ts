import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Expose, Exclude } from 'class-transformer';

export class CreateConditionDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  readonly transitionId: number;

  @IsNotEmpty()
  @IsNumber()
  readonly conditionTypeId: number;
}

@Exclude()
export class ConditionCreateResponse {
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
  readonly transitionId: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  readonly conditionTypeId: number;
}
