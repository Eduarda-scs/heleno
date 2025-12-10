export async function getPropertyFromWebhook() {
  const url = "https://webhook.wiseuptech.com.br/webhook/haimoveisPROPERTYMANAGER";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_name: "get_client_property",
        tenant_id: "1911202511"
      }),
    });

    const data = await response.json().catch(() => null);
    console.log("[ClientProperty] 🔄 Retorno:", data);

    return data;
  } catch (error) {
    console.error("❌ Erro ao enviar webhook:", error);
    return null;
  }
}
