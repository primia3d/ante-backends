import { SocketService } from '@/socket/socket.service';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { NotificationFilterDto } from 'dto/notification.validator.dto';
import { NotificationsInterface } from 'interfaces/notifications.interface';
import {
  ProjectOfTaskInterface,
  TaskInterface,
} from 'interfaces/task.interface';
import { PrismaService } from 'lib/prisma.service';
import { UtilityService } from 'lib/utility.service';

@Injectable()
export class NotificationService {
  @Inject() public utilityService: UtilityService;
  @Inject() public prisma: PrismaService;
  @Inject() public socketService: SocketService;
  private readonly logger = new Logger(NotificationService.name);

  async createProjectNotification(
    projectTopic: string,
  ): Promise<NotificationsInterface> {
    const notificationsData = await this.prisma.notifications.create({
      data: {
        content: `Notifications has been created for project name: ${projectTopic}`,
      },
    });

    if (notificationsData)
      this.logger.log(
        `Notifications has been created for project name: ${projectTopic}`,
      );
    return notificationsData;
  }

  async createTaskProjectNotificationsForAccounts(
    notificationId: number,
    projectInformation: ProjectOfTaskInterface,
    createResponse: TaskInterface,
    allAccountIds: string[],
  ): Promise<void> {
    await Promise.all(
      allAccountIds.map(async (accountId) => {
        this.logger.log(
          `Task notification has been created for account id: ${accountId}`,
        );
        const projectTaskNotification = {
          notificationsId: notificationId,
          receiverId: accountId.toString(),
          projectId: projectInformation.id,
          taskId: createResponse.id,
        };

        await this.prisma.taskProjectNotifications.create({
          data: projectTaskNotification,
        });
      }),
    );
  }

  async getNotificationsListByLoggedInUser(
    notificationFilter: NotificationFilterDto,
  ) {
    const { id } = this.utilityService.accountInformation;

    const query = {
      receiverId: id,
      isDeleted: false,
    };

    if (notificationFilter.projectId) {
      notificationFilter.projectId = Number(notificationFilter.projectId);
      query['projectId'] = notificationFilter.projectId;
    }

    const notificationsList =
      await this.prisma.taskProjectNotifications.findMany({
        where: query,
        include: {
          Notifications: true,
        },
      });

    return notificationsList;
  }
}
