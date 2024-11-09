import { DrizzleService } from '@/db/drizzle.service';
import { messages, users } from '@/db/schema';
import { Injectable } from '@nestjs/common';
import { and, desc, eq, lt, or } from 'drizzle-orm';
import { CreateMessageDTO } from './dto/create-message.dto';
import { attachments } from '@/db/schema/attachments';

@Injectable()
export class MessagesService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async getRoomMessages(
    roomId: string,
    cursor: { createdAt: Date; id: string } | undefined,
  ) {
    const where = and(
      eq(messages.roomId, roomId),
      cursor
        ? or(
            lt(messages.createdAt, cursor.createdAt),
            and(
              eq(messages.createdAt, cursor.createdAt),
              lt(messages.id, cursor.id),
            ),
          )
        : undefined,
    );
    const data = (
      await this.drizzleService.db
        .select()
        .from(messages)
        .where(where)
        .limit(20)
        .orderBy(desc(messages.createdAt), desc(messages.id))
        .leftJoin(users, eq(messages.authorId, users.id))
        .leftJoin(attachments, eq(messages.id, attachments.messageId))
    ).map(({ messages, users, attachments }) => ({
      ...messages,
      author: users,
      attachments: [attachments],
    }));

    const next =
      data.length !== 0
        ? await this.drizzleService.db
            .select()
            .from(messages)
            .where(
              or(
                lt(messages.createdAt, data[data.length - 1].createdAt),
                and(
                  eq(messages.createdAt, data[data.length - 1].createdAt),
                  lt(messages.id, data[data.length - 1].id),
                ),
              ),
            )
            .limit(1)
        : null;

    return {
      data,
      nextCursor:
        next && next.length !== 0
          ? {
              id: data[data.length - 1].id,
              createdAt: data[data.length - 1].createdAt,
            }
          : null,
      hasNextPage: next && next.length !== 0,
    };
  }

  async create(data: CreateMessageDTO) {
    const [message] = await this.drizzleService.db
      .insert(messages)
      .values({
        body: data.body,
        roomId: data.roomId,
        authorId: data.userId,
      })
      .returning();
    const [author] = await this.drizzleService.db
      .select()
      .from(users)
      .where(eq(users.id, data.userId))
      .limit(1);

    const attachmentsData =
      data.attachments && data.attachments.length !== 0
        ? await this.drizzleService.db
            .insert(attachments)
            .values(
              data.attachments?.map((attachment) => ({
                messageId: message.id,
                mimeType: attachment.mimeType,
                fileName: attachment.fileName,
                size: attachment.size,
              })),
            )
            .returning()
        : [];

    return {
      ...message,
      author,
      attachments: attachmentsData,
    };
  }
}
