// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIPromise } from "../../../../../core/api-promise";
import { APIResource } from "../../../../../core/resource";
import { buildHeaders } from "../../../../../internal/headers";
import { RequestOptions } from "../../../../../internal/request-options";
import { path } from "../../../../../internal/utils/path";

export class Lists extends APIResource {
  /**
   * Creates a new task list and adds it to the authenticated user's task lists.
   */
  create(
    params: ListCreateParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<TaskList> {
    const {
      $,
      access_token,
      alt,
      callback,
      fields,
      key,
      oauth_token,
      prettyPrint,
      quotaUser,
      upload_protocol,
      uploadType,
      ...body
    } = params ?? {};
    return this._client.post("/tasks/v1/users/@me/lists", {
      query: {
        $,
        access_token,
        alt,
        callback,
        fields,
        key,
        oauth_token,
        prettyPrint,
        quotaUser,
        upload_protocol,
        uploadType,
      },
      body,
      ...options,
    });
  }

  /**
   * Returns the authenticated user's specified task list.
   */
  retrieve(
    tasklist: string,
    query: ListRetrieveParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<TaskList> {
    return this._client.get(path`/tasks/v1/users/@me/lists/${tasklist}`, {
      query,
      ...options,
    });
  }

  /**
   * Updates the authenticated user's specified task list.
   */
  update(
    tasklist: string,
    params: ListUpdateParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<TaskList> {
    const {
      $,
      access_token,
      alt,
      callback,
      fields,
      key,
      oauth_token,
      prettyPrint,
      quotaUser,
      upload_protocol,
      uploadType,
      ...body
    } = params ?? {};
    return this._client.put(path`/tasks/v1/users/@me/lists/${tasklist}`, {
      query: {
        $,
        access_token,
        alt,
        callback,
        fields,
        key,
        oauth_token,
        prettyPrint,
        quotaUser,
        upload_protocol,
        uploadType,
      },
      body,
      ...options,
    });
  }

  /**
   * Returns all the authenticated user's task lists.
   */
  list(
    query: ListListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ListListResponse> {
    return this._client.get("/tasks/v1/users/@me/lists", { query, ...options });
  }

  /**
   * Deletes the authenticated user's specified task list.
   */
  delete(
    tasklist: string,
    params: ListDeleteParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<void> {
    const {
      $,
      access_token,
      alt,
      callback,
      fields,
      key,
      oauth_token,
      prettyPrint,
      quotaUser,
      upload_protocol,
      uploadType,
    } = params ?? {};
    return this._client.delete(path`/tasks/v1/users/@me/lists/${tasklist}`, {
      query: {
        $,
        access_token,
        alt,
        callback,
        fields,
        key,
        oauth_token,
        prettyPrint,
        quotaUser,
        upload_protocol,
        uploadType,
      },
      ...options,
      headers: buildHeaders([{ Accept: "*/*" }, options?.headers]),
    });
  }
}

export interface TaskList {
  /**
   * Task list identifier.
   */
  id?: string;

  /**
   * ETag of the resource.
   */
  etag?: string;

  /**
   * Type of the resource. This is always "tasks#taskList".
   */
  kind?: string;

  /**
   * URL pointing to this task list. Used to retrieve, update, or delete this task
   * list.
   */
  selfLink?: string;

  /**
   * Title of the task list.
   */
  title?: string;

  /**
   * Last modification time of the task list (as a RFC 3339 timestamp).
   */
  updated?: string;
}

export interface ListListResponse {
  /**
   * ETag of the resource.
   */
  etag?: string;

  /**
   * Collection of task lists.
   */
  items?: Array<TaskList>;

  /**
   * Type of the resource. This is always "tasks#taskLists".
   */
  kind?: string;

  /**
   * Token that can be used to request the next page of this result.
   */
  nextPageToken?: string;
}

export interface ListCreateParams {
  /**
   * Query param:
   */
  $?: ListCreateParams._;

  /**
   * Query param: OAuth access token.
   */
  access_token?: string;

  /**
   * Query param: Data format for response.
   */
  alt?: "json" | "media" | "proto";

  /**
   * Query param: JSONP
   */
  callback?: string;

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
   * Query param: Available to use for quota purposes for server-side applications.
   * Can be any arbitrary string assigned to a user, but should not exceed 40
   * characters.
   */
  quotaUser?: string;

  /**
   * Query param: Upload protocol for media (e.g. "raw", "multipart").
   */
  upload_protocol?: string;

  /**
   * Query param: Legacy upload protocol for media (e.g. "media", "multipart").
   */
  uploadType?: string;

  /**
   * Body param: Task list identifier.
   */
  id?: string;

  /**
   * Body param: ETag of the resource.
   */
  etag?: string;

  /**
   * Body param: Type of the resource. This is always "tasks#taskList".
   */
  kind?: string;

  /**
   * Body param: URL pointing to this task list. Used to retrieve, update, or delete
   * this task list.
   */
  selfLink?: string;

  /**
   * Body param: Title of the task list.
   */
  title?: string;

  /**
   * Body param: Last modification time of the task list (as a RFC 3339 timestamp).
   */
  updated?: string;
}

export namespace ListCreateParams {
  export interface _ {
    /**
     * V1 error format.
     */
    xgafv?: "1" | "2";
  }
}

export interface ListRetrieveParams {
  $?: ListRetrieveParams._;

  /**
   * OAuth access token.
   */
  access_token?: string;

  /**
   * Data format for response.
   */
  alt?: "json" | "media" | "proto";

  /**
   * JSONP
   */
  callback?: string;

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
   * Available to use for quota purposes for server-side applications. Can be any
   * arbitrary string assigned to a user, but should not exceed 40 characters.
   */
  quotaUser?: string;

  /**
   * Upload protocol for media (e.g. "raw", "multipart").
   */
  upload_protocol?: string;

  /**
   * Legacy upload protocol for media (e.g. "media", "multipart").
   */
  uploadType?: string;
}

export namespace ListRetrieveParams {
  export interface _ {
    /**
     * V1 error format.
     */
    xgafv?: "1" | "2";
  }
}

export interface ListUpdateParams {
  /**
   * Query param:
   */
  $?: ListUpdateParams._;

  /**
   * Query param: OAuth access token.
   */
  access_token?: string;

  /**
   * Query param: Data format for response.
   */
  alt?: "json" | "media" | "proto";

  /**
   * Query param: JSONP
   */
  callback?: string;

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
   * Query param: Available to use for quota purposes for server-side applications.
   * Can be any arbitrary string assigned to a user, but should not exceed 40
   * characters.
   */
  quotaUser?: string;

  /**
   * Query param: Upload protocol for media (e.g. "raw", "multipart").
   */
  upload_protocol?: string;

  /**
   * Query param: Legacy upload protocol for media (e.g. "media", "multipart").
   */
  uploadType?: string;

  /**
   * Body param: Task list identifier.
   */
  id?: string;

  /**
   * Body param: ETag of the resource.
   */
  etag?: string;

  /**
   * Body param: Type of the resource. This is always "tasks#taskList".
   */
  kind?: string;

  /**
   * Body param: URL pointing to this task list. Used to retrieve, update, or delete
   * this task list.
   */
  selfLink?: string;

  /**
   * Body param: Title of the task list.
   */
  title?: string;

  /**
   * Body param: Last modification time of the task list (as a RFC 3339 timestamp).
   */
  updated?: string;
}

export namespace ListUpdateParams {
  export interface _ {
    /**
     * V1 error format.
     */
    xgafv?: "1" | "2";
  }
}

export interface ListListParams {
  $?: ListListParams._;

  /**
   * OAuth access token.
   */
  access_token?: string;

  /**
   * Data format for response.
   */
  alt?: "json" | "media" | "proto";

  /**
   * JSONP
   */
  callback?: string;

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
   * Maximum number of task lists returned on one page. Optional. The default is 20
   * (max allowed: 100).
   */
  maxResults?: number;

  /**
   * OAuth 2.0 token for the current user.
   */
  oauth_token?: string;

  /**
   * Token specifying the result page to return. Optional.
   */
  pageToken?: string;

  /**
   * Returns response with indentations and line breaks.
   */
  prettyPrint?: boolean;

  /**
   * Available to use for quota purposes for server-side applications. Can be any
   * arbitrary string assigned to a user, but should not exceed 40 characters.
   */
  quotaUser?: string;

  /**
   * Upload protocol for media (e.g. "raw", "multipart").
   */
  upload_protocol?: string;

  /**
   * Legacy upload protocol for media (e.g. "media", "multipart").
   */
  uploadType?: string;
}

export namespace ListListParams {
  export interface _ {
    /**
     * V1 error format.
     */
    xgafv?: "1" | "2";
  }
}

export interface ListDeleteParams {
  $?: ListDeleteParams._;

  /**
   * OAuth access token.
   */
  access_token?: string;

  /**
   * Data format for response.
   */
  alt?: "json" | "media" | "proto";

  /**
   * JSONP
   */
  callback?: string;

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
   * Available to use for quota purposes for server-side applications. Can be any
   * arbitrary string assigned to a user, but should not exceed 40 characters.
   */
  quotaUser?: string;

  /**
   * Upload protocol for media (e.g. "raw", "multipart").
   */
  upload_protocol?: string;

  /**
   * Legacy upload protocol for media (e.g. "media", "multipart").
   */
  uploadType?: string;
}

export namespace ListDeleteParams {
  export interface _ {
    /**
     * V1 error format.
     */
    xgafv?: "1" | "2";
  }
}

export declare namespace Lists {
  export {
    type TaskList as TaskList,
    type ListListResponse as ListListResponse,
    type ListCreateParams as ListCreateParams,
    type ListRetrieveParams as ListRetrieveParams,
    type ListUpdateParams as ListUpdateParams,
    type ListListParams as ListListParams,
    type ListDeleteParams as ListDeleteParams,
  };
}
