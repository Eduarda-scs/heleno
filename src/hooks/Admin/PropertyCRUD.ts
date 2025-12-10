export interface PropertyUpdateData {
  event_name: string;
  property_id: number;
  previous_data: any;
  updated_data: any;
  media_key?: string;
}

export const usePropertyCRUD = () => {
  const updateProperty = async (data: PropertyUpdateData) => {
    try {
      const response = await fetch('https://webhook.wiseuptech.com.br/webhook/haimoveisPROPERTYMANAGER', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          tenant_id: "1911202511", // 👈 valor fixo adicionado
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar propriedade');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar propriedade:', error);
      throw error;
    }
  };

  return {
    updateProperty,
  };
};
