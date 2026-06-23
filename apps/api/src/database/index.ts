import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "../env/index.js";
import * as schema from "./schema/index.js";

export const sql = postgres(env.DATABASE_URL);
export const db = drizzle(sql, { schema });
