import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { BoardLaneService } from '../board-lane/board-lane.service';
import { UtilityService } from 'lib/utility.service';
import { PrismaService } from 'lib/prisma.service';
import { TableHandlerService } from 'lib/table.handler/table.handler.service';
import { LoggingService } from '../../lib/logging.service';
import { WsResponseInterceptor } from 'interceptors/ws.response.interceptor';
import { WsExceptionFilter } from 'filters/ws.exception.filter';
import { TopicService } from '@/topic/topic.service';
import { TaskService } from '@/task/task.service';
import { ProjectService } from '@/project/project.service';
import { NotificationService } from '@/notification/notification.service';
@Module({
  providers: [
    SocketGateway,
    SocketService,
    BoardLaneService,
    UtilityService,
    PrismaService,
    TableHandlerService,
    LoggingService,
    WsResponseInterceptor,
    WsExceptionFilter,
    TopicService,
    TaskService,
    ProjectService,
    BoardLaneService,
    NotificationService,
  ],
  exports: [SocketGateway, SocketService],
})
export class SocketModule {}
