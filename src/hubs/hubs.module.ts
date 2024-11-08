import { Module } from '@nestjs/common';
import { HubsController } from './hubs.controller';
import { HubsService } from './hubs.service';
import { DrizzleService } from '@/db/drizzle.service';
import { RoomsService } from '@/rooms/rooms.service';
import { HubsGateway } from './hubs.gateway';

@Module({
  controllers: [HubsController],
  providers: [HubsService, DrizzleService, RoomsService, HubsGateway],
})
export class HubsModule {}
