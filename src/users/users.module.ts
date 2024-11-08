import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DrizzleService } from '@/db/drizzle.service';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService, DrizzleService],
  controllers: [UsersController],
})
export class UsersModule {}
