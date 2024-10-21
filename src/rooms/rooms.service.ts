import { DrizzleService } from '@/db/drizzle.service';
import { Injectable } from '@nestjs/common';
import { CreateRoomDTO } from './dto/create-room.dto';
import { rooms } from '@/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class RoomsService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(data: CreateRoomDTO) {
    const [newRoom] = await this.drizzleService.db
      .insert(rooms)
      .values({
        name: data.name,
        hubId: data.hubId,
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
}
