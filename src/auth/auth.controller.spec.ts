import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { DrizzleService } from '@/db/drizzle.service';
import { Test } from '@nestjs/testing';
import { User } from '@/db/schema';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

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
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, UsersService, JwtService, DrizzleService],
    }).compile();

    authService = moduleRef.get(AuthService);
    authController = moduleRef.get(AuthController);
  });

  describe('register', () => {
    it('should register user', async () => {
      const result: Awaited<ReturnType<AuthController['register']>> = {
        user: mockUser,
        token: 'test-token',
      };
      jest
        .spyOn(authService, 'register')
        .mockImplementation(() => Promise.resolve(result));

      expect(
        await authController.register({
          username: result.user.username,
          displayName: result.user.displayName,
          password: result.user.password,
        }),
      ).toBe(result);
    });
  });

  describe('login', () => {
    it('should login user', async () => {
      const result: Awaited<ReturnType<AuthController['login']>> = {
        user: mockUser,
        token: 'test-token',
      };
      jest
        .spyOn(authService, 'login')
        .mockImplementation(() => Promise.resolve(result));

      expect(
        await authController.login({
          username: result.user.username,
          password: result.user.password,
        }),
      ).toBe(result);
    });
  });

  describe('getMe', () => {
    it('should get authorized user', async () => {
      const result: Awaited<ReturnType<AuthController['getMe']>> = {
        user: mockUser,
        token: 'test-token',
      };
      jest
        .spyOn(authService, 'getMe')
        .mockImplementation(() => Promise.resolve(result));

      expect(await authController.getMe(result.user.id)).toBe(result);
    });
  });
});
