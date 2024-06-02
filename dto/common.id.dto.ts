import { IsNotEmpty, IsString } from 'class-validator';

export class CommonIdDTO {
  @IsNotEmpty()
  @IsString()
  readonly id: string;
}
