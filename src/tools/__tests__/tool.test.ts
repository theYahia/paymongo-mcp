import { describe, it, expect } from "vitest";
import { tool } from "../../lib/tool.js";

describe("tool() HOF", () => {
  it("wraps a successful handler result as a text content block", async () => {
    const wrapped = tool(async () => "hello");
    const res = await wrapped({});
    expect(res.content[0]).toMatchObject({ type: "text", text: "hello" });
    expect(res.isError).toBeUndefined();
  });

  it("returns isError with the message when the handler throws an Error", async () => {
    const wrapped = tool(async () => {
      throw new Error("boom");
    });
    const res = await wrapped({});
    expect(res.isError).toBe(true);
    expect(res.content[0]).toMatchObject({ type: "text", text: "boom" });
  });

  it("coerces a non-Error throw via String()", async () => {
    const wrapped = tool(async () => {
      throw "weird";
    });
    const res = await wrapped({});
    expect(res.isError).toBe(true);
    expect(res.content[0]).toMatchObject({ type: "text", text: "weird" });
  });
});
