import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq, getTableColumns, ilike, inArray } from 'drizzle-orm';
import { CreateHubDTO } from './dto/create-hub.dto';
import { DrizzleService } from '@/db/drizzle.service';
import { hubParticipants, hubs, users } from '@/db/schema';

@Injectable()
export class HubsService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async joinHub(hubSlug: string, userId: string) {
    const hub = await this.getOne(hubSlug);
    if (!hub) {
      throw new NotFoundException('Hub not found');
    }

    const hasAlreadyJoined = await this.checkHasJoined(hub.id, userId);
    if (hasAlreadyJoined) {
      throw new BadRequestException('This user already joined this hub');
    }

    await this.drizzleService.db.insert(hubParticipants).values({
      userId,
      hubId: hub.id,
    });

    return hub;
  }

  async create(data: CreateHubDTO & { avatar: string }, authorId: string) {
    const [newHub] = await this.drizzleService.db
      .insert(hubs)
      .values({
        name: data.name,
        authorId,
        slug: data.name.toLowerCase().replace(/ /g, '-'),
        avatar: data.avatar,
      })
      .returning();
    await this.drizzleService.db.insert(hubParticipants).values({
      hubId: newHub.id,
      userId: authorId,
    });
    return newHub;
  }

  async getAll(query: string, userId: string) {
    return await this.drizzleService.db
      .select({
        ...getTableColumns(hubs),
        participant: hubParticipants,
      })
      .from(hubs)
      .where(ilike(hubs.name, `%${query}%`))
      .leftJoin(
        hubParticipants,
        and(
          eq(hubParticipants.hubId, hubs.id),
          eq(hubParticipants.userId, userId),
        ),
      );
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

  async findById(hubId: string) {
    const [targetHub] = await this.drizzleService.db
      .select()
      .from(hubs)
      .where(eq(hubs.id, hubId))
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

  async getParticipants(hubId: string) {
    const data = await this.drizzleService.db
      .select()
      .from(hubParticipants)
      .where(eq(hubParticipants.hubId, hubId))
      .leftJoin(users, eq(users.id, hubParticipants.userId));

    const participants = data
      .map((item) => item.users)
      .filter((participant) => !!participant);
    return participants;
  }
}
