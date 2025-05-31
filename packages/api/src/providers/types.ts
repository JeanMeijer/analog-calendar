export interface DateInput {
  dateTime: string;
  timeZone: string;
}

export interface Calendar {
  id: string;
  provider: string;
  name: string;
  primary: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: DateInput;
  end: DateInput;
  allDay?: boolean;
  location?: string;
  status?: string;
  htmlLink?: string;
  color?: string;
}

export interface CalendarProvider {
  providerId: "google" | "microsoft";
  calendars(): Promise<Calendar[]>;
  events(
    calendarId: string,
    timeMin?: string,
    timeMax?: string,
  ): Promise<CalendarEvent[]>;
  createEvent(
    calendarId: string,
    event: Omit<CalendarEvent, "id">,
  ): Promise<CalendarEvent>;
  updateEvent(
    calendarId: string,
    eventId: string,
    event: Partial<CalendarEvent>,
  ): Promise<CalendarEvent>;
  deleteEvent(calendarId: string, eventId: string): Promise<void>;
}
