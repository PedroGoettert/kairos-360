import { relations } from "drizzle-orm";
import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { user } from "./auth.js";

export const organizations = pgTable(
  "organizations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    createdByUserId: text("created_by_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    tradeName: text("trade_name"),
    document: text("document"),
    industry: text("industry"),
    website: text("website"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("organizations_created_by_user_id_idx").on(table.createdByUserId),
    index("organizations_name_idx").on(table.name),
    uniqueIndex("organizations_slug_idx").on(table.slug),
  ],
);

export const organizationsRelations = relations(organizations, ({ one }) => ({
  createdBy: one(user, {
    fields: [organizations.createdByUserId],
    references: [user.id],
  }),
}));
