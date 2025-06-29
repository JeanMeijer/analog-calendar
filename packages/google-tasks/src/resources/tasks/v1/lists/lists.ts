// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIPromise } from "../../../../core/api-promise";
import { APIResource } from "../../../../core/resource";
import { buildHeaders } from "../../../../internal/headers";
import { RequestOptions } from "../../../../internal/request-options";
import { path } from "../../../../internal/utils/path";
import * as TasksAPI from "./tasks";
import {
  Task,
  TaskCreateParams,
  TaskDeleteParams,
  TaskListParams,
  TaskListResponse,
  TaskMoveParams,
  TaskRetrieveParams,
  TaskUpdateParams,
  Tasks,
} from "./tasks";

export class Lists extends APIResource {
  tasks: TasksAPI.Tasks = new TasksAPI.Tasks(this._client);

  /**
   * Clears all completed tasks from the specified task list. The affected tasks will
   * be marked as 'hidden' and no longer be returned by default when retrieving all
   * tasks for a task list.
   */
  clearCompleted(
    tasklist: string,
    params: ListClearCompletedParams | null | undefined = {},
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
    return this._client.post(path`/tasks/v1/lists/${tasklist}/clear`, {
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

export interface ListClearCompletedParams {
  $?: ListClearCompletedParams._;

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

export namespace ListClearCompletedParams {
  export interface _ {
    /**
     * V1 error format.
     */
    xgafv?: "1" | "2";
  }
}

Lists.Tasks = Tasks;

export declare namespace Lists {
  export { type ListClearCompletedParams as ListClearCompletedParams };

  export {
    Tasks as Tasks,
    type Task as Task,
    type TaskListResponse as TaskListResponse,
    type TaskCreateParams as TaskCreateParams,
    type TaskRetrieveParams as TaskRetrieveParams,
    type TaskUpdateParams as TaskUpdateParams,
    type TaskListParams as TaskListParams,
    type TaskDeleteParams as TaskDeleteParams,
    type TaskMoveParams as TaskMoveParams,
  };
}
