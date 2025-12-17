import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  const { id, slug } = event.queryStringParameters || {};

  // 🔒 Fallback de segurança
  const safeId = id || "0";
  const safeSlug = slug || "imovel";

  // ⚠️ TEMPORÁRIO (depois ligamos na API real)
  const property = {
    id: safeId,
    title: "Apartamento Frente Mar em Balneário Camboriú",
    description: "Imóvel de alto padrão em Balneário Camboriú. Confira fotos, valores e detalhes.",
    image: "https://helenoalvesbc.com.br/opt-empreendimentos.webp",
    url: `https://helenoalvesbc.com.br/empreendimento/${safeSlug}/${safeId}`,
  };

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<title>${property.title}</title>

<meta property="og:type" content="website" />
<meta property="og:title" content="${property.title}" />
<meta property="og:description" content="${property.description}" />
<meta property="og:image" content="${property.image}" />
<meta property="og:url" content="${property.url}" />

<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
</head>
<body></body>
</html>`;

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
      "Cache-Control": "public, max-age=300", // cache leve (5 min)
    },
    body: html,
  };
};
