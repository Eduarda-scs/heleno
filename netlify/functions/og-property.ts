import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  const path = event.path; 
  // /empreendimento/condominio-horizontal-praia-brava/127

  const [, , slug, id] = path.split("/");

  // ⚠️ imagem PRECISA ser jpg ou png
  const property = {
    title: "Apartamento Frente Mar em Balneário Camboriú",
    description: "Imóvel de alto padrão em Balneário Camboriú. Confira fotos, valores e detalhes.",
    image: "https://picsum.photos/1200/630.jpg",
    url: `https://helenoalvesbc.com.br${path}`,
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

<meta http-equiv="refresh" content="0;url=${property.url}" />
</head>
<body></body>
</html>`;

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html",
    },
    body: html,
  };
};
