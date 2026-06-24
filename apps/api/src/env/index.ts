import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  HOST: z.string().min(1).default("0.0.0.0"),
  PORT: z.coerce.number().int().positive().max(65_535).default(3333),
  DATABASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  WEB_ORIGIN: z.string().optional(),
  WEB_ORIGINS: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables", parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

const webOriginsSource = parsedEnv.data.WEB_ORIGINS ?? parsedEnv.data.WEB_ORIGIN;
const webOrigins = webOriginsSource
  ?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const webOriginsSchema = z.array(z.string().url()).min(1);
const parsedWebOrigins = webOriginsSchema.safeParse(webOrigins);

if (!parsedWebOrigins.success) {
  console.error("Invalid environment variables", {
    WEB_ORIGINS: parsedWebOrigins.error.flatten().formErrors,
  });
  process.exit(1);
}

export const env = {
  ...parsedEnv.data,
  WEB_ORIGINS: parsedWebOrigins.data,
};

export type Env = typeof env;
