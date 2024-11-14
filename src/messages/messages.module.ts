import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { DrizzleService } from '@/db/drizzle.service';
import { MessagesGateway } from './messages.gateway';
import { RoomsService } from '@/rooms/rooms.service';
import { HubsService } from '@/hubs/hubs.service';
import { UsersService } from '@/users/users.service';
import { PushNotificationsService } from '@/push-notifications/push-notifications.service';

@Module({
  providers: [
    MessagesService,
    RoomsService,
    HubsService,
    DrizzleService,
    MessagesGateway,
    UsersService,
    PushNotificationsService,
  ],
})
export class MessagesModule {}
