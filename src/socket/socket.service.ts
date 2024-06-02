import { Injectable, Inject, Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { WsAdminGuard } from 'guards/ws-jwt.guard';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { PrismaService } from 'lib/prisma.service';
import { UtilityService } from 'lib/utility.service';
import { TopicService } from '@/topic/topic.service';

@Injectable()
export class SocketService {
  public readonly connectedClients: Map<string, Socket[]> = new Map();
  public io: Server = null;
  private readonly wsAdminGuard: WsAdminGuard;
  private readonly logger = new Logger(SocketService.name);
  @Inject() public topicService: TopicService;

  constructor(
    private readonly prisma: PrismaService,
    private readonly utilityService: UtilityService,
  ) {
    this.wsAdminGuard = new WsAdminGuard(prisma, utilityService);
  }

  async handleConnection(socket: Socket): Promise<void> {
    const clientId = socket.id;

    const { token } = socket.handshake.auth?.token
      ? socket.handshake.auth
      : socket.handshake.headers;
    if (!token) {
      socket.disconnect();
      return;
    }

    const checkToken = await this.wsAdminGuard.authenticateClient(token);
    if (!checkToken) {
      socket.disconnect();
      return;
    }

    const context = new ExecutionContextHost([socket]);
    const canActivate = await this.wsAdminGuard.canActivate(context);
    if (!canActivate) {
      socket.disconnect();
      return;
    }

    const { id: accountId } = this.utilityService.accountInformation;

    this.topicService.joinTopic(socket, 'GLOBAL_TOPIC');
    this.topicService.broadcastWelcome(socket, 'GLOBAL_TOPIC', clientId);

    const {
      role: { roleGroup },
    } = this.utilityService.accountInformation;
    this.topicService.joinTopicPerRoleGroup(socket, roleGroup);

    const projectList = await this.prisma.project.findMany();
    if (projectList.length > 0) {
      const projectNames = projectList.map((project) => ({
        name: project.name,
      }));
      this.topicService.joinTopicsPerProject(socket, projectNames);
    }

    console.log('Rooms the client has joined:', socket.rooms);

    if (!this.connectedClients.has(accountId)) {
      this.connectedClients.set(accountId, []);
    }
    this.connectedClients.get(accountId)?.push(socket);

    this.logger.log(
      `Connected Clients ${this.connectedClients.get(accountId)?.length}`,
    );

    socket.on('disconnect', () => {
      const socketsForAccount = this.connectedClients.get(accountId);
      if (socketsForAccount) {
        const index = socketsForAccount.indexOf(socket);
        if (index !== -1) {
          socketsForAccount.splice(index, 1);
        }
        if (socketsForAccount.length === 0) {
          this.connectedClients.delete(accountId);
        }
      }
    });
  }

  getSocketsByAccountId(accountId: string): Socket[] | undefined {
    return this.connectedClients.get(accountId);
  }

  async broadcastToRoom(
    roomName: string,
    eventName: string,
    payload: any,
  ): Promise<void> {
    if (!this.io || !roomName) {
      throw new Error('Socket.io instance or room name is not available.');
    }

    this.io.to(roomName).emit(eventName, payload);
  }
}
