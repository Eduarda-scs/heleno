import supabase from "@/utility/supabaseClient";

export async function getCaracteristicas() {
    return await supabase.from("caract_heleno").select("*").order("id");
}

export async function deletarImoveis(ids) {
  return await supabase.from("heleno_imoveis").delete().in("id", ids);
}

// utils/supa/imoveis.js
export async function getImovelById(id) {
  return await supabase.from("heleno_imoveis").select("*").eq("id", id).single();
}


export async function deletebyid(id) {
  return await supabase.from("heleno_imoveis").delete("*").eq("id", id);
}

export async function createContato(payload) {
  return await supabase.from("heleno_contato").insert(payload);
}

export async function getEmpresasHeleno() {
  const { data, error } = await supabase
    .from("empresas_heleno")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Erro ao listar empresas:", error);
    return [];
  }

  return data;
}


export async function getHAUser(email: string, senha: string) {
  const { data, error } = await supabase
    .from("HA_user")
    .select("*")
    .eq("email", email)
    .eq("senha", senha)
    .single();

  if (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }

  return data;
}
