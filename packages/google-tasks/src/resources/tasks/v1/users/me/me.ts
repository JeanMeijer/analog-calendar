// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from "../../../../../core/resource";
import * as ListsAPI from "./lists";
import {
  ListCreateParams,
  ListDeleteParams,
  ListListParams,
  ListListResponse,
  ListRetrieveParams,
  ListUpdateParams,
  Lists,
  TaskList,
} from "./lists";

export class Me extends APIResource {
  lists: ListsAPI.Lists = new ListsAPI.Lists(this._client);
}

Me.Lists = Lists;

export declare namespace Me {
  export {
    Lists as Lists,
    type TaskList as TaskList,
    type ListListResponse as ListListResponse,
    type ListCreateParams as ListCreateParams,
    type ListRetrieveParams as ListRetrieveParams,
    type ListUpdateParams as ListUpdateParams,
    type ListListParams as ListListParams,
    type ListDeleteParams as ListDeleteParams,
  };
}
