import { addDays, endOfDay, subDays } from "date-fns";

export const dateHelpers = {
  formatDateForAPI(date: Date | string, isAllDay: boolean): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isAllDay) {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } else {
      return dateObj.toISOString();
    }
  },

  parseGoogleDate(googleDate: { date?: string; dateTime?: string }, isAllDay: boolean): string {
    if (isAllDay && googleDate.date) {
      return `${googleDate.date}T00:00:00`;
    } else if (googleDate.dateTime) {
      return googleDate.dateTime;
    }
    return new Date().toISOString();
  },

  adjustEndDateForDisplay(startDate: Date, endDate: Date, allDay: boolean): Date {
    if (!allDay) {
      return endDate;
    }

    const nextDayOfStart = addDays(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()), 1);

    if (endDate.getTime() === nextDayOfStart.getTime()) {
      return endOfDay(startDate);
    } else {
      return endOfDay(subDays(endDate, 1));
    }
  },

  prepareGoogleParams(input: { title?: string; description?: string; location?: string; start?: string; end?: string; allDay?: boolean }) {
    const params: any = {};

    if (input.title !== undefined) params.summary = input.title;
    if (input.description !== undefined) params.description = input.description;
    if (input.location !== undefined) params.location = input.location;

    if (input.start && input.end) {
      if (input.allDay) {
        const startDate = input.start.substring(0, 10);
        let endDate = input.end.substring(0, 10);

        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);

        if (startDateObj.getTime() === endDateObj.getTime()) {
          const nextDay = addDays(endDateObj, 1);
          endDate = `${nextDay.getFullYear()}-${String(nextDay.getMonth() + 1).padStart(2, "0")}-${String(nextDay.getDate()).padStart(2, "0")}`;
        } else {
          const nextDay = addDays(endDateObj, 1);
          endDate = `${nextDay.getFullYear()}-${String(nextDay.getMonth() + 1).padStart(2, "0")}-${String(nextDay.getDate()).padStart(2, "0")}`;
        }

        params.start = { date: startDate };
        params.end = { date: endDate };
      } else {
        params.start = { dateTime: input.start, timeZone: "UTC" };
        params.end = { dateTime: input.end, timeZone: "UTC" };
      }
    }

    return params;
  },
};

export interface GoogleEventDate {
  date?: string;
  dateTime?: string;
  timeZone?: string;
}

export interface CalendarEventInput {
  title: string;
  start: string;
  end: string;
  allDay?: boolean;
  description?: string;
  location?: string;
}
