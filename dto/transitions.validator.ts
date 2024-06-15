import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateTransitionsDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  readonly currentStateId: number;

  @IsNotEmpty()
  @IsNumber()
  readonly workflowId: number;

  @IsNotEmpty()
  @IsNumber()
  readonly nextStateId: number;
}
