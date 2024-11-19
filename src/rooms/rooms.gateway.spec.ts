import { Test, TestingModule } from '@nestjs/testing';
import { RoomsGateway } from './rooms.gateway';
import { RoomsService } from './rooms.service';
import { UsersService } from '@/users/users.service';
import { HubsService } from '@/hubs/hubs.service';
import { DrizzleService } from '@/db/drizzle.service';

describe('RoomsGateway', () => {
  let gateway: RoomsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsGateway,
        RoomsService,
        UsersService,
        HubsService,
        DrizzleService,
      ],
    }).compile();

    gateway = module.get<RoomsGateway>(RoomsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
