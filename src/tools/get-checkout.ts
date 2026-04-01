import { z } from "zod";
import { PayMongoClient } from "../client.js";
const client = new PayMongoClient();

export const getCheckoutSchema = z.object({
  checkout_session_id: z.string().describe("Checkout session ID"),
});

export async function handleGetCheckout(params: z.infer<typeof getCheckoutSchema>): Promise<string> {
  const result = await client.request("GET", "/checkout_sessions/" + params.checkout_session_id);
  return JSON.stringify(result, null, 2);
}
