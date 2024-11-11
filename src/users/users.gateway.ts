import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@/auth/auth.guard';
import { debounce, DebouncedFunc } from 'lodash';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class UsersGateway {
  constructor(private readonly usersService: UsersService) {}

  setOfflineFns: Record<
    string,
    DebouncedFunc<(userId: string) => Promise<void>>
  > = {};

  @SubscribeMessage('ping')
  @UseGuards(AuthGuard)
  async handlePing(@MessageBody('userId') userId: string) {
    await this.usersService.updateStatus(userId, 'online');
    if (!this.setOfflineFns[userId]) {
      this.setOfflineFns[userId] = debounce(async (userId: string) => {
        await this.usersService.updateStatus(userId, 'offline');
        delete this.setOfflineFns[userId];
      }, 60_000);
    }

    this.setOfflineFns[userId](userId);
  }
}
