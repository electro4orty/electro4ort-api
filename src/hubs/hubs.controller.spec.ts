import { Test } from '@nestjs/testing';
import { HubsController } from './hubs.controller';
import { HubsService } from './hubs.service';
import { DrizzleService } from '@/db/drizzle.service';
import { RoomsService } from '@/rooms/rooms.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';
import { Hub, Room } from '@/db/schema';

describe('HubsController', () => {
  let hubsController: HubsController;
  let hubsService: HubsService;
  let roomsService: RoomsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HubsController],
      providers: [HubsService, DrizzleService, RoomsService, JwtService],
    }).compile();

    hubsService = moduleRef.get(HubsService);
    hubsController = moduleRef.get(HubsController);
    roomsService = moduleRef.get(RoomsService);
  });

  describe('create', () => {
    it('should create hub', async () => {
      const result: Awaited<ReturnType<HubsController['create']>> = {
        id: 'test-hub-id',
        createdAt: new Date(),
        updatedAt: null,
        authorId: 'test-id',
        avatar: null,
        name: 'Test hub 1',
        slug: 'test-hub-1',
      };
      jest
        .spyOn(hubsService, 'create')
        .mockImplementation(() => Promise.resolve(result));

      expect(
        await hubsController.create(
          {
            name: result.name,
          },
          'test-id',
        ),
      ).toBe(result);
    });
  });

  describe('getOne', () => {
    it('should find hub by slug', async () => {
      const result: Awaited<ReturnType<HubsController['getOne']>> = {
        id: 'test-hub-id',
        createdAt: new Date(),
        updatedAt: null,
        authorId: 'test-id',
        avatar: null,
        name: 'Test hub 1',
        slug: 'test-hub-1',
      };
      jest
        .spyOn(hubsService, 'getOne')
        .mockImplementation(() => Promise.resolve(result));

      expect(await hubsController.getOne(result.id)).toBe(result);
    });

    it('should not find hub by slug', async () => {
      jest
        .spyOn(hubsService, 'getOne')
        .mockImplementation(() => Promise.resolve(null));

      expect(
        async () => await hubsController.getOne('fake-slug'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getJoined', () => {
    it('should find user joined hubs', async () => {
      const result: Awaited<ReturnType<HubsController['getJoined']>> = [
        {
          id: 'test-hub-id',
          createdAt: new Date(),
          updatedAt: null,
          authorId: 'test-id',
          avatar: null,
          name: 'Test hub 1',
          slug: 'test-hub-1',
        },
      ];
      jest
        .spyOn(hubsService, 'getJoinedHubs')
        .mockImplementation(() => Promise.resolve(result));

      const response = await hubsController.getJoined('test-id');

      expect(response).toBe(result);
      expect(Array.isArray(response)).toBeTruthy();
    });
  });

  describe('getRooms', () => {
    it('should find hub rooms', async () => {
      const rooms: Room[] = [
        {
          id: 'test-room-id',
          createdAt: new Date(),
          updatedAt: null,
          hubId: 'test-hub-id',
          name: 'Test room 1',
          type: 'text',
        },
      ];
      const hub: Hub = {
        id: 'test-room-id',
        createdAt: new Date(),
        updatedAt: null,
        authorId: 'test-author-id',
        avatar: null,
        name: 'test hub',
        slug: 'test-hub',
      };

      jest
        .spyOn(roomsService, 'findByHubId')
        .mockImplementation(() => Promise.resolve(rooms));
      jest
        .spyOn(hubsService, 'getOne')
        .mockImplementation(() => Promise.resolve(hub));

      const response = await hubsController.getRooms('test-hub-id');

      expect(response).toBe(rooms);
      expect(Array.isArray(response)).toBeTruthy();
    });
  });
});
