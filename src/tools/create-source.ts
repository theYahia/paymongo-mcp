import { z } from "zod";
import { PayMongoClient } from "../client.js";
const client = new PayMongoClient();

export const createSourceSchema = z.object({
  amount: z.number().positive().describe("Amount in centavos"),
  type: z.enum(["gcash", "grab_pay"]).describe("Source type"),
  currency: z.string().default("PHP").describe("Currency code"),
  redirect_success: z.string().url().describe("Success redirect URL"),
  redirect_failed: z.string().url().describe("Failed redirect URL"),
});

export async function handleCreateSource(params: z.infer<typeof createSourceSchema>): Promise<string> {
  const body = {
    data: {
      attributes: {
        amount: params.amount, currency: params.currency, type: params.type,
        redirect: { success: params.redirect_success, failed: params.redirect_failed },
      },
    },
  };
  const result = await client.request("POST", "/sources", body);
  return JSON.stringify(result, null, 2);
}
