import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class TopicService {
  joinTopic(socket: Socket, topicName: string): void {
    socket.join(topicName);
  }

  broadcastWelcome(socket: Socket, topicName: string, clientId: string): void {
    socket.broadcast
      .to(topicName)
      .emit('ON_WELCOME', `Welcome to ${topicName}: ${clientId}`);
  }

  joinTopicPerRoleGroup(socket: Socket, roleGroup: { name: string }): void {
    const topicName = `ABC123_${roleGroup.name.split(' ').join('')}`;
    socket.join(topicName);
  }

  joinTopicsPerProject(
    socket: Socket,
    projectNames: Array<{ name: string }>,
  ): void {
    projectNames.forEach((projectName) => {
      socket.join(projectName.name);
    });
  }
}
