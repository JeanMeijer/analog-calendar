// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import type { BodyInit } from "./builtin-types";
import { NullableHeaders, type HeadersLike } from "./headers";
import type { HTTPMethod, MergedRequestInit } from "./types";

export type FinalRequestOptions = RequestOptions & {
  method: HTTPMethod;
  path: string;
};

export type RequestOptions = {
  method?: HTTPMethod;
  path?: string;
  query?: object | undefined | null;
  body?: unknown;
  headers?: HeadersLike;
  maxRetries?: number;
  stream?: boolean | undefined;
  timeout?: number;
  fetchOptions?: MergedRequestInit;
  signal?: AbortSignal | undefined | null;
  idempotencyKey?: string;

  __binaryResponse?: boolean | undefined;
};

export type EncodedContent = { bodyHeaders: HeadersLike; body: BodyInit };
export type RequestEncoder = (request: {
  headers: NullableHeaders;
  body: unknown;
}) => EncodedContent;

export const FallbackEncoder: RequestEncoder = ({ headers, body }) => {
  return {
    bodyHeaders: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  };
};
