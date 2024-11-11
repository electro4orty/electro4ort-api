import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DrizzleService } from '@/db/drizzle.service';
import { UsersController } from './users.controller';
import { UsersGateway } from './users.gateway';

@Module({
  providers: [UsersService, DrizzleService, UsersGateway],
  controllers: [UsersController],
})
export class UsersModule {}
