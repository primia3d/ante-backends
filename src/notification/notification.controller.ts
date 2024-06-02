import {
  Controller,
  Response as NestResponse,
  Inject,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { UtilityService } from 'lib/utility.service';
import { Response } from 'express';
import { NotificationService } from './notification.service';
import { NotificationFilterDto } from 'dto/notification.validator.dto';

@Controller('notification')
export class NotificationController {
  @Inject() public utilityService: UtilityService;
  @Inject() public notificationService: NotificationService;

  @Get('by-account')
  async getNotificationsByLoggedInUser(
    @NestResponse() response: Response,
    @Query() notificationFilter: NotificationFilterDto,
  ) {
    try {
      const notificationList =
        await this.notificationService.getNotificationsListByLoggedInUser(
          notificationFilter,
        );
      return response.status(HttpStatus.OK).json({
        message: 'Task list successfully fetched.',
        notificationList,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: error.message,
      });
    }
  }
}
