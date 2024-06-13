import { IsString, IsNotEmpty, IsInt, IsNumber, IsOptional,  } from 'class-validator';

export class CreateVariationInventoryDTO {
  
  // @IsNotEmpty()
  // itemNumber: string;

  @IsString()
  @IsNotEmpty()
  variationName: string;

  @IsString()
  @IsNotEmpty()
  variationDescription: string;

  @IsInt()
  stocks: number;

  @IsString()
  @IsNotEmpty()
  unitOfMeasure: string;

  @IsNumber()
  unitPrice: number;

  @IsNumber()
  @IsOptional()
  total?: number;
}
