import { z } from "zod";
import { PayMongoClient } from "../client.js";
const client = new PayMongoClient();

export const createRefundSchema = z.object({
  payment_id: z.string().describe("Payment ID to refund"),
  amount: z.number().positive().describe("Refund amount in centavos"),
  reason: z.enum(["duplicate", "fraudulent", "requested_by_customer"]).describe("Refund reason"),
});

export async function handleCreateRefund(params: z.infer<typeof createRefundSchema>): Promise<string> {
  const body = {
    data: { attributes: { payment_id: params.payment_id, amount: params.amount, reason: params.reason } },
  };
  const result = await client.request("POST", "/refunds", body);
  return JSON.stringify(result, null, 2);
}
