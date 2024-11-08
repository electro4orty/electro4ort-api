import { Test } from '@nestjs/testing';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { DrizzleService } from '@/db/drizzle.service';
import { HubsService } from '@/hubs/hubs.service';
import { JwtService } from '@nestjs/jwt';

describe('RoomsController', () => {
  let roomsController: RoomsController;
  let roomsService: RoomsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [RoomsController],
      providers: [RoomsService, DrizzleService, HubsService, JwtService],
    }).compile();

    roomsService = moduleRef.get(RoomsService);
    roomsController = moduleRef.get(RoomsController);
  });

  describe('create', () => {
    it('should create room', async () => {
      const result: Awaited<ReturnType<RoomsController['create']>> = {
        id: 'test-room-id',
        createdAt: new Date(),
        updatedAt: null,
        name: 'Test room 1',
        hubId: 'test-hub-1',
        type: 'text',
      };
      jest
        .spyOn(roomsService, 'create')
        .mockImplementation(() => Promise.resolve(result));

      expect(
        await roomsController.create({
          name: result.name,
          hubSlug: 'test-hub-1',
          type: result.type,
        }),
      ).toBe(result);
    });
  });
});
