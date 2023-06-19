import { ParsedQs } from "qs";

export function parseValueFromQuery(
  value: string | ParsedQs | string[] | ParsedQs[]
): string | undefined {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    const firstElement = value[0];
    return typeof firstElement === "string" ? firstElement : undefined;
  }

  return undefined;
}
