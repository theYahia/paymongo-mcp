import { z } from "zod";
import { PayMongoClient } from "../client.js";
const client = new PayMongoClient();

export const createCheckoutSchema = z.object({
  amount: z.number().positive().describe("Amount in centavos"),
  currency: z.string().default("PHP").describe("Currency code"),
  description: z.string().optional().describe("Checkout description"),
  payment_method_types: z.array(z.string()).default(["card", "gcash", "grab_pay", "paymaya"]).describe("Payment method types"),
  success_url: z.string().url().describe("Success redirect URL"),
  cancel_url: z.string().url().describe("Cancel redirect URL"),
});

export async function handleCreateCheckout(params: z.infer<typeof createCheckoutSchema>): Promise<string> {
  const body = {
    data: {
      attributes: {
        line_items: [{ amount: params.amount, currency: params.currency, name: params.description || "Payment", quantity: 1 }],
        payment_method_types: params.payment_method_types,
        success_url: params.success_url, cancel_url: params.cancel_url,
      },
    },
  };
  const result = await client.request("POST", "/checkout_sessions", body);
  return JSON.stringify(result, null, 2);
}
