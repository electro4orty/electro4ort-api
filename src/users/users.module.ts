import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DrizzleService } from '@/db/drizzle.service';

@Module({
  providers: [UsersService, DrizzleService],
})
export class UsersModule {}
