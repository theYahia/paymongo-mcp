#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createPaymentIntentSchema, handleCreatePaymentIntent } from "./tools/create-payment-intent.js";
import { getPaymentIntentSchema, handleGetPaymentIntent } from "./tools/get-payment-intent.js";
import { createSourceSchema, handleCreateSource } from "./tools/create-source.js";
import { getSourceSchema, handleGetSource } from "./tools/get-source.js";
import { createPaymentSchema, handleCreatePayment } from "./tools/create-payment.js";
import { listPaymentsSchema, handleListPayments } from "./tools/list-payments.js";
import { createRefundSchema, handleCreateRefund } from "./tools/create-refund.js";
import { createCheckoutSchema, handleCreateCheckout } from "./tools/create-checkout.js";
import { getCheckoutSchema, handleGetCheckout } from "./tools/get-checkout.js";

const server = new McpServer({ name: "paymongo-mcp", version: "1.0.0" });

server.tool("create_payment_intent", "Create a payment intent.", createPaymentIntentSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleCreatePaymentIntent(params) }] }));
server.tool("get_payment_intent", "Get payment intent by ID.", getPaymentIntentSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetPaymentIntent(params) }] }));
server.tool("create_source", "Create a payment source (GCash/GrabPay).", createSourceSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleCreateSource(params) }] }));
server.tool("get_source", "Get source details by ID.", getSourceSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetSource(params) }] }));
server.tool("create_payment", "Create a payment from a source.", createPaymentSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleCreatePayment(params) }] }));
server.tool("list_payments", "List payments with pagination.", listPaymentsSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleListPayments(params) }] }));
server.tool("create_refund", "Refund a payment.", createRefundSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleCreateRefund(params) }] }));
server.tool("create_checkout", "Create a checkout session.", createCheckoutSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleCreateCheckout(params) }] }));
server.tool("get_checkout", "Get checkout session by ID.", getCheckoutSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetCheckout(params) }] }));

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[paymongo-mcp] Server started. 9 tools available.");
}
main().catch((error) => { console.error("[paymongo-mcp] Error:", error); process.exit(1); });
