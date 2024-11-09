import { z } from 'zod';

export const createMessageSchema = z.object({
  roomId: z.string(),
  userId: z.string(),
  body: z.string().max(255),
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
});

export type CreateMessageDTO = z.infer<typeof createMessageSchema>;
