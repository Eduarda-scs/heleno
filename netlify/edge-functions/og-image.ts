import type { Context } from "https://edge.netlify.com";

const WEBHOOK_URL = "https://webhook.wiseuptech.com.br/webhook/uniqueITEM";

interface SimplifiedPropertyResponse {
  linkPreview: string;
  property_title: string;
  property_detail?: string;
}

function isBot(userAgent: string): boolean {
  if (!userAgent) return false;
  
  const ua = userAgent.toLowerCase();
  const botPatterns = [
    'facebookexternalhit',
    'facebot',
    'twitterbot',
    'whatsapp',
    'linkedinbot',
    'slackbot',
    'telegrambot',
    'discordbot',
    'pinterest',
    'googlebot',
    'bingbot',
    'slurp',
    'duckduckbot'
  ];
  
  return botPatterns.some(bot => ua.includes(bot));
}

function truncateDescription(text: string | undefined, maxLength: number = 160): string {
  if (!text) return 'Imóvel disponível para venda. Confira mais detalhes.';
  
  // Remove formatação e linhas em excesso
  const cleanText = text
    .replace(/->/g, '')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
    
  if (cleanText.length <= maxLength) return cleanText;
  return cleanText.substring(0, maxLength).trim() + '...';
}

async function fetchPropertyById(id: string): Promise<SimplifiedPropertyResponse | null> {
  try {
    console.log(`[OG] Fetching property ID: ${id}`);
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ id: parseInt(id, 10) }),
    });

    if (!response.ok) {
      console.error(`[OG] HTTP Error: ${response.status}`);
      return null;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      console.error(`[OG] Invalid content type: ${contentType}`);
      return null;
    }

    const data = await response.json();
    console.log(`[OG] API Response:`, JSON.stringify(data).substring(0, 200));
    
    if (Array.isArray(data) && data.length > 0 && data[0].property_title) {
      return data[0];
    }
    
    return null;
  } catch (error) {
    console.error(`[OG] Fetch error:`, error);
    return null;
  }
}

export default async function handler(request: Request, context: Context) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';
  const path = url.pathname;
  
  console.log(`[OG] Request: ${path}`);
  console.log(`[OG] User-Agent: ${userAgent.substring(0, 100)}`);
  
  // Verifica se é uma rota de imóvel
  const match = path.match(/^\/empreendimento\/[^\/]+\/(\d+)\/?$/);
  if (!match) {
    return context.next();
  }
  
  const propertyId = match[1];
  
  // Verifica se é um bot
  if (!isBot(userAgent)) {
    console.log(`[OG] Not a bot, passing through`);
    return context.next();
  }
  
  console.log(`[OG] Bot detected! Generating OG for property ${propertyId}`);
  
  // Busca dados do imóvel
  const property = await fetchPropertyById(propertyId);
  
  if (!property) {
    console.log(`[OG] Property not found, passing through`);
    return context.next();
  }
  
  // Prepara dados
  const title = `${property.property_title} | Heleno Alves`;
  const description = truncateDescription(property.property_detail);
  const imageUrl = property.linkPreview || '';
  const currentUrl = `https://helenosite.netlify.app${path}`;
  
  console.log(`[OG] Generating HTML for: ${title}`);
  
  // Gera HTML com meta tags
  const html = `<!DOCTYPE html>
<html prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="utf-8">
    <title>${title}</title>
    <meta name="description" content="${description}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${property.property_title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:url" content="${imageUrl}">
    <meta property="og:image:secure_url" content="${imageUrl}">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:url" content="${currentUrl}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Heleno Alves">
    <meta property="og:locale" content="pt_BR">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${property.property_title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${imageUrl}">
    <meta name="twitter:site" content="@helenoalves">
    
    <!-- WhatsApp -->
    <meta property="og:image:alt" content="${property.property_title}">
</head>
<body>
    <h1>${property.property_title}</h1>
    <p>${description}</p>
    <p><a href="${currentUrl}">Ver detalhes completos do imóvel</a></p>
    <script type="text/javascript">
        window.location.href = "${currentUrl}";
    </script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}

export const config = {
  path: "/empreendimento/*",
};