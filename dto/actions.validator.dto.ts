import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Expose, Exclude } from 'class-transformer';

export class CreateActionDto {
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
  readonly actionTypeId: number;
}

@Exclude()
export class ActionCreateResponse {
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
  readonly actionTypeId: number;
}
