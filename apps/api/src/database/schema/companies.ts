import { relations } from "drizzle-orm";
import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { user } from "./auth.js";

export const companies = pgTable(
  "companies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ownerUserId: text("owner_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
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
    index("companies_owner_user_id_idx").on(table.ownerUserId),
    index("companies_name_idx").on(table.name),
  ],
);

export const companiesRelations = relations(companies, ({ one }) => ({
  owner: one(user, {
    fields: [companies.ownerUserId],
    references: [user.id],
  }),
}));
