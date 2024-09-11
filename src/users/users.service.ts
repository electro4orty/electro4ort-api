import { DrizzleService } from '@/db/drizzle.service';
import { NewUser, users } from '@/db/schema';
import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(data: NewUser) {
    const [user] = await this.drizzleService.db
      .insert(users)
      .values(data)
      .returning();
    return user;
  }

  async findById(userId: number) {
    return await this.drizzleService.db.query.users.findFirst({
      where: eq(users.id, userId),
    });
  }

  async findByUsername(username: string) {
    const user = await this.drizzleService.db.query.users.findFirst({
      where: eq(users.username, username),
    });
    return user;
  }
}
