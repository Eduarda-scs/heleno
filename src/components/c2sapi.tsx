export async function createLeadC2S(formData) {
  const payload = {
    data: {
      type: "lead",
      attributes: {
        ramal: formData.ramal || "",
        source: formData.source || "site_heleno",
        name: formData.name,
        phone: formData.phone,
        phone2: formData.phone2 || formData.phone,
        email: formData.email,
        city: formData.city || "",
        neighbourhood: formData.neighbourhood || "",
        prop_ref: formData.prop_ref || "",
        type_negotiation: formData.type_negotiation || "",
        brand: formData.brand || "",
        model: formData.model || "",
        description: formData.description || "",
        price: formData.price || "",
        url: formData.url || window.location.href,
        body: formData.body || `Olá, meu nome é ${formData.name}`,
        tags: formData.tags || [],
      },
    },
  };

  

  const response = await fetch("http://localhost:3001/api/create-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    console.error("❌ Erro do backend:", err);
    throw new Error("Erro ao criar lead no backend");
  }

  return response.json();
}
