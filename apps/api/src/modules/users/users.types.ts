import type { z } from "zod";

import type { currentUserSchema, userRoleSchema } from "./users.schemas.js";

export type CurrentUser = z.infer<typeof currentUserSchema>;
export type UserRole = z.infer<typeof userRoleSchema>;
