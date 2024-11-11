import { UsersService } from '@/users/users.service';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { debounce, DebouncedFunc } from 'lodash';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'rooms',
})
export class RoomsGateway {
  constructor(private readonly usersService: UsersService) {}

  typingStoppedFns: Record<
    string,
    DebouncedFunc<(userId: string, roomId: string) => Promise<void>>
  > = {};

  @SubscribeMessage('join')
  async handleJoin(
    @MessageBody('roomId') roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(roomId);
  }

  @SubscribeMessage('leave')
  async handleLeave(
    @MessageBody('roomId') roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(roomId);
  }

  @SubscribeMessage('type')
  async handleType(
    @MessageBody('roomId') roomId: string,
    @MessageBody('userId') userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new WsException('Not found');
    }

    if (!this.typingStoppedFns[userId]) {
      this.typingStoppedFns[userId] = debounce(
        async (userId: string, roomId: string) => {
          const targetUser = await this.usersService.findById(userId);
          client.broadcast.to(roomId).emit('typingStopped', targetUser);
          delete this.typingStoppedFns[userId];
        },
        1700,
      );
    }

    this.typingStoppedFns[userId](user.id, roomId);

    client.broadcast.to(roomId).emit('typing', user);
  }
}
