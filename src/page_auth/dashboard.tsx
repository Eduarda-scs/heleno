import { useEffect,useMemo, useState } from "react";
import {
  Building2,
  Users,
  CalendarCheck,
  TrendingUp,
  BarChart3,
  Home,
  Calendar,
} from "lucide-react";
import { fetchDashboardData } from "@/hooks/Admin/dashboardApi";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import Header from "@/components/Header";

type Metrics = {
  properties: number;
  leads: number;
  visits: number;
  conversion: number;
  views: number;
};


/* DADOS DO GRÁFICO */
const visitsData = [
  { date: "01/01", visitas: 120, visitasUnicas: 90 },
  { date: "02/01", visitas: 210, visitasUnicas: 160 },
  { date: "03/01", visitas: 180, visitasUnicas: 140 },
  { date: "04/01", visitas: 260, visitasUnicas: 200 },
  { date: "05/01", visitas: 320, visitasUnicas: 250 },
  { date: "06/01", visitas: 280, visitasUnicas: 220 },
];

const MetricCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: any;
}) => (
  <div className="rounded-2xl p-6 bg-gradient-to-br from-[#1b4c57] via-[#07262d] to-[#324d41] shadow-lg">
    <div className="flex items-center justify-between mb-4">
      <span className="text-xs uppercase tracking-widest text-[#e3dfda] font-bwmodelica">
        {title}
      </span>
      <Icon className="w-6 h-6 text-[#d2ab80]" />
    </div>

    <p className="text-3xl font-bold text-[#f6e9d2] font-bwmodelica">
      {value}
    </p>
  </div>
);

const Dashboard = () => {
  const [metrics, setMetrics] = useState<Metrics>({
    properties: 0,
    leads: 0,
    visits: 0,
    conversion: 0,
    views: 0,
  });
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [loading, setLoading] = useState(false);


  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  const [startDate, setStartDate] = useState(
    firstDay.toISOString().split("T")[0]
  );

  const [endDate, setEndDate] = useState(
    today.toISOString().split("T")[0]
  );

  async function loadDashboard() {
    try {
      setLoading(true);

      const response = await fetchDashboardData(startDate, endDate);

      setMetrics({
        properties: response.properties ?? 0,
        leads: response.leads ?? 0,
        visits: response.visits ?? 0,
        conversion: response.conversion ?? 0,
        views: response.views ?? 0,
      });

      setChartData(response.chart ?? []);

    } catch (err) {
      console.error("Erro ao carregar dashboard", err);
    } finally {
      setLoading(false);
    }
  }

  // 🔁 carrega sempre que mudar data
  useEffect(() => {
    loadDashboard();
  }, [startDate, endDate]);

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <Header />

      <main className="container mx-auto px-4 lg:px-8 pt-28 pb-12">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold text-[#07262d]">
              Dashboard
            </h1>
            <p className="text-gray-600">
              Visão geral do desempenho
            </p>
          </div>

          {/* FILTRO */}
          <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm">
            <Calendar className="w-5 h-5 text-gray-500" />

            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="border px-3 py-2 rounded-lg text-sm"
            />

            <span>até</span>

            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="border px-3 py-2 rounded-lg text-sm"
            />
          </div>
        </div>

        {/* MÉTRICAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-14">
          <MetricCard title="Imóveis Ativos" value={metrics.properties} icon={Building2} />
          <MetricCard title="Leads no Mês" value={metrics.leads} icon={Users} />
          <MetricCard title="Visitas Agendadas" value={metrics.visits} icon={CalendarCheck} />
          <MetricCard title="Conversão" value={`${metrics.conversion}%`} icon={TrendingUp} />
          <MetricCard title="Visualizações" value={metrics.views} icon={BarChart3} />
        </div>

        {/* DESEMPENHO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">

          {/* PERFORMANCE */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-[#07262d] mb-4 font-bwmodelica">
              Performance do mês
            </h3>

            <div className="space-y-4">
              <Progress label="Leads" value={80} />
              <Progress label="Visitas" value={55} />
              <Progress label="Conversão" value={64} />
            </div>
          </div>

          {/* DISTRIBUIÇÃO DE INTERESSE - GRÁFICO */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-[#07262d] mb-6 font-bwmodelica">
              Distribuição de Interesse
            </h3>

            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={visitsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Line
                  type="monotone"
                  dataKey="visitas"
                  name="Visitas"
                  stroke="#9e77ab"
                  strokeWidth={3}
                  dot={false}
                />

                <Line
                  type="monotone"
                  dataKey="visitasUnicas"
                  name="Visitas Únicas"
                  stroke="#d2ab80"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* IMÓVEIS EM DESTAQUE */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-[#07262d] mb-6 font-bwmodelica">
            Imóveis mais procurados
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: "Apartamento Frente Mar", price: "R$ 3.200.000" },
              { name: "Cobertura Duplex", price: "R$ 5.800.000" },
              { name: "Alto Padrão Centro", price: "R$ 2.400.000" },
              { name: "Investimento na Planta", price: "R$ 1.100.000" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-4 rounded-xl bg-[#f9f5f3]"
              >
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-[#9e77ab]" />
                  <span className="font-medium text-[#07262d]">
                    {item.name}
                  </span>
                </div>
                <span className="text-[#d2ab80] font-semibold">
                  {item.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

/* COMPONENTES AUXILIARES */

const Progress = ({ label, value }: { label: string; value: number }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-2 bg-[#e3dfda] rounded-full">
      <div
        className="h-full bg-[#9e77ab] rounded-full"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

export default Dashboard;
