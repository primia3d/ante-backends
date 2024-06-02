import { IsOptional } from 'class-validator';

export class NotificationFilterDto {
  @IsOptional()
  projectId;
}
