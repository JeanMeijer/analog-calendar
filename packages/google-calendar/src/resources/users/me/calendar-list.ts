// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIPromise } from "../../../core/api-promise";
import { APIResource } from "../../../core/resource";
import { buildHeaders } from "../../../internal/headers";
import { RequestOptions } from "../../../internal/request-options";
import { path } from "../../../internal/utils/path";
import * as Shared from "../../shared";

export class CalendarList extends APIResource {
  /**
   * Inserts an existing calendar into the user's calendar list.
   */
  create(
    params: CalendarListCreateParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<CalendarListEntry> {
    const {
      alt,
      colorRgbFormat,
      fields,
      key,
      oauth_token,
      prettyPrint,
      quotaUser,
      userIp,
      ...body
    } = params ?? {};
    return this._client.post("/users/me/calendarList", {
      query: {
        alt,
        colorRgbFormat,
        fields,
        key,
        oauth_token,
        prettyPrint,
        quotaUser,
        userIp,
      },
      body,
      ...options,
    });
  }

  /**
   * Returns a calendar from the user's calendar list.
   */
  retrieve(
    calendarID: string,
    query: CalendarListRetrieveParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<CalendarListEntry> {
    return this._client.get(path`/users/me/calendarList/${calendarID}`, {
      query,
      ...options,
    });
  }

  /**
   * Updates an existing calendar on the user's calendar list.
   */
  update(
    calendarID: string,
    params: CalendarListUpdateParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<CalendarListEntry> {
    const {
      alt,
      colorRgbFormat,
      fields,
      key,
      oauth_token,
      prettyPrint,
      quotaUser,
      userIp,
      ...body
    } = params ?? {};
    return this._client.put(path`/users/me/calendarList/${calendarID}`, {
      query: {
        alt,
        colorRgbFormat,
        fields,
        key,
        oauth_token,
        prettyPrint,
        quotaUser,
        userIp,
      },
      body,
      ...options,
    });
  }

  /**
   * Returns the calendars on the user's calendar list.
   */
  list(
    query: CalendarListListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<CalendarListListResponse> {
    return this._client.get("/users/me/calendarList", { query, ...options });
  }

  /**
   * Removes a calendar from the user's calendar list.
   */
  delete(
    calendarID: string,
    params: CalendarListDeleteParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<void> {
    const { alt, fields, key, oauth_token, prettyPrint, quotaUser, userIp } =
      params ?? {};
    return this._client.delete(path`/users/me/calendarList/${calendarID}`, {
      query: { alt, fields, key, oauth_token, prettyPrint, quotaUser, userIp },
      ...options,
      headers: buildHeaders([{ Accept: "*/*" }, options?.headers]),
    });
  }

  /**
   * Watch for changes to CalendarList resources.
   */
  watch(
    params: CalendarListWatchParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.Channel> {
    const {
      alt,
      fields,
      key,
      maxResults,
      minAccessRole,
      oauth_token,
      pageToken,
      prettyPrint,
      quotaUser,
      showDeleted,
      showHidden,
      syncToken,
      userIp,
      ...body
    } = params ?? {};
    return this._client.post("/users/me/calendarList/watch", {
      query: {
        alt,
        fields,
        key,
        maxResults,
        minAccessRole,
        oauth_token,
        pageToken,
        prettyPrint,
        quotaUser,
        showDeleted,
        showHidden,
        syncToken,
        userIp,
      },
      body,
      ...options,
    });
  }
}

export interface CalendarListEntry {
  /**
   * Identifier of the calendar.
   */
  id?: string;

  /**
   * The effective access role that the authenticated user has on the calendar.
   * Read-only. Possible values are:
   *
   * - "freeBusyReader" - Provides read access to free/busy information.
   * - "reader" - Provides read access to the calendar. Private events will appear to
   *   users with reader access, but event details will be hidden.
   * - "writer" - Provides read and write access to the calendar. Private events will
   *   appear to users with writer access, and event details will be visible.
   * - "owner" - Provides ownership of the calendar. This role has all of the
   *   permissions of the writer role with the additional ability to see and
   *   manipulate ACLs.
   */
  accessRole?: string;

  /**
   * The main color of the calendar in the hexadecimal format "#0088aa". This
   * property supersedes the index-based colorId property. To set or change this
   * property, you need to specify colorRgbFormat=true in the parameters of the
   * insert, update and patch methods. Optional.
   */
  backgroundColor?: string;

  /**
   * The color of the calendar. This is an ID referring to an entry in the calendar
   * section of the colors definition (see the colors endpoint). This property is
   * superseded by the backgroundColor and foregroundColor properties and can be
   * ignored when using these properties. Optional.
   */
  colorId?: string;

  /**
   * Conferencing properties for this calendar, for example what types of conferences
   * are allowed.
   */
  conferenceProperties?: CalendarListEntry.ConferenceProperties;

  /**
   * The default reminders that the authenticated user has for this calendar.
   */
  defaultReminders?: Array<CalendarListEntry.DefaultReminder>;

  /**
   * Whether this calendar list entry has been deleted from the calendar list.
   * Read-only. Optional. The default is False.
   */
  deleted?: boolean;

  /**
   * Description of the calendar. Optional. Read-only.
   */
  description?: string;

  /**
   * ETag of the resource.
   */
  etag?: string;

  /**
   * The foreground color of the calendar in the hexadecimal format "#ffffff". This
   * property supersedes the index-based colorId property. To set or change this
   * property, you need to specify colorRgbFormat=true in the parameters of the
   * insert, update and patch methods. Optional.
   */
  foregroundColor?: string;

  /**
   * Whether the calendar has been hidden from the list. Optional. The attribute is
   * only returned when the calendar is hidden, in which case the value is true.
   */
  hidden?: boolean;

  /**
   * Type of the resource ("calendar#calendarListEntry").
   */
  kind?: string;

  /**
   * Geographic location of the calendar as free-form text. Optional. Read-only.
   */
  location?: string;

  /**
   * The notifications that the authenticated user is receiving for this calendar.
   */
  notificationSettings?: CalendarListEntry.NotificationSettings;

  /**
   * Whether the calendar is the primary calendar of the authenticated user.
   * Read-only. Optional. The default is False.
   */
  primary?: boolean;

  /**
   * Whether the calendar content shows up in the calendar UI. Optional. The default
   * is False.
   */
  selected?: boolean;

  /**
   * Title of the calendar. Read-only.
   */
  summary?: string;

  /**
   * The summary that the authenticated user has set for this calendar. Optional.
   */
  summaryOverride?: string;

  /**
   * The time zone of the calendar. Optional. Read-only.
   */
  timeZone?: string;
}

export namespace CalendarListEntry {
  /**
   * Conferencing properties for this calendar, for example what types of conferences
   * are allowed.
   */
  export interface ConferenceProperties {
    /**
     * The types of conference solutions that are supported for this calendar. The
     * possible values are:
     *
     * - "eventHangout"
     * - "eventNamedHangout"
     * - "hangoutsMeet" Optional.
     */
    allowedConferenceSolutionTypes?: Array<string>;
  }

  export interface DefaultReminder {
    /**
     * The method used by this reminder. Possible values are:
     *
     * - "email" - Reminders are sent via email.
     * - "popup" - Reminders are sent via a UI popup.
     *   Required when adding a reminder.
     */
    method?: string;

    /**
     * Number of minutes before the start of the event when the reminder should
     * trigger. Valid values are between 0 and 40320 (4 weeks in minutes). Required
     * when adding a reminder.
     */
    minutes?: number;
  }

  /**
   * The notifications that the authenticated user is receiving for this calendar.
   */
  export interface NotificationSettings {
    /**
     * The list of notifications set for this calendar.
     */
    notifications?: Array<NotificationSettings.Notification>;
  }

  export namespace NotificationSettings {
    export interface Notification {
      /**
       * The method used to deliver the notification. The possible value is:
       *
       * - "email" - Notifications are sent via email.
       *   Required when adding a notification.
       */
      method?: string;

      /**
       * The type of notification. Possible values are:
       *
       * - "eventCreation" - Notification sent when a new event is put on the calendar.
       * - "eventChange" - Notification sent when an event is changed.
       * - "eventCancellation" - Notification sent when an event is cancelled.
       * - "eventResponse" - Notification sent when an attendee responds to the event
       *   invitation.
       * - "agenda" - An agenda with the events of the day (sent out in the morning).
       *   Required when adding a notification.
       */
      type?: string;
    }
  }
}

export interface CalendarListListResponse {
  /**
   * ETag of the collection.
   */
  etag?: string;

  /**
   * Calendars that are present on the user's calendar list.
   */
  items?: Array<CalendarListEntry>;

  /**
   * Type of the collection ("calendar#calendarList").
   */
  kind?: string;

  /**
   * Token used to access the next page of this result. Omitted if no further results
   * are available, in which case nextSyncToken is provided.
   */
  nextPageToken?: string;

  /**
   * Token used at a later point in time to retrieve only the entries that have
   * changed since this result was returned. Omitted if further results are
   * available, in which case nextPageToken is provided.
   */
  nextSyncToken?: string;
}

export interface CalendarListCreateParams {
  /**
   * Query param: Data format for the response.
   */
  alt?: "json";

  /**
   * Query param: Whether to use the foregroundColor and backgroundColor fields to
   * write the calendar colors (RGB). If this feature is used, the index-based
   * colorId field will be set to the best matching option automatically. Optional.
   * The default is False.
   */
  colorRgbFormat?: boolean;

  /**
   * Query param: Selector specifying which fields to include in a partial response.
   */
  fields?: string;

  /**
   * Query param: API key. Your API key identifies your project and provides you with
   * API access, quota, and reports. Required unless you provide an OAuth 2.0 token.
   */
  key?: string;

  /**
   * Query param: OAuth 2.0 token for the current user.
   */
  oauth_token?: string;

  /**
   * Query param: Returns response with indentations and line breaks.
   */
  prettyPrint?: boolean;

  /**
   * Query param: An opaque string that represents a user for quota purposes. Must
   * not exceed 40 characters.
   */
  quotaUser?: string;

  /**
   * Query param: Deprecated. Please use quotaUser instead.
   */
  userIp?: string;

  /**
   * Body param: Identifier of the calendar.
   */
  id?: string;

  /**
   * Body param: The effective access role that the authenticated user has on the
   * calendar. Read-only. Possible values are:
   *
   * - "freeBusyReader" - Provides read access to free/busy information.
   * - "reader" - Provides read access to the calendar. Private events will appear to
   *   users with reader access, but event details will be hidden.
   * - "writer" - Provides read and write access to the calendar. Private events will
   *   appear to users with writer access, and event details will be visible.
   * - "owner" - Provides ownership of the calendar. This role has all of the
   *   permissions of the writer role with the additional ability to see and
   *   manipulate ACLs.
   */
  accessRole?: string;

  /**
   * Body param: The main color of the calendar in the hexadecimal format "#0088aa".
   * This property supersedes the index-based colorId property. To set or change this
   * property, you need to specify colorRgbFormat=true in the parameters of the
   * insert, update and patch methods. Optional.
   */
  backgroundColor?: string;

  /**
   * Body param: The color of the calendar. This is an ID referring to an entry in
   * the calendar section of the colors definition (see the colors endpoint). This
   * property is superseded by the backgroundColor and foregroundColor properties and
   * can be ignored when using these properties. Optional.
   */
  colorId?: string;

  /**
   * Body param: Conferencing properties for this calendar, for example what types of
   * conferences are allowed.
   */
  conferenceProperties?: CalendarListCreateParams.ConferenceProperties;

  /**
   * Body param: The default reminders that the authenticated user has for this
   * calendar.
   */
  defaultReminders?: Array<CalendarListCreateParams.DefaultReminder>;

  /**
   * Body param: Whether this calendar list entry has been deleted from the calendar
   * list. Read-only. Optional. The default is False.
   */
  deleted?: boolean;

  /**
   * Body param: Description of the calendar. Optional. Read-only.
   */
  description?: string;

  /**
   * Body param: ETag of the resource.
   */
  etag?: string;

  /**
   * Body param: The foreground color of the calendar in the hexadecimal format
   * "#ffffff". This property supersedes the index-based colorId property. To set or
   * change this property, you need to specify colorRgbFormat=true in the parameters
   * of the insert, update and patch methods. Optional.
   */
  foregroundColor?: string;

  /**
   * Body param: Whether the calendar has been hidden from the list. Optional. The
   * attribute is only returned when the calendar is hidden, in which case the value
   * is true.
   */
  hidden?: boolean;

  /**
   * Body param: Type of the resource ("calendar#calendarListEntry").
   */
  kind?: string;

  /**
   * Body param: Geographic location of the calendar as free-form text. Optional.
   * Read-only.
   */
  location?: string;

  /**
   * Body param: The notifications that the authenticated user is receiving for this
   * calendar.
   */
  notificationSettings?: CalendarListCreateParams.NotificationSettings;

  /**
   * Body param: Whether the calendar is the primary calendar of the authenticated
   * user. Read-only. Optional. The default is False.
   */
  primary?: boolean;

  /**
   * Body param: Whether the calendar content shows up in the calendar UI. Optional.
   * The default is False.
   */
  selected?: boolean;

  /**
   * Body param: Title of the calendar. Read-only.
   */
  summary?: string;

  /**
   * Body param: The summary that the authenticated user has set for this calendar.
   * Optional.
   */
  summaryOverride?: string;

  /**
   * Body param: The time zone of the calendar. Optional. Read-only.
   */
  timeZone?: string;
}

export namespace CalendarListCreateParams {
  /**
   * Conferencing properties for this calendar, for example what types of conferences
   * are allowed.
   */
  export interface ConferenceProperties {
    /**
     * The types of conference solutions that are supported for this calendar. The
     * possible values are:
     *
     * - "eventHangout"
     * - "eventNamedHangout"
     * - "hangoutsMeet" Optional.
     */
    allowedConferenceSolutionTypes?: Array<string>;
  }

  export interface DefaultReminder {
    /**
     * The method used by this reminder. Possible values are:
     *
     * - "email" - Reminders are sent via email.
     * - "popup" - Reminders are sent via a UI popup.
     *   Required when adding a reminder.
     */
    method?: string;

    /**
     * Number of minutes before the start of the event when the reminder should
     * trigger. Valid values are between 0 and 40320 (4 weeks in minutes). Required
     * when adding a reminder.
     */
    minutes?: number;
  }

  /**
   * The notifications that the authenticated user is receiving for this calendar.
   */
  export interface NotificationSettings {
    /**
     * The list of notifications set for this calendar.
     */
    notifications?: Array<NotificationSettings.Notification>;
  }

  export namespace NotificationSettings {
    export interface Notification {
      /**
       * The method used to deliver the notification. The possible value is:
       *
       * - "email" - Notifications are sent via email.
       *   Required when adding a notification.
       */
      method?: string;

      /**
       * The type of notification. Possible values are:
       *
       * - "eventCreation" - Notification sent when a new event is put on the calendar.
       * - "eventChange" - Notification sent when an event is changed.
       * - "eventCancellation" - Notification sent when an event is cancelled.
       * - "eventResponse" - Notification sent when an attendee responds to the event
       *   invitation.
       * - "agenda" - An agenda with the events of the day (sent out in the morning).
       *   Required when adding a notification.
       */
      type?: string;
    }
  }
}

export interface CalendarListRetrieveParams {
  /**
   * Data format for the response.
   */
  alt?: "json";

  /**
   * Selector specifying which fields to include in a partial response.
   */
  fields?: string;

  /**
   * API key. Your API key identifies your project and provides you with API access,
   * quota, and reports. Required unless you provide an OAuth 2.0 token.
   */
  key?: string;

  /**
   * OAuth 2.0 token for the current user.
   */
  oauth_token?: string;

  /**
   * Returns response with indentations and line breaks.
   */
  prettyPrint?: boolean;

  /**
   * An opaque string that represents a user for quota purposes. Must not exceed 40
   * characters.
   */
  quotaUser?: string;

  /**
   * Deprecated. Please use quotaUser instead.
   */
  userIp?: string;
}

export interface CalendarListUpdateParams {
  /**
   * Query param: Data format for the response.
   */
  alt?: "json";

  /**
   * Query param: Whether to use the foregroundColor and backgroundColor fields to
   * write the calendar colors (RGB). If this feature is used, the index-based
   * colorId field will be set to the best matching option automatically. Optional.
   * The default is False.
   */
  colorRgbFormat?: boolean;

  /**
   * Query param: Selector specifying which fields to include in a partial response.
   */
  fields?: string;

  /**
   * Query param: API key. Your API key identifies your project and provides you with
   * API access, quota, and reports. Required unless you provide an OAuth 2.0 token.
   */
  key?: string;

  /**
   * Query param: OAuth 2.0 token for the current user.
   */
  oauth_token?: string;

  /**
   * Query param: Returns response with indentations and line breaks.
   */
  prettyPrint?: boolean;

  /**
   * Query param: An opaque string that represents a user for quota purposes. Must
   * not exceed 40 characters.
   */
  quotaUser?: string;

  /**
   * Query param: Deprecated. Please use quotaUser instead.
   */
  userIp?: string;

  /**
   * Body param: Identifier of the calendar.
   */
  id?: string;

  /**
   * Body param: The effective access role that the authenticated user has on the
   * calendar. Read-only. Possible values are:
   *
   * - "freeBusyReader" - Provides read access to free/busy information.
   * - "reader" - Provides read access to the calendar. Private events will appear to
   *   users with reader access, but event details will be hidden.
   * - "writer" - Provides read and write access to the calendar. Private events will
   *   appear to users with writer access, and event details will be visible.
   * - "owner" - Provides ownership of the calendar. This role has all of the
   *   permissions of the writer role with the additional ability to see and
   *   manipulate ACLs.
   */
  accessRole?: string;

  /**
   * Body param: The main color of the calendar in the hexadecimal format "#0088aa".
   * This property supersedes the index-based colorId property. To set or change this
   * property, you need to specify colorRgbFormat=true in the parameters of the
   * insert, update and patch methods. Optional.
   */
  backgroundColor?: string;

  /**
   * Body param: The color of the calendar. This is an ID referring to an entry in
   * the calendar section of the colors definition (see the colors endpoint). This
   * property is superseded by the backgroundColor and foregroundColor properties and
   * can be ignored when using these properties. Optional.
   */
  colorId?: string;

  /**
   * Body param: Conferencing properties for this calendar, for example what types of
   * conferences are allowed.
   */
  conferenceProperties?: CalendarListUpdateParams.ConferenceProperties;

  /**
   * Body param: The default reminders that the authenticated user has for this
   * calendar.
   */
  defaultReminders?: Array<CalendarListUpdateParams.DefaultReminder>;

  /**
   * Body param: Whether this calendar list entry has been deleted from the calendar
   * list. Read-only. Optional. The default is False.
   */
  deleted?: boolean;

  /**
   * Body param: Description of the calendar. Optional. Read-only.
   */
  description?: string;

  /**
   * Body param: ETag of the resource.
   */
  etag?: string;

  /**
   * Body param: The foreground color of the calendar in the hexadecimal format
   * "#ffffff". This property supersedes the index-based colorId property. To set or
   * change this property, you need to specify colorRgbFormat=true in the parameters
   * of the insert, update and patch methods. Optional.
   */
  foregroundColor?: string;

  /**
   * Body param: Whether the calendar has been hidden from the list. Optional. The
   * attribute is only returned when the calendar is hidden, in which case the value
   * is true.
   */
  hidden?: boolean;

  /**
   * Body param: Type of the resource ("calendar#calendarListEntry").
   */
  kind?: string;

  /**
   * Body param: Geographic location of the calendar as free-form text. Optional.
   * Read-only.
   */
  location?: string;

  /**
   * Body param: The notifications that the authenticated user is receiving for this
   * calendar.
   */
  notificationSettings?: CalendarListUpdateParams.NotificationSettings;

  /**
   * Body param: Whether the calendar is the primary calendar of the authenticated
   * user. Read-only. Optional. The default is False.
   */
  primary?: boolean;

  /**
   * Body param: Whether the calendar content shows up in the calendar UI. Optional.
   * The default is False.
   */
  selected?: boolean;

  /**
   * Body param: Title of the calendar. Read-only.
   */
  summary?: string;

  /**
   * Body param: The summary that the authenticated user has set for this calendar.
   * Optional.
   */
  summaryOverride?: string;

  /**
   * Body param: The time zone of the calendar. Optional. Read-only.
   */
  timeZone?: string;
}

export namespace CalendarListUpdateParams {
  /**
   * Conferencing properties for this calendar, for example what types of conferences
   * are allowed.
   */
  export interface ConferenceProperties {
    /**
     * The types of conference solutions that are supported for this calendar. The
     * possible values are:
     *
     * - "eventHangout"
     * - "eventNamedHangout"
     * - "hangoutsMeet" Optional.
     */
    allowedConferenceSolutionTypes?: Array<string>;
  }

  export interface DefaultReminder {
    /**
     * The method used by this reminder. Possible values are:
     *
     * - "email" - Reminders are sent via email.
     * - "popup" - Reminders are sent via a UI popup.
     *   Required when adding a reminder.
     */
    method?: string;

    /**
     * Number of minutes before the start of the event when the reminder should
     * trigger. Valid values are between 0 and 40320 (4 weeks in minutes). Required
     * when adding a reminder.
     */
    minutes?: number;
  }

  /**
   * The notifications that the authenticated user is receiving for this calendar.
   */
  export interface NotificationSettings {
    /**
     * The list of notifications set for this calendar.
     */
    notifications?: Array<NotificationSettings.Notification>;
  }

  export namespace NotificationSettings {
    export interface Notification {
      /**
       * The method used to deliver the notification. The possible value is:
       *
       * - "email" - Notifications are sent via email.
       *   Required when adding a notification.
       */
      method?: string;

      /**
       * The type of notification. Possible values are:
       *
       * - "eventCreation" - Notification sent when a new event is put on the calendar.
       * - "eventChange" - Notification sent when an event is changed.
       * - "eventCancellation" - Notification sent when an event is cancelled.
       * - "eventResponse" - Notification sent when an attendee responds to the event
       *   invitation.
       * - "agenda" - An agenda with the events of the day (sent out in the morning).
       *   Required when adding a notification.
       */
      type?: string;
    }
  }
}

export interface CalendarListListParams {
  /**
   * Data format for the response.
   */
  alt?: "json";

  /**
   * Selector specifying which fields to include in a partial response.
   */
  fields?: string;

  /**
   * API key. Your API key identifies your project and provides you with API access,
   * quota, and reports. Required unless you provide an OAuth 2.0 token.
   */
  key?: string;

  /**
   * Maximum number of entries returned on one result page. By default the value is
   * 100 entries. The page size can never be larger than 250 entries. Optional.
   */
  maxResults?: number;

  /**
   * The minimum access role for the user in the returned entries. Optional. The
   * default is no restriction.
   */
  minAccessRole?: "freeBusyReader" | "owner" | "reader" | "writer";

  /**
   * OAuth 2.0 token for the current user.
   */
  oauth_token?: string;

  /**
   * Token specifying which result page to return. Optional.
   */
  pageToken?: string;

  /**
   * Returns response with indentations and line breaks.
   */
  prettyPrint?: boolean;

  /**
   * An opaque string that represents a user for quota purposes. Must not exceed 40
   * characters.
   */
  quotaUser?: string;

  /**
   * Whether to include deleted calendar list entries in the result. Optional. The
   * default is False.
   */
  showDeleted?: boolean;

  /**
   * Whether to show hidden entries. Optional. The default is False.
   */
  showHidden?: boolean;

  /**
   * Token obtained from the nextSyncToken field returned on the last page of results
   * from the previous list request. It makes the result of this list request contain
   * only entries that have changed since then. If only read-only fields such as
   * calendar properties or ACLs have changed, the entry won't be returned. All
   * entries deleted and hidden since the previous list request will always be in the
   * result set and it is not allowed to set showDeleted neither showHidden to False.
   * To ensure client state consistency minAccessRole query parameter cannot be
   * specified together with nextSyncToken. If the syncToken expires, the server will
   * respond with a 410 GONE response code and the client should clear its storage
   * and perform a full synchronization without any syncToken. Learn more about
   * incremental synchronization. Optional. The default is to return all entries.
   */
  syncToken?: string;

  /**
   * Deprecated. Please use quotaUser instead.
   */
  userIp?: string;
}

export interface CalendarListDeleteParams {
  /**
   * Data format for the response.
   */
  alt?: "json";

  /**
   * Selector specifying which fields to include in a partial response.
   */
  fields?: string;

  /**
   * API key. Your API key identifies your project and provides you with API access,
   * quota, and reports. Required unless you provide an OAuth 2.0 token.
   */
  key?: string;

  /**
   * OAuth 2.0 token for the current user.
   */
  oauth_token?: string;

  /**
   * Returns response with indentations and line breaks.
   */
  prettyPrint?: boolean;

  /**
   * An opaque string that represents a user for quota purposes. Must not exceed 40
   * characters.
   */
  quotaUser?: string;

  /**
   * Deprecated. Please use quotaUser instead.
   */
  userIp?: string;
}

export interface CalendarListWatchParams {
  /**
   * Query param: Data format for the response.
   */
  alt?: "json";

  /**
   * Query param: Selector specifying which fields to include in a partial response.
   */
  fields?: string;

  /**
   * Query param: API key. Your API key identifies your project and provides you with
   * API access, quota, and reports. Required unless you provide an OAuth 2.0 token.
   */
  key?: string;

  /**
   * Query param: Maximum number of entries returned on one result page. By default
   * the value is 100 entries. The page size can never be larger than 250 entries.
   * Optional.
   */
  maxResults?: number;

  /**
   * Query param: The minimum access role for the user in the returned entries.
   * Optional. The default is no restriction.
   */
  minAccessRole?: "freeBusyReader" | "owner" | "reader" | "writer";

  /**
   * Query param: OAuth 2.0 token for the current user.
   */
  oauth_token?: string;

  /**
   * Query param: Token specifying which result page to return. Optional.
   */
  pageToken?: string;

  /**
   * Query param: Returns response with indentations and line breaks.
   */
  prettyPrint?: boolean;

  /**
   * Query param: An opaque string that represents a user for quota purposes. Must
   * not exceed 40 characters.
   */
  quotaUser?: string;

  /**
   * Query param: Whether to include deleted calendar list entries in the result.
   * Optional. The default is False.
   */
  showDeleted?: boolean;

  /**
   * Query param: Whether to show hidden entries. Optional. The default is False.
   */
  showHidden?: boolean;

  /**
   * Query param: Token obtained from the nextSyncToken field returned on the last
   * page of results from the previous list request. It makes the result of this list
   * request contain only entries that have changed since then. If only read-only
   * fields such as calendar properties or ACLs have changed, the entry won't be
   * returned. All entries deleted and hidden since the previous list request will
   * always be in the result set and it is not allowed to set showDeleted neither
   * showHidden to False. To ensure client state consistency minAccessRole query
   * parameter cannot be specified together with nextSyncToken. If the syncToken
   * expires, the server will respond with a 410 GONE response code and the client
   * should clear its storage and perform a full synchronization without any
   * syncToken. Learn more about incremental synchronization. Optional. The default
   * is to return all entries.
   */
  syncToken?: string;

  /**
   * Query param: Deprecated. Please use quotaUser instead.
   */
  userIp?: string;

  /**
   * Body param: A UUID or similar unique string that identifies this channel.
   */
  id?: string;

  /**
   * Body param: An arbitrary string delivered to the target address with each
   * notification delivered over this channel. Optional.
   */
  token?: string;

  /**
   * Body param: The address where notifications are delivered for this channel.
   */
  address?: string;

  /**
   * Body param: Date and time of notification channel expiration, expressed as a
   * Unix timestamp, in milliseconds. Optional.
   */
  expiration?: string;

  /**
   * Body param: Identifies this as a notification channel used to watch for changes
   * to a resource, which is "api#channel".
   */
  kind?: string;

  /**
   * Body param: Additional parameters controlling delivery channel behavior.
   * Optional.
   */
  params?: Record<string, string>;

  /**
   * Body param: A Boolean value to indicate whether payload is wanted. Optional.
   */
  payload?: boolean;

  /**
   * Body param: An opaque ID that identifies the resource being watched on this
   * channel. Stable across different API versions.
   */
  resourceId?: string;

  /**
   * Body param: A version-specific identifier for the watched resource.
   */
  resourceUri?: string;

  /**
   * Body param: The type of delivery mechanism used for this channel. Valid values
   * are "web_hook" (or "webhook"). Both values refer to a channel where Http
   * requests are used to deliver messages.
   */
  type?: string;
}

export declare namespace CalendarList {
  export {
    type CalendarListEntry as CalendarListEntry,
    type CalendarListListResponse as CalendarListListResponse,
    type CalendarListCreateParams as CalendarListCreateParams,
    type CalendarListRetrieveParams as CalendarListRetrieveParams,
    type CalendarListUpdateParams as CalendarListUpdateParams,
    type CalendarListListParams as CalendarListListParams,
    type CalendarListDeleteParams as CalendarListDeleteParams,
    type CalendarListWatchParams as CalendarListWatchParams,
  };
}
