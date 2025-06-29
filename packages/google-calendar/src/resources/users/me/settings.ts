// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIPromise } from "../../../core/api-promise";
import { APIResource } from "../../../core/resource";
import { RequestOptions } from "../../../internal/request-options";
import { path } from "../../../internal/utils/path";
import * as Shared from "../../shared";

export class Settings extends APIResource {
  /**
   * Returns all user settings for the authenticated user.
   */
  retrieve(
    query: SettingRetrieveParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SettingRetrieveResponse> {
    return this._client.get("/users/me/settings", { query, ...options });
  }

  /**
   * Returns a single user setting.
   */
  retrieveSetting(
    setting: string,
    query: SettingRetrieveSettingParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SettingRetrieveSettingResponse> {
    return this._client.get(path`/users/me/settings/${setting}`, {
      query,
      ...options,
    });
  }

  /**
   * Watch for changes to Settings resources.
   */
  watch(
    params: SettingWatchParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.Channel> {
    const {
      alt,
      fields,
      key,
      maxResults,
      oauth_token,
      pageToken,
      prettyPrint,
      quotaUser,
      syncToken,
      userIp,
      ...body
    } = params ?? {};
    return this._client.post("/users/me/settings/watch", {
      query: {
        alt,
        fields,
        key,
        maxResults,
        oauth_token,
        pageToken,
        prettyPrint,
        quotaUser,
        syncToken,
        userIp,
      },
      body,
      ...options,
    });
  }
}

export interface SettingRetrieveResponse {
  /**
   * Etag of the collection.
   */
  etag?: string;

  /**
   * List of user settings.
   */
  items?: Array<SettingRetrieveResponse.Item>;

  /**
   * Type of the collection ("calendar#settings").
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

export namespace SettingRetrieveResponse {
  export interface Item {
    /**
     * The id of the user setting.
     */
    id?: string;

    /**
     * ETag of the resource.
     */
    etag?: string;

    /**
     * Type of the resource ("calendar#setting").
     */
    kind?: string;

    /**
     * Value of the user setting. The format of the value depends on the ID of the
     * setting. It must always be a UTF-8 string of length up to 1024 characters.
     */
    value?: string;
  }
}

export interface SettingRetrieveSettingResponse {
  /**
   * The id of the user setting.
   */
  id?: string;

  /**
   * ETag of the resource.
   */
  etag?: string;

  /**
   * Type of the resource ("calendar#setting").
   */
  kind?: string;

  /**
   * Value of the user setting. The format of the value depends on the ID of the
   * setting. It must always be a UTF-8 string of length up to 1024 characters.
   */
  value?: string;
}

export interface SettingRetrieveParams {
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
   * Token obtained from the nextSyncToken field returned on the last page of results
   * from the previous list request. It makes the result of this list request contain
   * only entries that have changed since then. If the syncToken expires, the server
   * will respond with a 410 GONE response code and the client should clear its
   * storage and perform a full synchronization without any syncToken. Learn more
   * about incremental synchronization. Optional. The default is to return all
   * entries.
   */
  syncToken?: string;

  /**
   * Deprecated. Please use quotaUser instead.
   */
  userIp?: string;
}

export interface SettingRetrieveSettingParams {
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

export interface SettingWatchParams {
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
   * Query param: Token obtained from the nextSyncToken field returned on the last
   * page of results from the previous list request. It makes the result of this list
   * request contain only entries that have changed since then. If the syncToken
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

export declare namespace Settings {
  export {
    type SettingRetrieveResponse as SettingRetrieveResponse,
    type SettingRetrieveSettingResponse as SettingRetrieveSettingResponse,
    type SettingRetrieveParams as SettingRetrieveParams,
    type SettingRetrieveSettingParams as SettingRetrieveSettingParams,
    type SettingWatchParams as SettingWatchParams,
  };
}
