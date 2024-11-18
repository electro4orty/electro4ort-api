import { Test, TestingModule } from '@nestjs/testing';
import { MessagesGateway } from './messages.gateway';
import { MessagesService } from './messages.service';
import { RoomsService } from '@/rooms/rooms.service';
import { DrizzleService } from '@/db/drizzle.service';
import { HubsService } from '@/hubs/hubs.service';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PushNotificationsService } from '@/push-notifications/push-notifications.service';

describe('MessagesGateway', () => {
  let gateway: MessagesGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesGateway,
        MessagesService,
        RoomsService,
        HubsService,
        UsersService,
        JwtService,
        PushNotificationsService,
        DrizzleService,
      ],
    }).compile();

    gateway = module.get<MessagesGateway>(MessagesGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
