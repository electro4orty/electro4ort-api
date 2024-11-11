import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { DrizzleService } from '@/db/drizzle.service';
import { HubsService } from '@/hubs/hubs.service';
import { MessagesService } from '@/messages/messages.service';
import { RoomsGateway } from './rooms.gateway';
import { UsersService } from '@/users/users.service';

@Module({
  controllers: [RoomsController],
  providers: [
    RoomsService,
    DrizzleService,
    HubsService,
    MessagesService,
    RoomsGateway,
    UsersService,
  ],
})
export class RoomsModule {}
