import type { ZodRawShape } from "zod";
import type {
  ToolAnnotations,
  CallToolResult,
} from "@modelcontextprotocol/sdk/types.js";

/**
 * A self-describing tool registration. Each tool module exports one or more of
 * these; `index.ts` maps over them into `server.registerTool(...)` so the
 * registration site stays a single loop instead of N inline calls.
 */
export interface ToolDescriptor {
  /** Tool id, e.g. `create_payment_intent`. */
  name: string;
  /** Human-friendly display name shown by MCP clients. */
  title: string;
  /** What the tool does (shown to the model). */
  description: string;
  /** Zod raw shape (`schema.shape`) used as the input schema. */
  inputSchema: ZodRawShape;
  /** Behavioural hints (readOnly/destructive/idempotent/openWorld). */
  annotations?: ToolAnnotations;
  /** Business logic: validated params in, a text result out. */
  handler: (params: any) => Promise<string>;
}

/**
 * Wrap a `(params) => Promise<string>` handler into an MCP tool callback:
 * success becomes a text content block; any thrown error is returned as
 * `isError: true` with the error message (MCP-idiomatic — the model can read
 * and react to the failure instead of the call hard-erroring).
 */
export function tool<T>(handler: (params: T) => Promise<string>) {
  return async (params: T): Promise<CallToolResult> => {
    try {
      const text = await handler(params);
      return { content: [{ type: "text", text }] };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { content: [{ type: "text", text: message }], isError: true };
    }
  };
}
