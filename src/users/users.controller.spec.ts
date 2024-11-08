import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DrizzleService } from '@/db/drizzle.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, DrizzleService],
    }).compile();

    controller = module.get(UsersController);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOne', () => {
    it('should get one user by id', async () => {
      const result: Awaited<ReturnType<UsersController['getOne']>> = {
        id: 'test-user-id',
        createdAt: new Date(),
        updatedAt: null,
        displayName: 'John Doe',
        password: '1234567890',
        username: 'john_doe',
      };

      jest
        .spyOn(usersService, 'findById')
        .mockImplementation(() => Promise.resolve(result));

      const response = await controller.getOne(result.id);
      expect(response).toBe(result);
    });
  });
});
