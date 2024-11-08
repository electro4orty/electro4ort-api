import { roomType } from '@/db/schema';
import { z } from 'zod';

export const createRoomSchema = z.object({
  name: z.string().min(1).max(80),
  hubSlug: z.string(),
  type: z.enum(roomType.enumValues),
});

export type CreateRoomDTO = z.infer<typeof createRoomSchema>;
