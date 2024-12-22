import { messageType } from '@/db/schema';
import { z } from 'zod';

export const createMessageSchema = z.object({
  roomId: z.string(),
  userId: z.string(),
  body: z.string().max(10000),
  text: z.string().max(10000),
  attachments: z
    .array(
      z.object({
        fileName: z.string(),
        mimeType: z.string(),
        size: z.number().positive(),
      }),
    )
    .max(99)
    .nullable(),
  type: z.enum(messageType.enumValues),
  replyToId: z.string().nullable(),
});

export type CreateMessageDTO = z.infer<typeof createMessageSchema>;
