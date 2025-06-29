// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from "../../../core/resource";
import * as ListsAPI from "./lists/lists";
import { ListClearCompletedParams, Lists } from "./lists/lists";
import * as UsersAPI from "./users/users";
import { Users } from "./users/users";

export class V1 extends APIResource {
  lists: ListsAPI.Lists = new ListsAPI.Lists(this._client);
  users: UsersAPI.Users = new UsersAPI.Users(this._client);
}

V1.Lists = Lists;
V1.Users = Users;

export declare namespace V1 {
  export {
    Lists as Lists,
    type ListClearCompletedParams as ListClearCompletedParams,
  };

  export { Users as Users };
}
