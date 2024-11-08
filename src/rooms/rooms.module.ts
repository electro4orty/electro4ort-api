import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { DrizzleService } from '@/db/drizzle.service';
import { HubsService } from '@/hubs/hubs.service';
import { MessagesService } from '@/messages/messages.service';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService, DrizzleService, HubsService, MessagesService],
})
export class RoomsModule {}
