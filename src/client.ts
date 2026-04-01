const BASE_URL = "https://api.paymongo.com/v1";
const TIMEOUT = 15_000;

export class PayMongoClient {
  private secretKey: string;

  constructor() {
    this.secretKey = process.env.PAYMONGO_SECRET_KEY ?? "";
    if (!this.secretKey) {
      throw new Error(
        "Environment variable PAYMONGO_SECRET_KEY is required. " +
        "Get your key at https://dashboard.paymongo.com/"
      );
    }
  }

  private get authHeader(): string {
    return "Basic " + Buffer.from(this.secretKey + ":").toString("base64");
  }

  async request(method: string, path: string, body?: unknown): Promise<unknown> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: {
          "Authorization": this.authHeader,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`PayMongo HTTP ${response.status}: ${text}`);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timer);
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("PayMongo: request timeout (15s).");
      }
      throw error;
    }
  }
}
