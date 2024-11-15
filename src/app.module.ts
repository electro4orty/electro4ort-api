import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HubsModule } from './hubs/hubs.module';
import { RoomsModule } from './rooms/rooms.module';
import { MessagesModule } from './messages/messages.module';
import { JwtModule } from '@nestjs/jwt';
import { env } from './utils/env';
import { AttachmentsModule } from './attachments/attachments.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    HubsModule,
    RoomsModule,
    MessagesModule,
    JwtModule.register({
      global: true,
      secret: env.JWT_SECRET,
      signOptions: {
        expiresIn: '7d',
      },
    }),
    AttachmentsModule,
  ],
  providers: [],
})
export class AppModule {}
