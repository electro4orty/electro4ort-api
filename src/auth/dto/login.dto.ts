import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1).max(32),
  password: z.string().min(1).max(4),
});

export type LoginDTO = z.infer<typeof loginSchema>;
