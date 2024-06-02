import { IsString, IsNumber, IsOptional } from 'class-validator';
export class CollaboratorCreateDto {
  @IsNumber()
  @IsOptional()
  taskId: number;

  @IsString()
  @IsOptional()
  accountId: string;
}
