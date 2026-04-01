import { z } from "zod";
import { PayMongoClient } from "../client.js";
const client = new PayMongoClient();

export const createPaymentIntentSchema = z.object({
  amount: z.number().positive().describe("Amount in centavos (e.g. 10000 = 100 PHP)"),
  currency: z.string().default("PHP").describe("Currency code"),
  payment_method_allowed: z.array(z.string()).default(["card", "gcash", "grab_pay", "paymaya"]).describe("Allowed payment methods"),
  description: z.string().optional().describe("Payment description"),
});

export async function handleCreatePaymentIntent(params: z.infer<typeof createPaymentIntentSchema>): Promise<string> {
  const body = {
    data: {
      attributes: {
        amount: params.amount, currency: params.currency,
        payment_method_allowed: params.payment_method_allowed,
        description: params.description || "",
      },
    },
  };
  const result = await client.request("POST", "/payment_intents", body);
  return JSON.stringify(result, null, 2);
}
