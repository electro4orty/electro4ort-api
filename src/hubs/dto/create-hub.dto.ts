import { z } from 'zod';

export const createHubSchema = z.object({
  title: z.string().min(1).max(80),
});

export type CreateHubDTO = z.infer<typeof createHubSchema>;
