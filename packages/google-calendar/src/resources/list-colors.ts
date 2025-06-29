// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIPromise } from "../core/api-promise";
import { APIResource } from "../core/resource";
import { RequestOptions } from "../internal/request-options";

export class ListColors extends APIResource {
  /**
   * Returns the color definitions for calendars and events.
   */
  listColors(
    query: ListColorListColorsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ListColorListColorsResponse> {
    return this._client.get("/colors", { query, ...options });
  }
}

export interface ListColorListColorsResponse {
  /**
   * A global palette of calendar colors, mapping from the color ID to its
   * definition. A calendarListEntry resource refers to one of these color IDs in its
   * colorId field. Read-only.
   */
  calendar?: Record<string, ListColorListColorsResponse.Calendar>;

  /**
   * A global palette of event colors, mapping from the color ID to its definition.
   * An event resource may refer to one of these color IDs in its colorId field.
   * Read-only.
   */
  event?: Record<string, ListColorListColorsResponse.Event>;

  /**
   * Type of the resource ("calendar#colors").
   */
  kind?: string;

  /**
   * Last modification time of the color palette (as a RFC3339 timestamp). Read-only.
   */
  updated?: string;
}

export namespace ListColorListColorsResponse {
  /**
   * A calendar color definition.
   */
  export interface Calendar {
    /**
     * The background color associated with this color definition.
     */
    background?: string;

    /**
     * The foreground color that can be used to write on top of a background with
     * 'background' color.
     */
    foreground?: string;
  }

  /**
   * An event color definition.
   */
  export interface Event {
    /**
     * The background color associated with this color definition.
     */
    background?: string;

    /**
     * The foreground color that can be used to write on top of a background with
     * 'background' color.
     */
    foreground?: string;
  }
}

export interface ListColorListColorsParams {
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

export declare namespace ListColors {
  export {
    type ListColorListColorsResponse as ListColorListColorsResponse,
    type ListColorListColorsParams as ListColorListColorsParams,
  };
}
