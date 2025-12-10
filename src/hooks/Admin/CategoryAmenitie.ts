import { useState } from 'react';

interface CategoryAmenitieData {
  event_name: string;
  [key: string]: any;
}

export const useCategoryAmenitie = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendRequest = async (data: CategoryAmenitieData) => {
    setLoading(true);
    setError(null);

    try {
      // WEBHOOK FIXO DIRETO
      const webhookUrl =
        'https://webhook.wiseuptech.com.br/webhook/haimoveisCATEGORYAMENITIE';

      const requestData = {
        ...data,
        tenant_id: "1911202511"
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }

      const result = await response.json();
      setLoading(false);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  const getCategoryAmenitie = async () => {
    return sendRequest({ event_name: 'get_category_amenitie' });
  };

  const createCategoryAmenitie = async (
    type: 'category' | 'amenitie' | 'property_type' | 'property_negociation',
    data: any,
  ) => {
    return sendRequest({
      event_name: 'create_category_amenitie',
      type,
      ...data,
    });
  };

  const updateCategoryAmenitie = async (
    type: 'category' | 'amenitie' | 'property_type' | 'property_negociation',
    data: any,
  ) => {
    return sendRequest({
      event_name: 'update_category_amenitie',
      type,
      ...data,
    });
  };

  const deleteCategoryAmenitie = async (
    type: 'category' | 'amenitie' | 'property_type' | 'property_negociation',
    id: number,
  ) => {
    return sendRequest({
      event_name: 'delete_category_amenitie',
      type,
      id,
    });
  };

  return {
    loading,
    error,
    getCategoryAmenitie,
    createCategoryAmenitie,
    updateCategoryAmenitie,
    deleteCategoryAmenitie,
  };
};