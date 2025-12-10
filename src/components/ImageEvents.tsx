// src/events/ImageEvents.ts
"use client";
export interface ImovelData {
  name: string;
  email: string;
  phone: string;
  message: string;
  id?: string;
  foto: File[];
  tipo: string;
  finalidade: string;
  titulo: string;
  endereco: string;
  area: string;
  quarto: string;
  banheiro: string;
  vaga: string;
  valor: string;
  agree: boolean;
 
}

// Interface para envio de perfil
export interface PerfilData {
  nome?: string;
  email: string;
  telefone?: string;
  foto?: File | null;
  senha_antiga?: string;
  nova_senha?: string;
  confirmar_senha?: string;
  acao: "perfil" | "alterar_senha";
}

//URL principal usada no painel da WiseUpTech
const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL;



//Função para ENVIAR (criar novo imóvel)
export const createImovel = async (data: ImovelData): Promise<Response> => {
  const formData = new FormData();
  formData.append("funcao", "criar");

  Object.entries(data).forEach(([key, value]) => {
    if (key === "foto") {
      (value as File[]).forEach((file) => {
        formData.append("foto", file);
      });
    } else {
      formData.append(key, String(value));
    }
  });

  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    body: formData,
  });

  return response;
};

//Buscar todos os imóveis
export const getImoveis = async () => {
  const response = await fetch(WEBHOOK_URL);
  return response.json();
};

// Atualizar imóvel existente
export const updateImovel = async (id: string, data: Partial<ImovelData>) => {
  const response = await fetch(`${WEBHOOK_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
};

//Remover imóvel individual
export const removeImovel = async (id: string) => {
  const response = await fetch(`${WEBHOOK_URL}/${id}`, {
    method: "DELETE",
  });
  return response.ok;
};

// Buscar imóveis via webhook
export async function getImoveisWebhook() {
  const response = await fetch(WEBHOOK_URL, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar imóveis");
  }

  return await response.json();
}

//Excluir múltiplos imóveis via webhook
export async function deleteImoveisWebhook(ids: number[]) {
  const response = await fetch(WEBHOOK_URL, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  if (!response.ok) {
    throw new Error("Erro ao excluir imóveis");
  }

  return await response.json();
}

/* ===========================
      PERFIL DE USUÁRIO
=========================== */

// Enviar dados de perfil ou senha para o webhook (usado em Profile.tsx)
export const enviarPerfilWebhook = async (data: PerfilData): Promise<Response> => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === "foto" && value instanceof File) {
        formData.append("foto", value);
      } else {
        formData.append(key, String(value));
      }
    }
  });

  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    body: formData,
  });

  return response;
};
