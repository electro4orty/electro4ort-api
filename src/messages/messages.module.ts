import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { DrizzleService } from '@/db/drizzle.service';
import { MessagesGateway } from './messages.gateway';
import { RoomsService } from '@/rooms/rooms.service';
import { HubsService } from '@/hubs/hubs.service';

@Module({
  providers: [
    MessagesService,
    RoomsService,
    HubsService,
    DrizzleService,
    MessagesGateway,
  ],
})
export class MessagesModule {}
