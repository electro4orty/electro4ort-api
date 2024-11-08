import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { HubsService } from './hubs.service';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class HubsGateway {
  constructor(private readonly hubsService: HubsService) {}

  @SubscribeMessage('join')
  async handleJoin(
    @MessageBody('hubSlug') hubSlug: string,
    @ConnectedSocket() client: Socket,
  ) {
    const hub = await this.hubsService.getOne(hubSlug);
    if (!hub) {
      throw new WsException('Hub not found');
    }

    await client.join(hubSlug);
    return hub;
  }

  @SubscribeMessage('leave')
  async handleLeave(
    @MessageBody('hubSlug') hubSlug: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.leave(hubSlug);
    return true;
  }
}
