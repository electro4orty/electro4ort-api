import { DrizzleService } from '@/db/drizzle.service';
import { Message, messages, User, users } from '@/db/schema';
import { Injectable } from '@nestjs/common';
import { and, desc, eq, getTableColumns, lt, or } from 'drizzle-orm';
import { CreateMessageDTO } from './dto/create-message.dto';
import { Attachment, attachments } from '@/db/schema/attachments';

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

    const rows = await this.drizzleService.db
      .select({
        ...getTableColumns(messages),
        author: users,
        attachment: attachments,
      })
      .from(messages)
      .limit(20)
      .where(where)
      .orderBy(desc(messages.createdAt), desc(messages.id))
      .leftJoin(users, eq(messages.authorId, users.id))
      .leftJoin(attachments, eq(attachments.messageId, messages.id));

    const data = rows.reduce<
      (Message & { author: User | null; attachments: Attachment[] })[]
    >((prev, message) => {
      const existingMessage = prev.find((item) => item.id === message.id);
      if (!existingMessage) {
        prev.push({
          ...message,
          attachments: message.attachment ? [message.attachment] : [],
        });
      } else if (message.attachment) {
        existingMessage.attachments.push(message.attachment);
      }
      return prev;
    }, []);

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
        type: data.type,
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
