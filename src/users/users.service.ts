import { DrizzleService } from '@/db/drizzle.service';
import { NewUser, users, UserStatus } from '@/db/schema';
import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { UpdateUserDTO } from './dto/update-user.dto';

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

  async findById(userId: string) {
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

  async updateStatus(userId: string, status: UserStatus) {
    const [updatedUser] = await this.drizzleService.db
      .update(users)
      .set({
        status,
      })
      .where(eq(users.id, userId))
      .returning();

    return updatedUser;
  }

  async update(userId: string, data: UpdateUserDTO) {
    const [updatedUser] = await this.drizzleService.db
      .update(users)
      .set({
        displayName: data.displayName,
        username: data.username,
        avatar: data.avatar || null,
      })
      .where(eq(users.id, userId))
      .returning();

    return updatedUser;
  }
}
