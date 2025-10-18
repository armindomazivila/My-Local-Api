import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1).max(100)
});

export const updateUserSchema = createUserSchema; // same rules

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export type User = {
  id: number;
  name: string;
};