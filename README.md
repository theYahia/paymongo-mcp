# paymongo-mcp

MCP server for PayMongo payment gateway (Philippines). Supports payment intents, sources, payments, refunds, and checkout sessions via Basic Auth.

## Tools (9)

| Tool | Description |
|---|---|
| `create_payment_intent` | Create a payment intent |
| `get_payment_intent` | Get payment intent by ID |
| `create_source` | Create a GCash/GrabPay source |
| `get_source` | Get source details |
| `create_payment` | Create a payment from source |
| `list_payments` | List payments |
| `create_refund` | Refund a payment |
| `create_checkout` | Create a checkout session |
| `get_checkout` | Get checkout session |

## Quick Start

```json
{
  "mcpServers": {
    "paymongo": {
      "command": "npx",
      "args": ["-y", "@theyahia/paymongo-mcp"],
      "env": {
        "PAYMONGO_SECRET_KEY": "<YOUR_SECRET_KEY>"
      }
    }
  }
}
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PAYMONGO_SECRET_KEY` | Yes | Secret API key from PayMongo dashboard |

## Demo Prompts

- "Create a payment intent for 100 PHP"
- "Create a GCash source for 50 PHP"
- "List recent payments"
- "Refund 25 PHP from payment pay_123"

## License

MIT
