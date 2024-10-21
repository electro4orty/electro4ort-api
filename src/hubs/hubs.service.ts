import { BadRequestException, Injectable } from '@nestjs/common';
import { and, eq, inArray } from 'drizzle-orm';
import { CreateHubDTO } from './dto/create-hub.dto';
import { DrizzleService } from '@/db/drizzle.service';
import { hubParticipants, hubs } from '@/db/schema';

@Injectable()
export class HubsService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async joinHub(hubId: string, userId: string) {
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

  async create(data: CreateHubDTO, authorId: string) {
    const [newHub] = await this.drizzleService.db
      .insert(hubs)
      .values({
        name: data.name,
        authorId,
        slug: data.name.toLowerCase().replace(/ /g, '-'),
      })
      .returning();
    return newHub;
  }

  async getAll() {
    return await this.drizzleService.db.select().from(hubs).limit(12);
  }

  async getOne(hubSlug: string) {
    const [targetHub] = await this.drizzleService.db
      .select()
      .from(hubs)
      .where(eq(hubs.slug, hubSlug))
      .limit(1);
    if (!targetHub) {
      return null;
    }

    return targetHub;
  }

  async checkHasJoined(hubId: string, userId: string) {
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

  async getJoinedHubs(userId: string) {
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
