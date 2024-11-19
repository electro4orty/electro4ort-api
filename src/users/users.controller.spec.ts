import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DrizzleService } from '@/db/drizzle.service';
import { User } from '@/db/schema';
import { JwtService } from '@nestjs/jwt';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUser: User = {
    id: 'test-id',
    createdAt: new Date(),
    updatedAt: null,
    displayName: 'John Doe',
    password: '12345678',
    username: 'john_doe',
    avatar: null,
    birthDate: null,
    pushSubscription: null,
    status: 'offline',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, DrizzleService, JwtService],
    }).compile();

    controller = module.get(UsersController);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOne', () => {
    it('should get one user by id', async () => {
      const result: Awaited<ReturnType<UsersController['getOne']>> = mockUser;

      jest
        .spyOn(usersService, 'findById')
        .mockImplementation(() => Promise.resolve(result));

      const response = await controller.getOne(result.id);
      expect(response).toBe(result);
    });
  });
});
