import { RFC1738, RFC3986, default_format, formatters } from "./formats";

const formats = {
  formatters,
  RFC1738,
  RFC3986,
  default: default_format,
};

export { stringify } from "./stringify";
export { formats };

export type {
  DefaultDecoder,
  DefaultEncoder,
  Format,
  ParseOptions,
  StringifyOptions,
} from "./types";
