// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIPromise } from "../../../../core/api-promise";
import { APIResource } from "../../../../core/resource";
import { buildHeaders } from "../../../../internal/headers";
import { RequestOptions } from "../../../../internal/request-options";
import { path } from "../../../../internal/utils/path";

export class Tasks extends APIResource {
  /**
   * Creates a new task on the specified task list.
   */
  create(
    tasklist: string,
    params: TaskCreateParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Task> {
    const {
      $,
      access_token,
      alt,
      callback,
      fields,
      key,
      oauth_token,
      query_parent,
      prettyPrint,
      previous,
      quotaUser,
      upload_protocol,
      uploadType,
      ...body
    } = params ?? {};
    return this._client.post(path`/tasks/v1/lists/${tasklist}/tasks`, {
      query: {
        $,
        access_token,
        alt,
        callback,
        fields,
        key,
        oauth_token,
        parent: query_parent,
        prettyPrint,
        previous,
        quotaUser,
        upload_protocol,
        uploadType,
      },
      body,
      ...options,
    });
  }

  /**
   * Returns the specified task.
   */
  retrieve(
    task: string,
    params: TaskRetrieveParams,
    options?: RequestOptions,
  ): APIPromise<Task> {
    const { tasklist, ...query } = params;
    return this._client.get(path`/tasks/v1/lists/${tasklist}/tasks/${task}`, {
      query,
      ...options,
    });
  }

  /**
   * Updates the specified task.
   */
  update(
    task: string,
    params: TaskUpdateParams,
    options?: RequestOptions,
  ): APIPromise<Task> {
    const {
      tasklist,
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
    } = params;
    return this._client.put(path`/tasks/v1/lists/${tasklist}/tasks/${task}`, {
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
   * Returns all tasks in the specified task list.
   */
  list(
    tasklist: string,
    query: TaskListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<TaskListResponse> {
    return this._client.get(path`/tasks/v1/lists/${tasklist}/tasks`, {
      query,
      ...options,
    });
  }

  /**
   * Deletes the specified task from the task list.
   */
  delete(
    task: string,
    params: TaskDeleteParams,
    options?: RequestOptions,
  ): APIPromise<void> {
    const {
      tasklist,
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
    } = params;
    return this._client.delete(
      path`/tasks/v1/lists/${tasklist}/tasks/${task}`,
      {
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
      },
    );
  }

  /**
   * Moves the specified task to another position in the task list. This can include
   * putting it as a child task under a new parent and/or move it to a different
   * position among its sibling tasks.
   */
  move(
    task: string,
    params: TaskMoveParams,
    options?: RequestOptions,
  ): APIPromise<Task> {
    const {
      tasklist,
      $,
      access_token,
      alt,
      callback,
      fields,
      key,
      oauth_token,
      parent,
      prettyPrint,
      previous,
      quotaUser,
      upload_protocol,
      uploadType,
    } = params;
    return this._client.post(
      path`/tasks/v1/lists/${tasklist}/tasks/${task}/move`,
      {
        query: {
          $,
          access_token,
          alt,
          callback,
          fields,
          key,
          oauth_token,
          parent,
          prettyPrint,
          previous,
          quotaUser,
          upload_protocol,
          uploadType,
        },
        ...options,
      },
    );
  }
}

export interface Task {
  /**
   * Task identifier.
   */
  id?: string;

  /**
   * Completion date of the task (as a RFC 3339 timestamp). This field is omitted if
   * the task has not been completed.
   */
  completed?: string;

  /**
   * Flag indicating whether the task has been deleted. The default is False.
   */
  deleted?: boolean;

  /**
   * Due date of the task (as a RFC 3339 timestamp). Optional. The due date only
   * records date information; the time portion of the timestamp is discarded when
   * setting the due date. It isn't possible to read or write the time that a task is
   * due via the API.
   */
  due?: string;

  /**
   * ETag of the resource.
   */
  etag?: string;

  /**
   * Flag indicating whether the task is hidden. This is the case if the task had
   * been marked completed when the task list was last cleared. The default is False.
   * This field is read-only.
   */
  hidden?: boolean;

  /**
   * Type of the resource. This is always "tasks#task".
   */
  kind?: string;

  /**
   * Collection of links. This collection is read-only.
   */
  links?: Array<Task.Link>;

  /**
   * Notes describing the task. Optional.
   */
  notes?: string;

  /**
   * Parent task identifier. This field is omitted if it is a top-level task. This
   * field is read-only. Use the "move" method to move the task under a different
   * parent or to the top level.
   */
  parent?: string;

  /**
   * String indicating the position of the task among its sibling tasks under the
   * same parent task or at the top level. If this string is greater than another
   * task's corresponding position string according to lexicographical ordering, the
   * task is positioned after the other task under the same parent task (or at the
   * top level). This field is read-only. Use the "move" method to move the task to
   * another position.
   */
  position?: string;

  /**
   * URL pointing to this task. Used to retrieve, update, or delete this task.
   */
  selfLink?: string;

  /**
   * Status of the task. This is either "needsAction" or "completed".
   */
  status?: string;

  /**
   * Title of the task.
   */
  title?: string;

  /**
   * Last modification time of the task (as a RFC 3339 timestamp).
   */
  updated?: string;
}

export namespace Task {
  export interface Link {
    /**
     * The description. In HTML speak: Everything between <a> and </a>.
     */
    description?: string;

    /**
     * The URL.
     */
    link?: string;

    /**
     * Type of the link, e.g. "email".
     */
    type?: string;
  }
}

export interface TaskListResponse {
  /**
   * ETag of the resource.
   */
  etag?: string;

  /**
   * Collection of tasks.
   */
  items?: Array<Task>;

  /**
   * Type of the resource. This is always "tasks#tasks".
   */
  kind?: string;

  /**
   * Token used to access the next page of this result.
   */
  nextPageToken?: string;
}

export interface TaskCreateParams {
  /**
   * Query param:
   */
  $?: TaskCreateParams._;

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
   * Query param: Parent task identifier. If the task is created at the top level,
   * this parameter is omitted. Optional.
   */
  query_parent?: string;

  /**
   * Query param: Returns response with indentations and line breaks.
   */
  prettyPrint?: boolean;

  /**
   * Query param: Previous sibling task identifier. If the task is created at the
   * first position among its siblings, this parameter is omitted. Optional.
   */
  previous?: string;

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
   * Body param: Task identifier.
   */
  id?: string;

  /**
   * Body param: Completion date of the task (as a RFC 3339 timestamp). This field is
   * omitted if the task has not been completed.
   */
  completed?: string;

  /**
   * Body param: Flag indicating whether the task has been deleted. The default is
   * False.
   */
  deleted?: boolean;

  /**
   * Body param: Due date of the task (as a RFC 3339 timestamp). Optional. The due
   * date only records date information; the time portion of the timestamp is
   * discarded when setting the due date. It isn't possible to read or write the time
   * that a task is due via the API.
   */
  due?: string;

  /**
   * Body param: ETag of the resource.
   */
  etag?: string;

  /**
   * Body param: Flag indicating whether the task is hidden. This is the case if the
   * task had been marked completed when the task list was last cleared. The default
   * is False. This field is read-only.
   */
  hidden?: boolean;

  /**
   * Body param: Type of the resource. This is always "tasks#task".
   */
  kind?: string;

  /**
   * Body param: Collection of links. This collection is read-only.
   */
  links?: Array<TaskCreateParams.Link>;

  /**
   * Body param: Notes describing the task. Optional.
   */
  notes?: string;

  /**
   * Body param: Parent task identifier. This field is omitted if it is a top-level
   * task. This field is read-only. Use the "move" method to move the task under a
   * different parent or to the top level.
   */
  body_parent?: string;

  /**
   * Body param: String indicating the position of the task among its sibling tasks
   * under the same parent task or at the top level. If this string is greater than
   * another task's corresponding position string according to lexicographical
   * ordering, the task is positioned after the other task under the same parent task
   * (or at the top level). This field is read-only. Use the "move" method to move
   * the task to another position.
   */
  position?: string;

  /**
   * Body param: URL pointing to this task. Used to retrieve, update, or delete this
   * task.
   */
  selfLink?: string;

  /**
   * Body param: Status of the task. This is either "needsAction" or "completed".
   */
  status?: string;

  /**
   * Body param: Title of the task.
   */
  title?: string;

  /**
   * Body param: Last modification time of the task (as a RFC 3339 timestamp).
   */
  updated?: string;
}

export namespace TaskCreateParams {
  export interface _ {
    /**
     * V1 error format.
     */
    xgafv?: "1" | "2";
  }

  export interface Link {
    /**
     * The description. In HTML speak: Everything between <a> and </a>.
     */
    description?: string;

    /**
     * The URL.
     */
    link?: string;

    /**
     * Type of the link, e.g. "email".
     */
    type?: string;
  }
}

export interface TaskRetrieveParams {
  /**
   * Path param: Task list identifier.
   */
  tasklist: string;

  /**
   * Query param:
   */
  $?: TaskRetrieveParams._;

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
}

export namespace TaskRetrieveParams {
  export interface _ {
    /**
     * V1 error format.
     */
    xgafv?: "1" | "2";
  }
}

export interface TaskUpdateParams {
  /**
   * Path param: Task list identifier.
   */
  tasklist: string;

  /**
   * Query param:
   */
  $?: TaskUpdateParams._;

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
   * Body param: Task identifier.
   */
  id?: string;

  /**
   * Body param: Completion date of the task (as a RFC 3339 timestamp). This field is
   * omitted if the task has not been completed.
   */
  completed?: string;

  /**
   * Body param: Flag indicating whether the task has been deleted. The default is
   * False.
   */
  deleted?: boolean;

  /**
   * Body param: Due date of the task (as a RFC 3339 timestamp). Optional. The due
   * date only records date information; the time portion of the timestamp is
   * discarded when setting the due date. It isn't possible to read or write the time
   * that a task is due via the API.
   */
  due?: string;

  /**
   * Body param: ETag of the resource.
   */
  etag?: string;

  /**
   * Body param: Flag indicating whether the task is hidden. This is the case if the
   * task had been marked completed when the task list was last cleared. The default
   * is False. This field is read-only.
   */
  hidden?: boolean;

  /**
   * Body param: Type of the resource. This is always "tasks#task".
   */
  kind?: string;

  /**
   * Body param: Collection of links. This collection is read-only.
   */
  links?: Array<TaskUpdateParams.Link>;

  /**
   * Body param: Notes describing the task. Optional.
   */
  notes?: string;

  /**
   * Body param: Parent task identifier. This field is omitted if it is a top-level
   * task. This field is read-only. Use the "move" method to move the task under a
   * different parent or to the top level.
   */
  parent?: string;

  /**
   * Body param: String indicating the position of the task among its sibling tasks
   * under the same parent task or at the top level. If this string is greater than
   * another task's corresponding position string according to lexicographical
   * ordering, the task is positioned after the other task under the same parent task
   * (or at the top level). This field is read-only. Use the "move" method to move
   * the task to another position.
   */
  position?: string;

  /**
   * Body param: URL pointing to this task. Used to retrieve, update, or delete this
   * task.
   */
  selfLink?: string;

  /**
   * Body param: Status of the task. This is either "needsAction" or "completed".
   */
  status?: string;

  /**
   * Body param: Title of the task.
   */
  title?: string;

  /**
   * Body param: Last modification time of the task (as a RFC 3339 timestamp).
   */
  updated?: string;
}

export namespace TaskUpdateParams {
  export interface _ {
    /**
     * V1 error format.
     */
    xgafv?: "1" | "2";
  }

  export interface Link {
    /**
     * The description. In HTML speak: Everything between <a> and </a>.
     */
    description?: string;

    /**
     * The URL.
     */
    link?: string;

    /**
     * Type of the link, e.g. "email".
     */
    type?: string;
  }
}

export interface TaskListParams {
  $?: TaskListParams._;

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
   * Upper bound for a task's completion date (as a RFC 3339 timestamp) to filter by.
   * Optional. The default is not to filter by completion date.
   */
  completedMax?: string;

  /**
   * Lower bound for a task's completion date (as a RFC 3339 timestamp) to filter by.
   * Optional. The default is not to filter by completion date.
   */
  completedMin?: string;

  /**
   * Upper bound for a task's due date (as a RFC 3339 timestamp) to filter by.
   * Optional. The default is not to filter by due date.
   */
  dueMax?: string;

  /**
   * Lower bound for a task's due date (as a RFC 3339 timestamp) to filter by.
   * Optional. The default is not to filter by due date.
   */
  dueMin?: string;

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
   * Maximum number of tasks returned on one page. Optional. The default is 20 (max
   * allowed: 100).
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
   * Flag indicating whether completed tasks are returned in the result. Optional.
   * The default is True. Note that showHidden must also be True to show tasks
   * completed in first party clients, such as the web UI and Google's mobile apps.
   */
  showCompleted?: boolean;

  /**
   * Flag indicating whether deleted tasks are returned in the result. Optional. The
   * default is False.
   */
  showDeleted?: boolean;

  /**
   * Flag indicating whether hidden tasks are returned in the result. Optional. The
   * default is False.
   */
  showHidden?: boolean;

  /**
   * Lower bound for a task's last modification time (as a RFC 3339 timestamp) to
   * filter by. Optional. The default is not to filter by last modification time.
   */
  updatedMin?: string;

  /**
   * Upload protocol for media (e.g. "raw", "multipart").
   */
  upload_protocol?: string;

  /**
   * Legacy upload protocol for media (e.g. "media", "multipart").
   */
  uploadType?: string;
}

export namespace TaskListParams {
  export interface _ {
    /**
     * V1 error format.
     */
    xgafv?: "1" | "2";
  }
}

export interface TaskDeleteParams {
  /**
   * Path param: Task list identifier.
   */
  tasklist: string;

  /**
   * Query param:
   */
  $?: TaskDeleteParams._;

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
}

export namespace TaskDeleteParams {
  export interface _ {
    /**
     * V1 error format.
     */
    xgafv?: "1" | "2";
  }
}

export interface TaskMoveParams {
  /**
   * Path param: Task list identifier.
   */
  tasklist: string;

  /**
   * Query param:
   */
  $?: TaskMoveParams._;

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
   * Query param: New parent task identifier. If the task is moved to the top level,
   * this parameter is omitted. Optional.
   */
  parent?: string;

  /**
   * Query param: Returns response with indentations and line breaks.
   */
  prettyPrint?: boolean;

  /**
   * Query param: New previous sibling task identifier. If the task is moved to the
   * first position among its siblings, this parameter is omitted. Optional.
   */
  previous?: string;

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
}

export namespace TaskMoveParams {
  export interface _ {
    /**
     * V1 error format.
     */
    xgafv?: "1" | "2";
  }
}

export declare namespace Tasks {
  export {
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
