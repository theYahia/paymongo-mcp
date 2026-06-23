#!/usr/bin/env node

import { createRequire } from "node:module";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { tool, type ToolDescriptor } from "./lib/tool.js";

import { createPaymentIntentTool } from "./tools/create-payment-intent.js";
import { getPaymentIntentTool } from "./tools/get-payment-intent.js";
import { createSourceTool } from "./tools/create-source.js";
import { getSourceTool } from "./tools/get-source.js";
import { createPaymentTool } from "./tools/create-payment.js";
import { listPaymentsTool } from "./tools/list-payments.js";
import { createRefundTool } from "./tools/create-refund.js";
import { createCheckoutTool } from "./tools/create-checkout.js";
import { getCheckoutTool } from "./tools/get-checkout.js";
import { linksDescriptors } from "./tools/links.js";
import { webhooksDescriptors } from "./tools/webhooks.js";
import { paymentMethodsDescriptors } from "./tools/payment-methods.js";
import { customersDescriptors } from "./tools/customers.js";
import { refundsDescriptors } from "./tools/refunds.js";

const FALLBACK_VERSION = "1.1.0";

/** Read the package version at runtime (dist/index.js → ../package.json). */
function getVersion(): string {
  try {
    const require = createRequire(import.meta.url);
    const pkg = require("../package.json") as { version?: string };
    return pkg.version ?? FALLBACK_VERSION;
  } catch {
    return FALLBACK_VERSION;
  }
}

const tools: ToolDescriptor[] = [
  createPaymentIntentTool,
  getPaymentIntentTool,
  createSourceTool,
  getSourceTool,
  createPaymentTool,
  listPaymentsTool,
  createRefundTool,
  createCheckoutTool,
  getCheckoutTool,
  ...linksDescriptors,
  ...webhooksDescriptors,
  ...paymentMethodsDescriptors,
  ...customersDescriptors,
  ...refundsDescriptors,
];

const server = new McpServer({ name: "paymongo-mcp", version: getVersion() });

for (const t of tools) {
  server.registerTool(
    t.name,
    {
      title: t.title,
      description: t.description,
      inputSchema: t.inputSchema,
      annotations: t.annotations,
    },
    tool(t.handler),
  );
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`[paymongo-mcp] Server started. ${tools.length} tools available.`);
}

main().catch((error) => {
  console.error("[paymongo-mcp] Error:", error);
  process.exit(1);
});
