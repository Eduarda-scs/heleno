export interface PaginatedResponse {
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
  data: any[];
  property_types?: Array<{ id: number; property_type_name: string }>;
  filters?: string[];
  propertyBedrooms?: Array<{ property_bedrooms: number }>;
  propertyGarageSpaces?: Array<{ property_garage_spaces: number }>;
  propertyCities?: Array<{ property_city: string }>;
}

export async function getPropertyFromWebhook(page: number = 1, filters?: any) {
  const url = "https://webhook.wiseuptech.com.br/webhook/apipagination";

  const payload = {
    event_name: "get_client_property",
    tenant_id: "1911202511",
    page: page,
    limit: 8,
    filters: filters || null
  };

  console.log('📦 [PAYLOAD] Enviando para backend:', payload);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const rawData = await response.json().catch(() => null);
    console.log("[ClientProperty] 🔄 Retorno da página", page, "com filtros:", filters, "dados:", rawData);

    if (Array.isArray(rawData) && rawData.length > 0) {
      const firstItem = rawData[0];
      const properties = firstItem.listProperty || [];

      const totalItems = firstItem.filteredAmount || firstItem.propertyAmount || 0;
      const propertyTypes = firstItem.propertyType || [];
      const propertyBedrooms = firstItem.propertyBedrooms || [];
      const propertyGarageSpaces = firstItem.propertyGarageSpaces || [];
      const propertyCities = firstItem.propertyCities || [];

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
        propertyBedrooms: propertyBedrooms,
        propertyGarageSpaces: propertyGarageSpaces,
        propertyCities: propertyCities,
        filters: propertyTypes.map((type: any) => type.property_type_name)
      };
    }

    return {
      page: page,
      per_page: 8,
      total_items: 0,
      total_pages: 0,
      data: [],
      property_types: [],
      propertyBedrooms: [],
      propertyGarageSpaces: [],
      propertyCities: [],
      filters: []
    };
  } catch (error) {
    console.error("❌ Erro ao enviar webhook:", error);
    return {
      page: page,
      per_page: 8,
      total_items: 0,
      total_pages: 0,
      data: [],
      property_types: [],
      propertyBedrooms: [],
      propertyGarageSpaces: [],
      propertyCities: [],
      filters: []
    };
  }
}

export async function getUniquePropertyFromWebhook(propertyData: any) {
  const url = "https://webhook.wiseuptech.com.br/webhook/uniqueITEM";

  try {
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
