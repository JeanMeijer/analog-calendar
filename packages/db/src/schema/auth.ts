import { boolean, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text().primaryKey(),
  defaultConnectionId: text(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean()
    .$defaultFn(() => false)
    .notNull(),
  image: text(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const session = pgTable("session", {
  id: text().primaryKey(),
  expiresAt: timestamp().notNull(),
  token: text().notNull().unique(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp().notNull(),
  ipAddress: text(),
  userAgent: text(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text().primaryKey(),
  accountId: text().notNull(),
  providerId: text().notNull(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  accessTokenExpiresAt: timestamp(),
  refreshTokenExpiresAt: timestamp(),
  scope: text(),
  password: text(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp().notNull(),
});

export const verification = pgTable("verification", {
  id: text().primaryKey(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});

export const connection = pgTable(
  "connection",
  (d) => ({
    id: d.uuid().primaryKey().defaultRandom(),
    userId: d
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accountId: d
      .text()
      .notNull()
      .references(() => account.id, { onDelete: "cascade" }),
    email: d.text().notNull(),
    name: d.text(),
    image: d.text(),
    accessToken: d.text(),
    refreshToken: d.text(),
    scope: d.text().notNull(),
    providerId: d.text().$type<"google" | "microsoft">().notNull(),
    expiresAt: d.timestamp().notNull(),
    createdAt: d.timestamp().notNull(),
    updatedAt: d.timestamp().notNull(),
  }),
  (t) => [unique().on(t.userId, t.email, t.providerId)],
);
