import { usePropertyStore } from '../../store/usePropertyService';

export interface PaginatedPropertyResponse {
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
  properties: any[];
  categories: any[];
  amenities: any[];
  property_types: any[];
}

export async function getPropertyFromWebhook(page: number = 1, limit: number = 5, filters?: any) {
  const url = "https://webhook.wiseuptech.com.br/webhook/apiADMINpagination";

  const payload = {
    event_name: "get_property",
    tenant_id: "1911202511",
    page: page,
    limit: limit,
    filters: filters || null
  };
  console.log("🧠 RAW firstItem:", firstItem);


  console.log('📦 [PAYLOAD ADMIN] Enviando para backend:', payload);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const rawData = await response.json().catch(() => null);
    console.log("[PropertyService] 🔄 Retorno da página", page, "com filtros:", filters, "dados:", rawData);

    if (Array.isArray(rawData) && rawData.length > 0) {
      const firstItem = rawData[0];

      const properties = firstItem.listProperty || [];
      const totalItems = firstItem.propertyAmount || properties.length;
      const categories = firstItem.categories || [];
      const amenities = firstItem.amenities || [];
      const propertyTypes = firstItem.propertyType || [];

      const totalPages = Math.ceil(totalItems / limit);

      console.log(`📊 Paginação: ${totalItems} itens, ${totalPages} páginas, página atual: ${page}`);

      const paginatedResponse: PaginatedPropertyResponse = {
        page: page,
        per_page: limit,
        total_items: totalItems,
        total_pages: totalPages,
        properties: properties,
        categories: categories,
        amenities: amenities,
        property_types: propertyTypes
      };

      if (properties.length > 0) {
        usePropertyStore.getState().setPropertyData([firstItem]);
      }

      return paginatedResponse;
    }

    return {
      page: page,
      per_page: limit,
      total_items: 0,
      total_pages: 0,
      properties: [],
      categories: [],
      amenities: [],
      property_types: []
    };
  } catch (error) {
    console.error("❌ Erro ao enviar webhook:", error);
    return {
      page: page,
      per_page: limit,
      total_items: 0,
      total_pages: 0,
      properties: [],
      categories: [],
      amenities: [],
      property_types: []
    };
  }
}

export async function getUniquePropertyFromWebhook(propertyData: any) {
  const url = "https://webhook.wiseuptech.com.br/webhook/ADMINuniqueITEM";

  try {
    const requestData = {
      ...propertyData,
      tenant_id: "1911202511"
    };

    console.log("[PropertyService] 🔄 Buscando imóvel único:", requestData);

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
    console.log("[PropertyService] ✅ Dados do imóvel único recebidos:", rawData);

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
