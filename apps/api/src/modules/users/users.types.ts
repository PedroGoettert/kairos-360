import type { z } from "zod";

import type { currentUserSchema } from "./users.schemas.js";

export type CurrentUser = z.infer<typeof currentUserSchema>;
