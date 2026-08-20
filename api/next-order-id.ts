import { Redis } from "@upstash/redis";

const pad = (n: number, len = 2) => String(n).padStart(len, "0");

export default {
  async fetch(request: Request) {
    console.log(
      "KV env:",
      !!process.env.KV_REST_API_URL,
      !!process.env.KV_REST_API_TOKEN,
    );
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
      });
    }

    const now = new Date();
    const dateKey = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
    const counterKey = `order-count:${dateKey}`;

    const redis = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    });
    const count = await redis.incr(counterKey);
    await redis.expire(counterKey, 60 * 60 * 48);

    const orderNumber = pad(count, 4);
    const hh = pad(now.getHours());
    const mm = pad(now.getMinutes());
    const orderId = `PM-${orderNumber}-${dateKey}-${hh}${mm}`;

    return Response.json({ orderId });
  },
};
