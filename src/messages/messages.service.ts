import { DrizzleService } from '@/db/drizzle.service';
import { Message, messages, User, users } from '@/db/schema';
import { Injectable } from '@nestjs/common';
import { aliasedTable, and, desc, eq, gt, lt } from 'drizzle-orm';
import { CreateMessageDTO } from './dto/create-message.dto';
import { Attachment, attachments } from '@/db/schema/attachments';

@Injectable()
export class MessagesService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async getRoomMessages(
    roomId: string,
    cursor: { createdAt: string; id: string } | undefined,
  ) {
    const where = and(
      eq(messages.roomId, roomId),
      cursor ? lt(messages.createdAt, cursor.createdAt) : undefined,
    );

    const reply = aliasedTable(messages, 'reply');
    const rows: {
      messages: Message;
      users: User;
      attachments: Attachment;
      replies: Message;
    }[] = await this.drizzleService.db
      .select({
        messages: messages,
        users: users,
        attachments: attachments,
        replies: reply,
      })
      .from(messages)
      .limit(20)
      .where(where)
      .orderBy(desc(messages.createdAt), desc(messages.id))
      .leftJoin(users, eq(messages.authorId, users.id))
      .leftJoin(attachments, eq(attachments.messageId, messages.id))
      .leftJoin(reply, eq(reply.id, messages.replyToId));

    const data = rows.reduce<
      (Message & {
        author: User | null;
        attachments: Attachment[];
        replyTo: Message | null;
      })[]
    >((prev, message) => {
      const existingMessage = prev.find(
        (item) => item.id === message.messages.id,
      );
      if (!existingMessage) {
        prev.push({
          ...message.messages,
          attachments: message.attachments ? [message.attachments] : [],
          replyTo: message.replies,
          author: message.users,
        });
      } else if (message.attachments) {
        existingMessage.attachments.push(message.attachments);
      }
      return prev;
    }, []);

    const next =
      data.length !== 0
        ? await this.drizzleService.db
            .select()
            .from(messages)
            .where(
              and(
                eq(messages.roomId, roomId),
                lt(messages.createdAt, data[data.length - 1].createdAt),
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

  async getMissedRoomMessages(
    roomId: string,
    cursor: {
      createdAt: string;
    },
  ) {
    const where = and(
      eq(messages.roomId, roomId),
      gt(messages.createdAt, cursor.createdAt),
    );

    const reply = aliasedTable(messages, 'reply');
    const rows: {
      messages: Message;
      users: User;
      attachments: Attachment;
      replies: Message;
    }[] = await this.drizzleService.db
      .select({
        messages: messages,
        users: users,
        attachments: attachments,
        replies: reply,
      })
      .from(messages)
      .limit(20)
      .where(where)
      .orderBy(desc(messages.createdAt), desc(messages.id))
      .leftJoin(users, eq(messages.authorId, users.id))
      .leftJoin(attachments, eq(attachments.messageId, messages.id))
      .leftJoin(reply, eq(reply.id, messages.replyToId));

    const data = rows.reduce<
      (Message & {
        author: User | null;
        attachments: Attachment[];
        replyTo: Message | null;
      })[]
    >((prev, message) => {
      const existingMessage = prev.find(
        (item) => item.id === message.messages.id,
      );
      if (!existingMessage) {
        prev.push({
          ...message.messages,
          attachments: message.attachments ? [message.attachments] : [],
          replyTo: message.replies,
          author: message.users,
        });
      } else if (message.attachments) {
        existingMessage.attachments.push(message.attachments);
      }
      return prev;
    }, []);

    return data;
  }

  async create(data: Omit<CreateMessageDTO, 'text'>) {
    const [message] = await this.drizzleService.db
      .insert(messages)
      .values({
        body: data.body,
        roomId: data.roomId,
        authorId: data.userId,
        type: data.type,
        replyToId: data.replyToId,
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

    const replyTo = data.replyToId
      ? await this.drizzleService.db
          .select()
          .from(messages)
          .where(eq(messages.id, data.replyToId))
          .limit(1)
      : null;

    return {
      ...message,
      author,
      attachments: attachmentsData,
      replyTo: replyTo ? replyTo[0] : null,
    };
  }
}
