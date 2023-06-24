import { parseValueFromQuery } from "@/modules/patients/utils/query-string";
import { ParsedQs } from "qs";

describe("parseValueFromQuery", () => {
  it("should return the value if it is a string", () => {
    const value = "example";
    const result = parseValueFromQuery(value);
    expect(result).toBe(value);
  });

  it("should return the first element of the array if it is a string", () => {
    const value: string[] = ["example", "other"];
    const result = parseValueFromQuery(value);
    expect(result).toBe(value[0]);
  });

  it("should return undefined for other types of values", () => {
    const value: ParsedQs = { key: "value" };
    const result = parseValueFromQuery(value);
    expect(result).toBeUndefined();
  });
});
