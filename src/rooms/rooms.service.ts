import { DrizzleService } from '@/db/drizzle.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomDTO } from './dto/create-room.dto';
import { rooms } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { HubsService } from '@/hubs/hubs.service';

@Injectable()
export class RoomsService {
  constructor(
    private readonly drizzleService: DrizzleService,
    private readonly hubsService: HubsService,
  ) {}

  async create(data: CreateRoomDTO) {
    const hub = await this.hubsService.getOne(data.hubSlug);
    if (!hub) {
      throw new BadRequestException();
    }

    const [newRoom] = await this.drizzleService.db
      .insert(rooms)
      .values({
        name: data.name,
        hubId: hub.id,
        type: data.type,
      })
      .returning();
    return newRoom;
  }

  async findById(roomId: string) {
    const foundRooms = await this.drizzleService.db
      .select()
      .from(rooms)
      .where(eq(rooms.id, roomId))
      .limit(1);
    if (foundRooms.length === 0) {
      return null;
    }

    return foundRooms[0];
  }

  async findByHubId(hubId: string) {
    const foundRooms = await this.drizzleService.db
      .select()
      .from(rooms)
      .where(eq(rooms.hubId, hubId));
    return foundRooms;
  }

  async checkHasJoined(hubId: string, userId: string) {
    const hasJoined = await this.hubsService.checkHasJoined(hubId, userId);
    return hasJoined;
  }
}
