import { pgTable, timestamp, uuid, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
});

export const feeds = pgTable("feeds", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    name: text("name").notNull(),
    url: text("website_url").notNull().unique(),
    user_id: uuid("user_id")
    .references(() => users.id, { onDelete: 'cascade' }).notNull(),
})

export const following = pgTable("feed_follows", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    user_id: uuid("user_id")
    .references(() => users.id, { onDelete: 'cascade' }).notNull(),
    feed_id: uuid("feed_id")
    .references(() => feeds.id, { onDelete: 'cascade' }).notNull(),
})
