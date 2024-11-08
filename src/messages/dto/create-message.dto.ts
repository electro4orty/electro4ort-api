import { z } from 'zod';

export const createMessageSchema = z.object({
  roomId: z.string(),
  userId: z.string(),
  body: z.string().max(255),
});

export type CreateMessageDTO = z.infer<typeof createMessageSchema>;
