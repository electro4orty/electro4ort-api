import { z } from 'zod';

export const createRoomSchema = z.object({
  title: z.string().min(1).max(80),
  hubId: z.number(),
});

export type CreateRoomDTO = z.infer<typeof createRoomSchema>;
