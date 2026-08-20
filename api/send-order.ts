export default {
  async fetch(request: Request) {
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
      });
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    const incomingFormData = await request.formData();

    const telegramFormData = new FormData();
    telegramFormData.append("chat_id", CHAT_ID as string);
    telegramFormData.append(
      "caption",
      incomingFormData.get("caption") as string,
    );
    telegramFormData.append(
      "document",
      incomingFormData.get("document") as Blob,
    );

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`,
      { method: "POST", body: telegramFormData },
    );

    if (!telegramRes.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to notify Telegram" }),
        { status: 502 },
      );
    }

    return Response.json({ ok: true });
  },
};
