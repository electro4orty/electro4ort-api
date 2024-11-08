import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '@/users/users.service';
import { DrizzleService } from '@/db/drizzle.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersService, DrizzleService],
})
export class AuthModule {}
