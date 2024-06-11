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

  @IsNotEmpty()
  @IsString()
  forkliftSystem: string;

  @IsNotEmpty()
  @IsString()
  rackingSystem: string;

  @IsNotEmpty()
  @IsString()
  lighting: string;

  @IsNotEmpty()
  @IsString()
  loadingDock: string;

  @IsNotEmpty()
  @IsString()
  security: string;

  @IsNotEmpty()
  @IsString()
  climateControl: string;

  @IsNotEmpty()
  @IsString()
  accessibility: string;
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

  @IsString()
  forkliftSystem?: string;

  @IsString()
  rackingSystem?: string;

  @IsString()
  lighting?: string;

  @IsString()
  loadingDock?: string;

  @IsString()
  security?: string;

  @IsString()
  climateControl?: string;

  @IsString()
  accessibility?: string;
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
