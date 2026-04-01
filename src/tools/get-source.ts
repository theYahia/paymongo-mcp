import { z } from "zod";
import { PayMongoClient } from "../client.js";
const client = new PayMongoClient();

export const getSourceSchema = z.object({
  source_id: z.string().describe("Source ID"),
});

export async function handleGetSource(params: z.infer<typeof getSourceSchema>): Promise<string> {
  const result = await client.request("GET", "/sources/" + params.source_id);
  return JSON.stringify(result, null, 2);
}
