import { z } from "zod";
import { PayMongoClient } from "../client.js";
const client = new PayMongoClient();

export const createPaymentSchema = z.object({
  amount: z.number().positive().describe("Amount in centavos"),
  currency: z.string().default("PHP").describe("Currency code"),
  source_id: z.string().describe("Source ID to charge"),
  description: z.string().optional().describe("Payment description"),
});

export async function handleCreatePayment(params: z.infer<typeof createPaymentSchema>): Promise<string> {
  const body = {
    data: {
      attributes: {
        amount: params.amount, currency: params.currency,
        source: { id: params.source_id, type: "source" },
        description: params.description || "",
      },
    },
  };
  const result = await client.request("POST", "/payments", body);
  return JSON.stringify(result, null, 2);
}
