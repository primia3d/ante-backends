import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class BoardLaneCreateDto {
  @IsNotEmpty()
  @IsString()
  readonly name;

  @IsNumber()
  @IsOptional()
  readonly order;

  @IsNotEmpty()
  @IsString()
  readonly description;
}

export class BoardLaneOrderDto {
  names: string[];
}

export class ReorderSingleLaneDto {
  name: string;
  newPosition: number;
}

export class BoardLaneUpdateDto {
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;
}

export class BoardLaneDeleteDto {
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;
}

export class BoardLaneIdDto {
  @IsNotEmpty()
  readonly id: number;
}
