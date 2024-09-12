import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { DrizzleService } from '@/db/drizzle.service';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService, DrizzleService],
})
export class RoomsModule {}
