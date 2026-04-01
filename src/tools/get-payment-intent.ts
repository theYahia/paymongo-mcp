import { z } from "zod";
import { PayMongoClient } from "../client.js";
const client = new PayMongoClient();

export const getPaymentIntentSchema = z.object({
  payment_intent_id: z.string().describe("Payment intent ID"),
});

export async function handleGetPaymentIntent(params: z.infer<typeof getPaymentIntentSchema>): Promise<string> {
  const result = await client.request("GET", "/payment_intents/" + params.payment_intent_id);
  return JSON.stringify(result, null, 2);
}
