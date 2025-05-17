import {
  pgTable,
  text,
  boolean,
  integer,
  timestamp,
  date,
  jsonb,
  serial,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const eventStatusEnum = pgEnum("event_status", [
  "confirmed",
  "tentative",
  "cancelled",
]);

export const eventVisibilityEnum = pgEnum("event_visibility", [
  "default",
  "public",
  "private",
  "confidential",
]);

export const transparencyEnum = pgEnum("event_transparency", [
  "opaque",
  "transparent",
]);

export const eventTypeEnum = pgEnum("event_type", [
  "default",
  "birthday",
  "focusTime",
  "fromGmail",
  "outOfOffice",
  "workingLocation",
]);

export const attendeeResponseEnum = pgEnum("attendee_response", [
  "needsAction",
  "declined",
  "tentative",
  "accepted",
]);

export const entryPointTypeEnum = pgEnum("entry_point_type", [
  "video",
  "phone",
  "sip",
  "more",
]);

/* New enums */
export const accessRoleEnum = pgEnum("access_role", [
  "freeBusyReader",
  "reader",
  "writer",
  "owner",
]);

export const aclRoleEnum = pgEnum("acl_role", [
  "none",
  "freeBusyReader",
  "reader",
  "writer",
  "owner",
]);

export const scopeTypeEnum = pgEnum("scope_type", [
  "default",
  "user",
  "group",
  "domain",
]);

export const colorScopeEnum = pgEnum("color_scope", ["calendar", "event"]);

export const colors = pgTable("colors", {
  id: text("id").primaryKey(),
  scope: colorScopeEnum("scope").notNull(),
  background: text("background").notNull(), // e.g. "#0088aa"
  foreground: text("foreground").notNull(),
});

export const calendars = pgTable("calendars", {
  id: text("id").primaryKey(),
  summary: text("summary"),
  description: text("description"),
  timeZone: text("timezone"),
  location: text("location"),

  colorId: text("color_id").references(() => colors.id),
  conferenceProperties: jsonb("conference_properties"),
});

export const calendarList = pgTable("calendar_list", {
  id: serial("id").primaryKey(),
  calendarId: text("calendar_id")
    .references(() => calendars.id, { onDelete: "cascade" })
    .notNull(),

  accessRole: accessRoleEnum("access_role").notNull(),

  backgroundColor: text("background_color"),
  foregroundColor: text("foreground_color"),
  colorId: text("color_id").references(() => colors.id),

  description: text("description"),
  hidden: boolean("hidden").default(false),
  deleted: boolean("deleted").default(false),
  primary: boolean("primary").default(false),
  selected: boolean("selected").default(false),
  summaryOverride: text("summary_override"),

  defaultReminders: jsonb("default_reminders"),
  notificationSettings: jsonb("notification_settings"),
  conferenceProperties: jsonb("conference_properties"),
});

export const aclRules = pgTable("calendar_acl_rules", {
  id: text("id").primaryKey(),
  calendarId: text("calendar_id")
    .references(() => calendars.id, { onDelete: "cascade" })
    .notNull(),

  role: aclRoleEnum("role").notNull(),
  scopeType: scopeTypeEnum("scope_type").notNull(),
  scopeValue: text("scope_value"), // nullable for default scope
});

export const events = pgTable("events", {
  id: text("id").primaryKey(),
  calendarId: text("calendar_id")
    .references(() => calendars.id, { onDelete: "cascade" })
    .notNull(),

  icalUid: text("ical_uid").notNull(),
  summary: text("summary"),
  description: text("description"),
  location: text("location"),
  colorId: text("color_id").references(() => colors.id),

  created: timestamp("created", { withTimezone: true }).notNull(),
  updated: timestamp("updated", { withTimezone: true }).notNull(),

  startDate: date("start_date"),
  startDateTime: timestamp("start_datetime", { withTimezone: true }),
  startTimeZone: text("start_timezone"),

  endDate: date("end_date"),
  endDateTime: timestamp("end_datetime", { withTimezone: true }),
  endTimeZone: text("end_timezone"),

  endTimeUnspecified: boolean("end_time_unspecified"),

  status: eventStatusEnum("status").default("confirmed").notNull(),
  visibility: eventVisibilityEnum("visibility").default("default"),
  transparency: transparencyEnum("transparency").default("opaque"),
  eventType: eventTypeEnum("event_type").default("default").notNull(),

  anyoneCanAddSelf: boolean("anyone_can_add_self").default(false),
  attendeesOmitted: boolean("attendees_omitted").default(false),
  guestsCanInviteOthers: boolean("guests_can_invite_others").default(true),
  guestsCanModify: boolean("guests_can_modify").default(false),
  guestsCanSeeOtherGuests: boolean("guests_can_see_other_guests").default(true),
  privateCopy: boolean("private_copy").default(false),
  locked: boolean("locked").default(false),

  sequence: integer("sequence").default(0),

  recurrence: jsonb("recurrence"),
  extendedPropertiesPrivate: jsonb("extended_private"),
  extendedPropertiesShared: jsonb("extended_shared"),

  remindersUseDefault: boolean("reminders_use_default"),
  remindersOverrides: jsonb("reminders_overrides"),

  source: jsonb("source"),

  conferenceData: jsonb("conference_data"),
  focusTimeProperties: jsonb("focus_time_props"),
  outOfOfficeProperties: jsonb("ooo_props"),
  workingLocationProperties: jsonb("working_location_props"),

  startSortable: timestamp("start_sortable", { withTimezone: true }),
  endSortable: timestamp("end_sortable", { withTimezone: true }),
});

export const attachments = pgTable("event_attachments", {
  id: serial("id").primaryKey(),
  eventId: text("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),

  fileId: text("file_id"),
  fileUrl: text("file_url").notNull(),
  iconLink: text("icon_link"),
  mimeType: text("mime_type"),
  title: text("title"),
});

export const attendees = pgTable("event_attendees", {
  id: serial("id").primaryKey(),
  eventId: text("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),

  additionalGuests: integer("additional_guests").default(0),
  comment: text("comment"),
  displayName: text("display_name"),
  email: text("email"),
  profileId: text("profile_id"),

  optional: boolean("optional").default(false),
  organizer: boolean("organizer").default(false),
  resource: boolean("resource").default(false),
  responseStatus:
    attendeeResponseEnum("response_status").default("needsAction"),
  self: boolean("self").default(false),
});

export const conferences = pgTable("event_conferences", {
  eventId: text("event_id")
    .primaryKey()
    .references(() => events.id, { onDelete: "cascade" }),

  conferenceId: text("conference_id"),
  solutionType: text("solution_type"),
  solutionName: text("solution_name"),
  solutionIconUri: text("solution_icon_uri"),
  notes: text("notes"),
  signature: text("signature"),
  createRequest: jsonb("create_request"),
});

export const entryPoints = pgTable("conference_entry_points", {
  id: serial("id").primaryKey(),
  eventId: text("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),

  entryPointType: entryPointTypeEnum("entry_point_type").notNull(),
  uri: text("uri").notNull(),
  label: text("label"),
  accessCode: text("access_code"),
  meetingCode: text("meeting_code"),
  passcode: text("passcode"),
  password: text("password"),
  pin: text("pin"),
});

export const calendarsRelations = relations(calendars, ({ many }) => ({
  events: many(events),
  calendarListEntries: many(calendarList),
  aclRules: many(aclRules),
}));

export const calendarListRelations = relations(calendarList, ({ one }) => ({
  calendar: one(calendars, {
    fields: [calendarList.calendarId],
    references: [calendars.id],
  }),
}));

export const aclRelations = relations(aclRules, ({ one }) => ({
  calendar: one(calendars, {
    fields: [aclRules.calendarId],
    references: [calendars.id],
  }),
}));

export const eventsRelations = relations(events, ({ many, one }) => ({
  calendar: one(calendars, {
    fields: [events.calendarId],
    references: [calendars.id],
  }),
  attachments: many(attachments),
  attendees: many(attendees),
  conference: one(conferences),
  entryPoints: many(entryPoints),
}));

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  event: one(events, {
    fields: [attachments.eventId],
    references: [events.id],
  }),
}));

export const attendeesRelations = relations(attendees, ({ one }) => ({
  event: one(events, {
    fields: [attendees.eventId],
    references: [events.id],
  }),
}));

export const conferencesRelations = relations(conferences, ({ one, many }) => ({
  event: one(events, {
    fields: [conferences.eventId],
    references: [events.id],
  }),
  entryPoints: many(entryPoints),
}));

export const entryPointsRelations = relations(entryPoints, ({ one }) => ({
  event: one(events, {
    fields: [entryPoints.eventId],
    references: [events.id],
  }),
}));
