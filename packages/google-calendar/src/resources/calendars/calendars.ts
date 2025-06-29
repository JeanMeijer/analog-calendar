// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIPromise } from "../../core/api-promise";
import { APIResource } from "../../core/resource";
import { buildHeaders } from "../../internal/headers";
import { RequestOptions } from "../../internal/request-options";
import { path } from "../../internal/utils/path";
import * as ACLAPI from "./acl";
import {
  ACL,
  ACLCreateParams,
  ACLDeleteParams,
  ACLRetrieveParams,
  ACLRetrieveResponse,
  ACLRetrieveRuleParams,
  ACLRule,
  ACLUpdateRuleParams,
  ACLWatchParams,
} from "./acl";
import * as EventsAPI from "./events";
import {
  Event,
  EventCreateParams,
  EventDeleteParams,
  EventImportParams,
  EventInstancesParams,
  EventListParams,
  EventMoveParams,
  EventQuickAddParams,
  EventRetrieveParams,
  EventUpdateParams,
  EventWatchParams,
  Events,
} from "./events";

export class Calendars extends APIResource {
  acl: ACLAPI.ACL = new ACLAPI.ACL(this._client);
  events: EventsAPI.Events = new EventsAPI.Events(this._client);

  /**
   * Creates a secondary calendar.
   */
  create(
    params: CalendarCreateParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Calendar> {
    const {
      alt,
      fields,
      key,
      oauth_token,
      prettyPrint,
      quotaUser,
      userIp,
      ...body
    } = params ?? {};
    return this._client.post("/calendars", {
      query: { alt, fields, key, oauth_token, prettyPrint, quotaUser, userIp },
      body,
      ...options,
    });
  }

  /**
   * Returns metadata for a calendar.
   */
  retrieve(
    calendarID: string,
    query: CalendarRetrieveParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Calendar> {
    return this._client.get(path`/calendars/${calendarID}`, {
      query,
      ...options,
    });
  }

  /**
   * Updates metadata for a calendar.
   */
  update(
    calendarID: string,
    params: CalendarUpdateParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Calendar> {
    const {
      alt,
      fields,
      key,
      oauth_token,
      prettyPrint,
      quotaUser,
      userIp,
      ...body
    } = params ?? {};
    return this._client.put(path`/calendars/${calendarID}`, {
      query: { alt, fields, key, oauth_token, prettyPrint, quotaUser, userIp },
      body,
      ...options,
    });
  }

  /**
   * Deletes a secondary calendar. Use calendars.clear for clearing all events on
   * primary calendars.
   */
  delete(
    calendarID: string,
    params: CalendarDeleteParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<void> {
    const { alt, fields, key, oauth_token, prettyPrint, quotaUser, userIp } =
      params ?? {};
    return this._client.delete(path`/calendars/${calendarID}`, {
      query: { alt, fields, key, oauth_token, prettyPrint, quotaUser, userIp },
      ...options,
      headers: buildHeaders([{ Accept: "*/*" }, options?.headers]),
    });
  }

  /**
   * Clears a primary calendar. This operation deletes all events associated with the
   * primary calendar of an account.
   */
  clear(
    calendarID: string,
    params: CalendarClearParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<void> {
    const { alt, fields, key, oauth_token, prettyPrint, quotaUser, userIp } =
      params ?? {};
    return this._client.post(path`/calendars/${calendarID}/clear`, {
      query: { alt, fields, key, oauth_token, prettyPrint, quotaUser, userIp },
      ...options,
      headers: buildHeaders([{ Accept: "*/*" }, options?.headers]),
    });
  }
}

export interface Calendar {
  /**
   * Identifier of the calendar. To retrieve IDs call the calendarList.list() method.
   */
  id?: string;

  /**
   * Conferencing properties for this calendar, for example what types of conferences
   * are allowed.
   */
  conferenceProperties?: Calendar.ConferenceProperties;

  /**
   * Description of the calendar. Optional.
   */
  description?: string;

  /**
   * ETag of the resource.
   */
  etag?: string;

  /**
   * Type of the resource ("calendar#calendar").
   */
  kind?: string;

  /**
   * Geographic location of the calendar as free-form text. Optional.
   */
  location?: string;

  /**
   * Title of the calendar.
   */
  summary?: string;

  /**
   * The time zone of the calendar. (Formatted as an IANA Time Zone Database name,
   * e.g. "Europe/Zurich".) Optional.
   */
  timeZone?: string;
}

export namespace Calendar {
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
}

export interface CalendarCreateParams {
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
   * Body param: Identifier of the calendar. To retrieve IDs call the
   * calendarList.list() method.
   */
  id?: string;

  /**
   * Body param: Conferencing properties for this calendar, for example what types of
   * conferences are allowed.
   */
  conferenceProperties?: CalendarCreateParams.ConferenceProperties;

  /**
   * Body param: Description of the calendar. Optional.
   */
  description?: string;

  /**
   * Body param: ETag of the resource.
   */
  etag?: string;

  /**
   * Body param: Type of the resource ("calendar#calendar").
   */
  kind?: string;

  /**
   * Body param: Geographic location of the calendar as free-form text. Optional.
   */
  location?: string;

  /**
   * Body param: Title of the calendar.
   */
  summary?: string;

  /**
   * Body param: The time zone of the calendar. (Formatted as an IANA Time Zone
   * Database name, e.g. "Europe/Zurich".) Optional.
   */
  timeZone?: string;
}

export namespace CalendarCreateParams {
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
}

export interface CalendarRetrieveParams {
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

export interface CalendarUpdateParams {
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
   * Body param: Identifier of the calendar. To retrieve IDs call the
   * calendarList.list() method.
   */
  id?: string;

  /**
   * Body param: Conferencing properties for this calendar, for example what types of
   * conferences are allowed.
   */
  conferenceProperties?: CalendarUpdateParams.ConferenceProperties;

  /**
   * Body param: Description of the calendar. Optional.
   */
  description?: string;

  /**
   * Body param: ETag of the resource.
   */
  etag?: string;

  /**
   * Body param: Type of the resource ("calendar#calendar").
   */
  kind?: string;

  /**
   * Body param: Geographic location of the calendar as free-form text. Optional.
   */
  location?: string;

  /**
   * Body param: Title of the calendar.
   */
  summary?: string;

  /**
   * Body param: The time zone of the calendar. (Formatted as an IANA Time Zone
   * Database name, e.g. "Europe/Zurich".) Optional.
   */
  timeZone?: string;
}

export namespace CalendarUpdateParams {
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
}

export interface CalendarDeleteParams {
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

export interface CalendarClearParams {
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

Calendars.ACL = ACL;

export declare namespace Calendars {
  export {
    type Calendar as Calendar,
    type CalendarCreateParams as CalendarCreateParams,
    type CalendarRetrieveParams as CalendarRetrieveParams,
    type CalendarUpdateParams as CalendarUpdateParams,
    type CalendarDeleteParams as CalendarDeleteParams,
    type CalendarClearParams as CalendarClearParams,
  };

  export {
    ACL as ACL,
    type ACLRule as ACLRule,
    type ACLRetrieveResponse as ACLRetrieveResponse,
    type ACLCreateParams as ACLCreateParams,
    type ACLRetrieveParams as ACLRetrieveParams,
    type ACLDeleteParams as ACLDeleteParams,
    type ACLRetrieveRuleParams as ACLRetrieveRuleParams,
    type ACLUpdateRuleParams as ACLUpdateRuleParams,
    type ACLWatchParams as ACLWatchParams,
  };

  export {
    type Events as Events,
    type Event as Event,
    type EventCreateParams as EventCreateParams,
    type EventRetrieveParams as EventRetrieveParams,
    type EventUpdateParams as EventUpdateParams,
    type EventListParams as EventListParams,
    type EventDeleteParams as EventDeleteParams,
    type EventImportParams as EventImportParams,
    type EventInstancesParams as EventInstancesParams,
    type EventMoveParams as EventMoveParams,
    type EventQuickAddParams as EventQuickAddParams,
    type EventWatchParams as EventWatchParams,
  };
}
