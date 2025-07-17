import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { account } from "./auth";

export const calendars = pgTable(
  "calendar",
  {
    id: text("id").primaryKey(),
    name: text("name"),
    description: text("description"),
    timeZone: text("time_zone"),
    primary: boolean("primary").default(false).notNull(),
    color: text("color"),

    calendarId: text("calendar_id").notNull(),

    syncToken: text("sync_token"),

    providerId: text("provider_id", {
      enum: ["google", "microsoft"],
    }).notNull(),
    accountId: text("account_id")
      .notNull()
      .references(() => account.id, { onDelete: "cascade" }),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [index("calendar_account_idx").on(table.accountId)],
);

export const calendarsRelations = relations(calendars, ({ one, many }) => ({
  account: one(account, {
    fields: [calendars.accountId],
    references: [account.id],
  }),
  events: many(events),
}));

export const events = pgTable(
  "event",
  {
    id: text("id").primaryKey(),
    title: text("title"),
    description: text("description"),

    start: timestamp("start", { withTimezone: true }).notNull(),
    startTimeZone: text("start_time_zone"),

    end: timestamp("end", { withTimezone: true }).notNull(),
    endTimeZone: text("end_time_zone"),

    allDay: boolean("all_day").default(false),
    location: text("location"),
    status: text("status"),
    url: text("url"),

    syncToken: text("sync_token"),

    calendarId: text("calendar_id")
      .notNull()
      .references(() => calendars.id, { onDelete: "cascade" }),
    providerId: text("provider_id", {
      enum: ["google", "microsoft"],
    }).notNull(),
    accountId: text("account_id")
      .notNull()
      .references(() => account.id, { onDelete: "cascade" }),

    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("event_account_idx").on(table.accountId),
    uniqueIndex("event_account_calendar_idx").on(
      table.accountId,
      table.calendarId,
    ),
  ],
);

export const eventsRelations = relations(events, ({ one }) => ({
  calendar: one(calendars, {
    fields: [events.calendarId],
    references: [calendars.id],
  }),
  account: one(account, {
    fields: [events.accountId],
    references: [account.id],
  }),
}));
