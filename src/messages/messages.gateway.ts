import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
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
  ) {}

  @UseGuards(AuthGuard)
  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody(new ZodValidationPipe(createMessageSchema))
    data: CreateMessageDTO,
    @ConnectedSocket() client: Socket,
  ) {
    const newMessage = await this.messagesService.create(data);
    const room = await this.roomsService.findById(newMessage.roomId);
    if (!room) {
      throw new WsException('Room not found');
    }

    const hub = await this.hubsService.findById(room.hubId);
    if (!hub) {
      throw new WsException('Hub not found');
    }

    client.broadcast.to(hub.slug).emit('message', newMessage);

    return newMessage;
  }
}
