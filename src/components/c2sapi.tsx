export interface LeadPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: "modal" | "contact_page";
}

const WEBHOOK_URL =
  "https://webhook.wiseuptech.com.br/webhook/052524f2-c90c-49ea-b447-82b97c07af6e";

export async function sendLeadToWebhook(data: LeadPayload): Promise<void> {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        createdAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("Erro ao enviar lead para o webhook");
    }
  } catch (error) {
    console.error("Webhook error:", error);
    throw error;
  }
}
