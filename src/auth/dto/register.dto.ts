import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(1).max(32),
  password: z.string().min(1).max(4),
  displayName: z.string().min(1).max(32),
});

export type RegisterDTO = z.infer<typeof registerSchema>;
