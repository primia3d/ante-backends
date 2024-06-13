import { IsString, IsNotEmpty, IsUUID, IsArray, ValidateNested, IsNumber,  } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateVariationInventoryDTO } from './variant-inventory.create.dto';

export class CreateGeneralInventoryDTO {
  
  @IsString()
  @IsNotEmpty()
  description: string;

  // @IsUUID()
  // @IsNotEmpty()
  // warehouseId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariationInventoryDTO)
  variations: CreateVariationInventoryDTO[];
}
