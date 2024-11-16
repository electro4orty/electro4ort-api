import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { PushSubscription } from 'web-push';
import {
  CreateMessageDTO,
  createMessageSchema,
} from './dto/create-message.dto';
import { ZodValidationPipe } from '@/zod-validation/zod-validation.pipe';
import { MessagesService } from './messages.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@/auth/auth.guard';
import { Socket } from 'socket.io';
import { RoomsService } from '@/rooms/rooms.service';
import { HubsService } from '@/hubs/hubs.service';
import { PushNotificationsService } from '@/push-notifications/push-notifications.service';
import { UsersService } from '@/users/users.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly roomsService: RoomsService,
    private readonly hubsService: HubsService,
    private readonly usersService: UsersService,
    private readonly pushNotificationsService: PushNotificationsService,
  ) {}

  @UseGuards(AuthGuard)
  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody(new ZodValidationPipe(createMessageSchema))
    data: CreateMessageDTO,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const user = await this.usersService.findById(data.userId);
      if (!user) {
        throw new WsException('User not found');
      }

      const room = await this.roomsService.findById(data.roomId);
      if (!room) {
        throw new WsException('Room not found');
      }

      const hub = await this.hubsService.findById(room.hubId);
      if (!hub) {
        throw new WsException('Hub not found');
      }

      const newMessage = await this.messagesService.create(data);

      client.broadcast.to(hub.slug).emit('message', newMessage);
      const participants = await this.hubsService.getParticipants(hub.id);
      const filteredParticipants = participants.filter(
        (user) => user.id !== data.userId,
      );

      filteredParticipants.forEach((user) => {
        if (user.pushSubscription && user.status === 'offline') {
          this.pushNotificationsService.send(
            user.pushSubscription as PushSubscription,
            {
              body: newMessage.body,
              title: newMessage.author.displayName,
              roomId: newMessage.roomId,
            },
          );
        }
      });

      return newMessage;
    } catch (error) {
      throw new WsException((error as Error).message);
    }
  }
}
