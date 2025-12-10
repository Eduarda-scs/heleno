export async function removeProperty(propertyId: number): Promise<boolean> {
  try {
    const response = await fetch('https://webhook.wiseuptech.com.br/webhook/haimoveisPROPERTYMANAGER', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_name: 'delete_property',
        property_id: propertyId,
        tenant_id: "1911202511"
      }),
    });

    if (!response.ok) {
      console.error('[RemoveProperty] Erro ao excluir propriedade:', response.statusText);
      return false;
    }

    console.log('[RemoveProperty] Propriedade excluída com sucesso:', propertyId);
    return true;
  } catch (error) {
    console.error('[RemoveProperty] Erro na requisição:', error);
    return false;
  }
}
