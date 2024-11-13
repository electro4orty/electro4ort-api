import { z } from 'zod';

export const updateUserSchema = z.object({
  username: z.string().min(1).max(80),
  displayName: z.string().min(1).max(80),
  avatar: z.string().url().or(z.string().max(0)),
  birthDate: z.string(),
});

export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
