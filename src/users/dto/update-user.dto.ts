import { z } from 'zod';

export const updateUserSchema = z.object({
  username: z.string().min(1).max(80),
  displayName: z.string().min(1).max(80),
  avatar: z.string(),
  birthDate: z.string(),
});

export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
