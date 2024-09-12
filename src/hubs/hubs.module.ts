import { Module } from '@nestjs/common';
import { HubsController } from './hubs.controller';
import { HubsService } from './hubs.service';
import { DrizzleService } from '@/db/drizzle.service';
import { RoomsService } from '@/rooms/rooms.service';

@Module({
  controllers: [HubsController],
  providers: [HubsService, DrizzleService, RoomsService],
})
export class HubsModule {}
