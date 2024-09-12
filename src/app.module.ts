import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HubsModule } from './hubs/hubs.module';
import { RoomsModule } from './rooms/rooms.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [AuthModule, UsersModule, HubsModule, RoomsModule, MessagesModule],
  providers: [],
})
export class AppModule {}
