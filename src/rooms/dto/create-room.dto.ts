import { z } from 'zod';

export const createRoomSchema = z.object({
  name: z.string().min(1).max(80),
  hubId: z.string(),
});

export type CreateRoomDTO = z.infer<typeof createRoomSchema>;
