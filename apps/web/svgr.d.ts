declare module "*.svg" {
  import type { FC, SVGProps } from "react";

  const content: FC<SVGProps<SVGElement>>;
  export default content;
}

declare module "*.svg?url" {
  const content: never;
  export default content;
}
