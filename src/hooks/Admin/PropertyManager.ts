const API_URL = "https://services.wiseuptech.com.br/media/presigned";
const MEDIA_PROCESSING_URL = "https://webhook.wiseuptech.com.br/webhook/adminWISEUPTECHmedias";
const DATABASE_NAME = "helenoalvesbc";

interface PropertyPayload {
  titulo: string;
  descricao: string;
  cidade: string;
  bairro: string;
  rua: string;
  cep: string;
  numero: string;
  valor: string;
  negociacao: string;
  tipo: string;
  quartos: string;
  banheiros: string;
  vagas: string;
  metros: string;
  condominio: string;
  valorNegociacao: string;
  valorLocacao: string;
  foto: File[];
  phone: string;
  email: string;
  message: string;
  area: string;
  quarto: string;
  banheiro: string;
  vaga: string;
  endereco: string;
  finalidade: string;
  event_name: string;
  caracteristicas: string;
  comodidades: string;
  nome: string;
}

async function uploadFileToMinIO(file: File): Promise<string> {
  try {
    const presignedResponse = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename: file.name,
        database_name: DATABASE_NAME,
        content_type: file.type,
      }),
    });

    if (!presignedResponse.ok) {
      const errorText = await presignedResponse.text();
      throw new Error(`[uploadService] Erro ao obter presigned URL: ${presignedResponse.status} - ${errorText}`);
    }

    const presignedData = await presignedResponse.json();
    console.log(`[uploadService] 📤 Presigned URL obtida para: ${file.name}`);

    const uploadResponse = await fetch(presignedData.upload_url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error(`[uploadService] Erro ao fazer upload: ${uploadResponse.status}`);
    }

    console.log(`[uploadService] ✅ Upload concluído: ${file.name} → ${presignedData.final_url}`);
    return presignedData.final_url;
  } catch (error) {
    console.error(`[uploadService] ❌ Erro no upload de ${file.name}:`, error);
    throw error;
  }
}

async function sendMediaToBackend(mediaUrl: string, payload: PropertyPayload, index: number, total: number): Promise<void> {
  try {
    const mediaPayload = {
      titulo: payload.titulo,
      descricao: payload.descricao,
      cidade: payload.cidade,
      bairro: payload.bairro,
      rua: payload.rua,
      cep: payload.cep,
      numero: payload.numero,
      valor: payload.valor,
      negociacao: payload.negociacao,
      tipo: payload.tipo,
      quartos: payload.quartos,
      banheiros: payload.banheiros,
      vagas: payload.vagas,
      metros: payload.metros,
      condominio: payload.condominio,
      valorNegociacao: payload.valorNegociacao,
      valorLocacao: payload.valorLocacao,
      phone: payload.phone,
      email: payload.email,
      message: payload.message,
      area: payload.area,
      quarto: payload.quarto,
      banheiro: payload.banheiro,
      vaga: payload.vaga,
      endereco: payload.endereco,
      finalidade: payload.finalidade,
      event_name: payload.event_name,
      caracteristicas: payload.caracteristicas,
      comodidades: payload.comodidades,
      nome: payload.nome,
      tenant_id: "1911202511",
      database_name: DATABASE_NAME,
      media_url: mediaUrl,
      media_index: index,
      total_medias: total,
      database_platform: "plataform_one"
    };

    console.log(`[uploadService] 📤 Enviando mídia ${index + 1}/${total} para o backend...`);

    const response = await fetch(MEDIA_PROCESSING_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mediaPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao enviar mídia para o backend: ${response.status} - ${errorText}`);
    }

    console.log(`[uploadService] ✅ Mídia ${index + 1}/${total} enviada com sucesso para o backend: ${mediaUrl}`);
  } catch (error) {
    console.error(`[uploadService] ❌ Erro ao enviar mídia ${index + 1} para o backend:`, error);
    throw error;
  }
}

export async function sendPropertyToWebhook(payload: PropertyPayload): Promise<void> {
  try {
    console.log("[uploadService] 📦 Iniciando envio de propriedade...");

    if (payload.foto && payload.foto.length > 0) {
      console.log(`[uploadService] 📁 Total de arquivos para upload: ${payload.foto.length}`);

      for (let i = 0; i < payload.foto.length; i++) {
        const file = payload.foto[i];
        
        // 1. Faz upload para o MinIO
        const mediaUrl = await uploadFileToMinIO(file);
        
        // 2. Imediatamente após o upload, envia para o backend
        await sendMediaToBackend(mediaUrl, payload, i, payload.foto.length);
      }

      console.log("[uploadService] ✅ Todos os arquivos foram enviados com sucesso!");
    } else {
      console.log("[uploadService] ℹ️ Nenhum arquivo para enviar, enviando apenas dados...");
      
      // Se não há fotos, envia apenas os dados
      await sendMediaToBackend("", payload, 0, 0);
    }

    console.log("[uploadService] ✅ Propriedade processada com sucesso!");
  } catch (error) {
    console.error("[uploadService] ❌ Erro ao enviar para o webhook:", error);
    throw error;
  }
}