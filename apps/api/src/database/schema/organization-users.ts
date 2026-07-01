import { sql } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { user } from "./auth.js";
import { organizations } from "./organizations.js";

export const organizationUserRole = pgEnum("organization_user_role", [
  "owner",
  "admin",
  "manager",
  "viewer",
]);

export const organizationUserStatus = pgEnum("organization_user_status", [
  "active",
  "disabled",
]);

export const organizationUsers = pgTable(
  "organization_users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: organizationUserRole("role").default("viewer").notNull(),
    status: organizationUserStatus("status").default("active").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("organization_users_organization_id_idx").on(table.organizationId),
    index("organization_users_user_id_idx").on(table.userId),
    index("organization_users_role_idx").on(table.role),
    uniqueIndex("organization_users_active_user_idx")
      .on(table.userId)
      .where(sql`${table.status} = 'active'`),
    uniqueIndex("organization_users_org_user_idx").on(
      table.organizationId,
      table.userId,
    ),
  ],
);
