import { Transform } from "class-transformer";

export function TransformBoolean() {
  return Transform(({ value }) => {
    return value === true || value === "true"
      ? true
      : value === false || value === "false"
        ? false
        : undefined;
  });
}
