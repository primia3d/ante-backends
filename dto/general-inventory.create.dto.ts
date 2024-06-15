import { IsString, IsNotEmpty, IsUUID, IsArray, ValidateNested, IsNumber,  } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateVariationInventoryDTO } from './variant-inventory.create.dto';

export class CreateGeneralInventoryDTO {
  
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariationInventoryDTO)
  variations: CreateVariationInventoryDTO[];

  @IsString()
  @IsNotEmpty()
  location: string;

  // @IsString()
  // tags: string;


}
