type DashboardResponse = {
  metrics: {
    properties: number;
    leads: number;
    visits: number;
    conversion: number;
    views: number;
  };
  chart: {
    date: string;
    visitas: number;
    visitasUnicas: number;
  }[];
};

/* 🔹 URL DO SEU WEBHOOK N8N */
const DASHBOARD_WEBHOOK =
  "https://editor.wiseuptech.com.br/webhook-test/9ea04593-5d4e-41ae-a726-75bb82a09831";

/* 🔹 Função para pegar último mês automaticamente */
function getLastMonthRange() {
  const end = new Date();
  const start = new Date();

  start.setMonth(start.getMonth() - 1);

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

/* 🔥 FUNÇÃO PRINCIPAL */
export async function fetchDashboardData(
  startDate?: string,
  endDate?: string
): Promise<DashboardResponse> {
  const range = getLastMonthRange();

  const params = new URLSearchParams({
    start: startDate || range.startDate,
    end: endDate || range.endDate,
  });

  const response = await fetch(
    `${DASHBOARD_WEBHOOK}?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Erro ao carregar dashboard");
  }

  return response.json();
}
