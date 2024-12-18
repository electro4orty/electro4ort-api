import { Test, TestingModule } from '@nestjs/testing';
import { UsersGateway } from './users.gateway';
import { UsersService } from './users.service';
import { DrizzleService } from '@/db/drizzle.service';
import { JwtService } from '@nestjs/jwt';

describe('UsersGateway', () => {
  let gateway: UsersGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersGateway, UsersService, DrizzleService, JwtService],
    }).compile();

    gateway = module.get<UsersGateway>(UsersGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
