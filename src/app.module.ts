import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HubsModule } from './hubs/hubs.module';

@Module({
  imports: [AuthModule, UsersModule, HubsModule],
  providers: [],
})
export class AppModule {}
