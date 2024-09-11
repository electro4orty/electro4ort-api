import { BadRequestException, Injectable } from '@nestjs/common';
import { and, eq, inArray } from 'drizzle-orm';
import { CreateHubDTO } from './dto/create-hub.dto';
import { DrizzleService } from '@/db/drizzle.service';
import { hubParticipants, hubs } from '@/db/schema';

@Injectable()
export class HubsService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async joinHub(hubId: number, userId: number) {
    const hasAlreadyJoined = await this.checkHasJoined(hubId, userId);
    if (hasAlreadyJoined) {
      throw new BadRequestException('This user already joined this hub');
    }

    const [participant] = await this.drizzleService.db
      .insert(hubParticipants)
      .values({
        userId,
        hubId,
      })
      .returning();
    return participant;
  }

  async create(data: CreateHubDTO, authorId: number) {
    const [newHub] = await this.drizzleService.db
      .insert(hubs)
      .values({
        title: data.title,
        authorId,
      })
      .returning();
    return newHub;
  }

  async getAll() {
    return await this.drizzleService.db.select().from(hubs).limit(12);
  }

  async checkHasJoined(hubId: number, userId: number) {
    const participants = await this.drizzleService.db
      .select()
      .from(hubParticipants)
      .where(
        and(
          eq(hubParticipants.hubId, hubId),
          eq(hubParticipants.userId, userId),
        ),
      )
      .limit(1);

    return participants.length !== 0;
  }

  async getJoinedHubs(userId: number) {
    const participants = await this.drizzleService.db
      .select()
      .from(hubParticipants)
      .where(eq(hubParticipants.userId, userId));
    const joinedHubsIds = participants.map((participant) => participant.hubId);
    const joinedHubs = await this.drizzleService.db
      .select()
      .from(hubs)
      .where(inArray(hubs.id, joinedHubsIds));
    return joinedHubs;
  }
}
