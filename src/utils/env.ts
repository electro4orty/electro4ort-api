import { z, ZodError } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  DB_URL: z.string(),
  JWT_SECRET: z.string(),
});

export type Env = z.infer<typeof envSchema>;

try {
  envSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    let message = 'Missing required values in .env:\n';
    error.issues.forEach((issue) => {
      message += issue.path[0] + '\n';
    });
    const e = new Error(message);
    e.stack = '';
    throw e;
  } else {
    throw error;
  }
}

export const env = envSchema.parse(process.env);
