import { z } from "zod";
import { PayMongoClient } from "../client.js";
const client = new PayMongoClient();

export const listPaymentsSchema = z.object({
  limit: z.number().optional().describe("Max payments (default 10)"),
  before: z.string().optional().describe("Cursor for pagination (before)"),
  after: z.string().optional().describe("Cursor for pagination (after)"),
});

export async function handleListPayments(params: z.infer<typeof listPaymentsSchema>): Promise<string> {
  const qp = new URLSearchParams();
  if (params.limit) qp.set("limit", String(params.limit));
  if (params.before) qp.set("before", params.before);
  if (params.after) qp.set("after", params.after);
  const qs = qp.toString() ? "?" + qp.toString() : "";
  const result = await client.request("GET", "/payments" + qs);
  return JSON.stringify(result, null, 2);
}
