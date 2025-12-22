export async function getPropertyFromWebhook(page: number = 1, filters?: any) {
  const url = "https://webhook.wiseuptech.com.br/webhook/apipagination";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_name: "get_client_property",
        tenant_id: "1911202511",
        page: page,
        limit: 8,
        filters: filters || null
      }),
    });

    const rawData = await response.json().catch(() => null);
    console.log("[ClientProperty] 🔄 Retorno da página", page, ":", rawData);

    if (Array.isArray(rawData) && rawData.length > 0) {
      const firstItem = rawData[0];
      const properties = firstItem.listProperty || [];
      const totalItems = firstItem.propertyAmount || 0;
      const propertyTypes = firstItem.propertyType || [];
      
      const per_page = 8;
      const totalPages = Math.ceil(totalItems / per_page);
      
      console.log(`📊 Paginação: ${totalItems} itens, ${totalPages} páginas, página atual: ${page}`);
      
      return {
        page: page,
        per_page: per_page,
        total_items: totalItems,
        total_pages: totalPages,
        data: properties,
        property_types: propertyTypes,
        filters: propertyTypes.map((type: any) => type.property_type_name)
      };
    }

    return rawData;
  } catch (error) {
    console.error("❌ Erro ao enviar webhook:", error);
    return null;
  }
}

export async function getUniquePropertyFromWebhook(propertyData: any) {
  const url = "https://webhook.wiseuptech.com.br/webhook/uniqueITEM";

  try {
    // Adicionando tenant_id ao objeto propertyData
    const requestData = {
      ...propertyData,
      tenant_id: "1911202511"
    };
    
    console.log("[ClientProperty] 🔄 Buscando imóvel único:", requestData);
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const rawData = await response.json();
    console.log("[ClientProperty] ✅ Dados do imóvel único recebidos:", rawData);

    if (Array.isArray(rawData) && rawData.length > 0) {
      const firstItem = rawData[0];
      
      if (firstItem.listProperty && Array.isArray(firstItem.listProperty) && firstItem.listProperty.length > 0) {
        return firstItem.listProperty[0];
      }
    }

    return rawData;
  } catch (error) {
    console.error("❌ Erro ao buscar imóvel único:", error);
    return null;
  }
}

export interface PaginatedResponse {
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
  data: any[];
  property_types?: Array<{ id: number; property_type_name: string }>;
  filters?: string[];
}