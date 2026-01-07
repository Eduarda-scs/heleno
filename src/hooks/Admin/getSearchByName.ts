export async function getSearchByName(propertyName: string) {
  const url = "https://webhook.wiseuptech.com.br/webhook/1938e640-0ab2-4a03-9ede-3fa28721632e-search-name";

  const payload = {
    event_name: "search_property_by_name",
    tenant_id: "1911202511",
    property_name: propertyName?.trim()
  };

  console.log("🔎 [SEARCH NAME] Enviando para backend:", payload);

  if (!propertyName || !propertyName.trim()) {
    return [];
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const rawData = await response.json();
    console.log("🔄 [SEARCH NAME] Retorno do backend:", rawData);

    if (Array.isArray(rawData) && rawData.length > 0) {
      const firstItem = rawData[0];

      if (Array.isArray(firstItem.listProperty)) {
        return firstItem.listProperty;
      }
    }

    return [];
  } catch (error) {
    console.error("❌ Erro na pesquisa por nome:", error);
    return [];
  }
}
