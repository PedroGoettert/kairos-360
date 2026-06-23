import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  HOST: z.string().min(1).default("0.0.0.0"),
  PORT: z.coerce.number().int().positive().max(65_535).default(3333),
  DATABASE_URL: z
    .string()
    .url()
    .default("postgres://postgres:postgres@localhost:5432/diagnostico_360"),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32)
    .default("diagnostico-360-development-secret-change-me"),
  BETTER_AUTH_URL: z.string().url().default("http://localhost:3333"),
  WEB_ORIGIN: z.string().url().default("http://localhost:3000"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables", parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsedEnv.data;
export type Env = typeof env;
