import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  payload,
} from './types/socket.type';
import {
  Inject,
  Injectable,
  Logger,
  UseInterceptors,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'lib/prisma.service';
import { BoardLaneService } from '@/board-lane/board-lane.service';
import { UtilityService } from 'lib/utility.service';
import { WsResponseInterceptor } from 'interceptors/ws.response.interceptor';
import { WsExceptionFilter } from 'filters/ws.exception.filter';
import { CustomWsException } from 'filters/custom-ws.exception';
import { Socket } from 'socket.io';
import { WsAdminGuard } from 'guards/ws-jwt.guard';
import { SocketService } from './socket.service';
import { TaskService } from '@/task/task.service';
import {
  BoardLaneCreateDto,
  BoardLaneIdDto,
  BoardLaneUpdateDto,
} from 'dto/board-lane.validator.dto';
@UseInterceptors(WsResponseInterceptor)
@UseFilters(WsExceptionFilter)
@UseGuards(WsAdminGuard)
@WebSocketGateway(+process.env.SOCKET_PORT || 4000, {
  namespace: 'events',
  cors: {
    origin: true,
  },
})
@Injectable()
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(SocketGateway.name);
  @Inject() public prisma: PrismaService;
  @Inject() public boardLaneService: BoardLaneService;
  @Inject() public utilityService: UtilityService;
  @Inject() public taskService: TaskService;
  @Inject() private socketService: SocketService;

  private globalRoomUsers = new Set<string>();

  @WebSocketServer() server: Server = new Server<
    ServerToClientEvents<any>,
    ClientToServerEvents<any>
  >();

  afterInit(server: Server): void {
    this.socketService.io = server;
    this.logger.log('Socket Initialize');
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    await this.socketService.handleConnection(client);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.globalRoomUsers.delete(client.id);
  }

  @SubscribeMessage('CREATE_BOARD_LANE')
  async handleCreateBoardLane(
    @MessageBody() dataPayload: payload<BoardLaneCreateDto>,
  ) {
    try {
      const { data } = dataPayload;

      const createBoardLaneData =
        await this.boardLaneService.createBoardLane(data);

      this.logger.log(`BoardLane Successfully created`);
      return createBoardLaneData;
    } catch (error) {
      this.logger.error(`Error creating board lane: ${error.message}`);
      throw new CustomWsException(
        500,
        'An error occurred while creating the board lane.',
        'CREATE_BOARD_LANE_ERROR',
      );
    }
  }

  @SubscribeMessage('FETCH_BOARD_LANE')
  async handleFetchBoardLane(@MessageBody() requestPayload) {
    try {
      const { data } = requestPayload;
      const boardLaneData = await this.boardLaneService.getBoardLanes(
        data.projectId,
      );
      return boardLaneData;
    } catch (error) {}
  }

  @SubscribeMessage('UPDATE_BOARD_LANE_INFORMATION')
  async handleUpdateBoardLaneInformation(
    @MessageBody() requestPayload: payload<BoardLaneUpdateDto>,
  ) {
    try {
      const { data } = requestPayload;
      const updatedBoardLaneInformation =
        await this.boardLaneService.updateBoardLaneInformation(data);
      return updatedBoardLaneInformation;
    } catch (error) {
      this.logger.error(`Error in updating board lane: ${error.message}`);
      throw new CustomWsException(
        500,
        'An error occurred while creating the board lane.',
        'UPDATE_BOARD_LANE_INFORMATION_ERROR',
      );
    }
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() payload: string) {
    this.logger.log(`Message received: ${payload}`);
    this.server.emit('message_response', payload);
  }

  @SubscribeMessage('DELETE_BOARD_LANE')
  async handleDeleteBoardLane(
    @MessageBody() requestPayload: payload<BoardLaneIdDto>,
  ) {
    try {
      const { data } = requestPayload;
      const updatedBoardLaneInformation =
        await this.boardLaneService.deleteBoardLane(data);
      this.logger.log(`BoardLane Successfully deleted`);
      return updatedBoardLaneInformation;
    } catch (error) {
      this.logger.error(`Error in deleting board lane: ${error.message}`);
      throw new CustomWsException(
        500,
        'An error occurred while creating the board lane.',
        'DELETE_BOARD_LANE_ERROR',
      );
    }
  }

  @SubscribeMessage('DRAG_BOARD_LANE')
  async handleBoardLaneOrder(@MessageBody() requestPayload) {
    try {
      const {
        data: { newItems },
      } = requestPayload;

      const boardLaneOrder =
        await this.boardLaneService.reOrderBoardLanes(newItems);
      return boardLaneOrder;
    } catch (error) {
      this.logger.error(`Error in moving board lane: ${error.message}`);
      throw new CustomWsException(
        500,
        'An error occurred while creating the board lane.',
        'DRAG_BOARD_LANE_ERROR',
      );
    }
  }

  @SubscribeMessage('CREATE_TASK')
  async handleCreateTask(@MessageBody() requestPayload) {
    try {
      const { data } = requestPayload;
      const createTask = await this.taskService.createAndAssignTask(data);

      return createTask;
    } catch (error) {
      this.logger.error(`Error in creating task: ${error.message}`);
      throw new CustomWsException(
        500,
        'An error occurred while creating the task.',
        'CREATE_TASK_ERROR',
      );
    }
  }

  @SubscribeMessage('UPDATE_TASK')
  async handleUpdateTask(@MessageBody() requestPayload) {
    try {
      const { data } = requestPayload;
      const updateTaskInformation =
        await this.taskService.updateTaskInformation(data);
      return updateTaskInformation;
    } catch (error) {
      this.logger.error(`Error in updating task  ${error.message}`);
      throw new CustomWsException(
        500,
        'An error occurred while updating the task lane.',
        'UPDATE_TASK_ERROR',
      );
    }
  }

  @SubscribeMessage('DELETE_TASK')
  async handleDeleteTask(@MessageBody() requestPayload) {
    try {
      const { data } = requestPayload;
      const updatedTaskInformation = await this.taskService.deleteTask(data);
      this.logger.log(`Task Successfully deleted`);
      return updatedTaskInformation;
    } catch (error) {
      this.logger.error(`Error in deleting task lane: ${error.message}`);
      throw new CustomWsException(
        500,
        'An error occurred while creating the task lane.',
        'DELETE_TASK_ERROR',
      );
    }
  }

  @SubscribeMessage('DRAG_TASK_VERTICAL')
  async handleDragTaskVertical(@MessageBody() requestPayload) {
    try {
      const {
        data: { newItems },
      } = requestPayload;

      const taskOrderVertical =
        await this.taskService.reOrderTaskVertical(newItems);
      this.logger.log(`Successfully dragged task vertical`);
      return taskOrderVertical;
    } catch (error) {
      this.logger.error(`Error in moving task lane: ${error.message}`);
      throw new CustomWsException(
        500,
        'An error occurred while creating the task lane.',
        'DRAG_TASK_VERTICAL_ERROR',
      );
    }
  }
}
