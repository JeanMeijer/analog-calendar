// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIPromise } from "../core/api-promise";
import { APIResource } from "../core/resource";
import { RequestOptions } from "../internal/request-options";

export class CheckFreeBusy extends APIResource {
  /**
   * Returns free/busy information for a set of calendars.
   */
  checkFreeBusy(
    params: CheckFreeBusyCheckFreeBusyParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<CheckFreeBusyCheckFreeBusyResponse> {
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
    return this._client.post("/freeBusy", {
      query: { alt, fields, key, oauth_token, prettyPrint, quotaUser, userIp },
      body,
      ...options,
    });
  }
}

export interface CheckFreeBusyCheckFreeBusyResponse {
  /**
   * List of free/busy information for calendars.
   */
  calendars?: Record<string, CheckFreeBusyCheckFreeBusyResponse.Calendars>;

  /**
   * Expansion of groups.
   */
  groups?: Record<string, CheckFreeBusyCheckFreeBusyResponse.Groups>;

  /**
   * Type of the resource ("calendar#freeBusy").
   */
  kind?: string;

  /**
   * The end of the interval.
   */
  timeMax?: string;

  /**
   * The start of the interval.
   */
  timeMin?: string;
}

export namespace CheckFreeBusyCheckFreeBusyResponse {
  /**
   * Free/busy expansions for a single calendar.
   */
  export interface Calendars {
    /**
     * List of time ranges during which this calendar should be regarded as busy.
     */
    busy?: Array<Calendars.Busy>;

    /**
     * Optional error(s) (if computation for the calendar failed).
     */
    errors?: Array<Calendars.Error>;
  }

  export namespace Calendars {
    export interface Busy {
      /**
       * The (exclusive) end of the time period.
       */
      end?: string;

      /**
       * The (inclusive) start of the time period.
       */
      start?: string;
    }

    export interface Error {
      /**
       * Domain, or broad category, of the error.
       */
      domain?: string;

      /**
       * Specific reason for the error. Some of the possible values are:
       *
       * - "groupTooBig" - The group of users requested is too large for a single query.
       * - "tooManyCalendarsRequested" - The number of calendars requested is too large
       *   for a single query.
       * - "notFound" - The requested resource was not found.
       * - "internalError" - The API service has encountered an internal error.
       *   Additional error types may be added in the future, so clients should
       *   gracefully handle additional error statuses not included in this list.
       */
      reason?: string;
    }
  }

  /**
   * List of calendars that are members of this group.
   */
  export interface Groups {
    /**
     * List of calendars' identifiers within a group.
     */
    calendars?: Array<string>;

    /**
     * Optional error(s) (if computation for the group failed).
     */
    errors?: Array<Groups.Error>;
  }

  export namespace Groups {
    export interface Error {
      /**
       * Domain, or broad category, of the error.
       */
      domain?: string;

      /**
       * Specific reason for the error. Some of the possible values are:
       *
       * - "groupTooBig" - The group of users requested is too large for a single query.
       * - "tooManyCalendarsRequested" - The number of calendars requested is too large
       *   for a single query.
       * - "notFound" - The requested resource was not found.
       * - "internalError" - The API service has encountered an internal error.
       *   Additional error types may be added in the future, so clients should
       *   gracefully handle additional error statuses not included in this list.
       */
      reason?: string;
    }
  }
}

export interface CheckFreeBusyCheckFreeBusyParams {
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
   * Body param: Maximal number of calendars for which FreeBusy information is to be
   * provided. Optional. Maximum value is 50.
   */
  calendarExpansionMax?: number;

  /**
   * Body param: Maximal number of calendar identifiers to be provided for a single
   * group. Optional. An error is returned for a group with more members than this
   * value. Maximum value is 100.
   */
  groupExpansionMax?: number;

  /**
   * Body param: List of calendars and/or groups to query.
   */
  items?: Array<CheckFreeBusyCheckFreeBusyParams.Item>;

  /**
   * Body param: The end of the interval for the query formatted as per RFC3339.
   */
  timeMax?: string;

  /**
   * Body param: The start of the interval for the query formatted as per RFC3339.
   */
  timeMin?: string;

  /**
   * Body param: Time zone used in the response. Optional. The default is UTC.
   */
  timeZone?: string;
}

export namespace CheckFreeBusyCheckFreeBusyParams {
  export interface Item {
    /**
     * The identifier of a calendar or a group.
     */
    id?: string;
  }
}

export declare namespace CheckFreeBusy {
  export {
    type CheckFreeBusyCheckFreeBusyResponse as CheckFreeBusyCheckFreeBusyResponse,
    type CheckFreeBusyCheckFreeBusyParams as CheckFreeBusyCheckFreeBusyParams,
  };
}
