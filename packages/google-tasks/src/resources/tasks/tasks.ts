// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from "../../core/resource";
import * as V1API from "./v1/v1";
import { V1 } from "./v1/v1";

export class Tasks extends APIResource {
  v1: V1API.V1 = new V1API.V1(this._client);
}

Tasks.V1 = V1;

export declare namespace Tasks {
  export { V1 as V1 };
}
