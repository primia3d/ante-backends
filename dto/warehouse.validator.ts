import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';

export class WarehouseCreateDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsNumber()
  size: number;

  @IsNotEmpty()
  @IsNumber()
  storageCapacity: number;

}

export class WarehouseUpdateDTO {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsString()
  name?: string;

  @IsString()
  location?: string;

  @IsNumber()
  size?: number;

  @IsNumber()
  storageCapacity?: number;
}

export class WarehouseReadDTO {
    @IsNotEmpty()
    @IsString()
    id: string;
  }
  
  export class WarehouseDeleteDTO {
    @IsNotEmpty()
    @IsString()
    id: string;
  }
