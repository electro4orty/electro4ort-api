import { z } from 'zod';

export const createHubSchema = z.object({
  name: z.string().min(1).max(80),
  avatar: z.string().url(),
});

export type CreateHubDTO = z.infer<typeof createHubSchema>;
