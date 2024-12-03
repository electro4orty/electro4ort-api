import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@/auth/auth.guard';
import { debounce, DebouncedFunc } from 'lodash';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class UsersGateway {
  @WebSocketServer() server!: Server;

  constructor(private readonly usersService: UsersService) {}

  setOfflineFns: Record<
    string,
    DebouncedFunc<(userId: string) => Promise<void>>
  > = {};

  @SubscribeMessage('ping')
  @UseGuards(AuthGuard)
  async handlePing(@MessageBody('userId') userId: string) {
    const server = this.server;
    let user = await this.usersService.updateStatus(userId, 'online');
    server.to(`userStatusUpdate_${userId}`).emit('userStatusUpdate', user);

    if (!this.setOfflineFns[userId]) {
      this.setOfflineFns[userId] = debounce(async (userId: string) => {
        user = await this.usersService.updateStatus(userId, 'offline');
        server.to(`userStatusUpdate_${userId}`).emit('userStatusUpdate', user);
        delete this.setOfflineFns[userId];
      }, 5000);
    }

    this.setOfflineFns[userId](userId);
  }

  @SubscribeMessage('subscribeUserStatusUpdate')
  @UseGuards(AuthGuard)
  async handleSubscribeUserStatusUpdate(
    @MessageBody('userId') userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`userStatusUpdate_${userId}`);
  }

  @SubscribeMessage('unsubscribeUserStatusUpdate')
  @UseGuards(AuthGuard)
  async handleUnsubscribeUserStatusUpdate(
    @MessageBody('userId') userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`userStatusUpdate_${userId}`);
  }
}
