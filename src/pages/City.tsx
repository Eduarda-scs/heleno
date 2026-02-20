import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect, Suspense, useRef, lazy, useMemo} from "react";

// LAZY LOAD PARA REDUZIR A CADEIA CRÍTICA
const Header = lazy(() => import("@/components/Header"));
const Footer = lazy(() => import("@/components/Footer"));

// IMPORTAÇÃO SUPER LEVE DOS ÍCONES DO LUCIDE (SEM TRAZER A LIB INTEIRA)
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right";
import Building2 from "lucide-react/dist/esm/icons/building-2";
import Heart from "lucide-react/dist/esm/icons/heart";
import ShieldCheck from "lucide-react/dist/esm/icons/shield-check";
import Sparkles from "lucide-react/dist/esm/icons/sparkles";
import TrendingUp from "lucide-react/dist/esm/icons/trending-up";
import Users from "lucide-react/dist/esm/icons/users";
import Waves from "lucide-react/dist/esm/icons/waves";
import FloatingContactWidget from "@/components/whatsapp";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);




// Imagens
import passarela from "@/assets/opt-passarela.webp";
import imagem2 from "@/assets/opt-image2.webp";
import imagem1 from "@/assets/opt-image1.webp";

const imagens = [passarela, imagem2, imagem1];

const valuationData = {
  BalnearioCamboriu: [
    { year: 2000, price: 2000 },
    { year: 2005, price: 3500 },
    { year: 2010, price: 5500 },
    { year: 2015, price: 8800 },
    { year: 2020, price: 11500 },
    { year: 2024, price: 13911 },
    { year: 2025, price: 14906 },
  ],
  SaoPaulo: [
    { year: 2000, price: 1800 },
    { year: 2005, price: 3000 },
    { year: 2010, price: 4800 },
    { year: 2015, price: 7500 },
    { year: 2020, price: 9800 },
    { year: 2024, price: 11374 },
    { year: 2025, price: 11900 },
  ],
  RioDeJaneiro: [
    { year: 2000, price: 1700 },
    { year: 2005, price: 2800 },
    { year: 2010, price: 4500 },
    { year: 2015, price: 7000 },
    { year: 2020, price: 9300 },
    { year: 2024, price: 10289 },
    { year: 2025, price: 10830 },
  ],
};


function ValorizacaoChart() {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    if (chartRef.current) observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, []);

  const data = useMemo(
    () => ({
      labels: valuationData.BalnearioCamboriu.map(d => d.year),
      datasets: [
        {
          label: "Balneário Camboriú",
          data: valuationData.BalnearioCamboriu.map(d => d.price),
          borderColor: "#C6A46C",
          backgroundColor: "rgba(198,164,108,0.08)",
          borderWidth: 3.5,
          tension: 0.45,
          pointRadius: 0,
          fill: true,
        },
        {
          label: "São Paulo",
          data: valuationData.SaoPaulo.map(d => d.price),
          borderColor: "#64748B",
          borderWidth: 1.8,
          tension: 0.35,
          pointRadius: 0,
        },
        {
          label: "Rio de Janeiro",
          data: valuationData.RioDeJaneiro.map(d => d.price),
          borderColor: "#94A3B8",
          borderWidth: 1.8,
          tension: 0.35,
          pointRadius: 0,
        },
      ],
    }),
    []
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,

      animation: {
        duration: 1600,
        easing: "easeInOutCubic",
      },

      hover: {
        animationDuration: 0,
      },

      responsiveAnimationDuration: 0,

      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#9CA3AF",
            boxWidth: 12,
            boxHeight: 2,
            font: { size: 12, weight: "300" },
          },
        },
      },

      scales: {
        y: {
          ticks: {
            color: "#9CA3AF",
            callback: (v: number) =>
              `R$ ${v.toLocaleString("pt-BR")}`,
          },
          grid: { drawBorder: false },
        },
        x: {
          ticks: { color: "#9CA3AF" },
          grid: { display: false },
        },
      },
    }),
    []
  );

  return (
    <div
      ref={chartRef}
      className="relative w-full h-[300px] md:h-[420px] lg:h-[480px]"
    >
      {animate && (
        <Line
          data={data}
          options={options}
          redraw={false}
        />
      )}
    </div>
  );
}



export default function City() {
  const [atual, setAtual] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [isMuted2, setIsMuted2] = useState(true);
  const [showOverlayContent, setShowOverlayContent] = useState(true);
  const [cardsVisible, setCardsVisible] = useState(false);
  const cardsRef = useRef<HTMLDivElement>(null);

  


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCardsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (cardsRef.current) {
      observer.observe(cardsRef.current);
    }

    return () => observer.disconnect();
  }, []);




  const handleToggleSound2 = () => {
    if (video2Ref.current) {
      video2Ref.current.muted = !isMuted2;
      video2Ref.current.play();
      setIsMuted2(!isMuted2);
    }
  };

  useEffect(() => {
  const timer = setTimeout(() => {
      setShowOverlayContent(false);
    }, 4000); // 4 segundos

    return () => clearTimeout(timer);
  }, []);




  const handleToggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      videoRef.current.play();
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setAtual((prev) => (prev + 1) % imagens.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const cityStats = [
    { icon: Users, label: "População", value: "145 mil+" },
    { icon: TrendingUp, label: "Crescimento", value: "Constante" },
    { icon: Building2, label: "Edifícios", value: "Modernos" },
    { icon: ShieldCheck, label: "Segurança", value: "Excelente" },
  ];

  const investmentReasons = [
    {
      icon: TrendingUp,
      title: "Valorização Constante",
      description:
        "Uma das cidades que mais valoriza no Brasil, com investimentos contínuos.",
    },
    {
      icon: Heart,
      title: "Qualidade de Vida",
      description:
        "Cidade segura, moderna, com lazer completo e infraestrutura impecável.",
    },
    {
      icon: Waves,
      title: "Turismo Premium",
      description:
        "Capital do turismo de luxo no Sul do Brasil com fluxo anual intenso.",
    },
    {
      icon: Sparkles,
      title: "Infraestrutura Moderna",
      description:
        "Obras, tecnologia, mobilidade e urbanismo que colocam BC no topo.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* SUSPENSE NO HEADER */}
      <Suspense fallback={<div className="h-20 w-full" />}>
        <Header />
      </Suspense>

      {/* HERO */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">

      {/* IMAGEM ESTÁTICA */}
      <img
        src="/opt-balneario.webp"
        alt="Balneário Camboriú"
        className={`
          absolute inset-0 
          w-full h-full 
          object-cover 
          transition-opacity duration-1000
          ${videoLoaded ? "opacity-0" : "opacity-100"}
        `}
      />

      <video
        ref={videoRef}  // 👈 FALTAVA ISSO
        className={`
          absolute inset-0 
          w-full h-full 
          object-cover 
          transition-opacity duration-1000
          ${videoLoaded ? "opacity-100" : "opacity-0"}
        `}
        src="https://res.cloudinary.com/dxgehoigz/video/upload/v1770828293/o9wbjjqshmmpnv1ybdiu.mp4"
        autoPlay
        loop
        muted={isMuted}  // 👈 MELHOR usar estado aqui
        playsInline
        onLoadedData={() => setVideoLoaded(true)}
      />


      {/* BOTÃO SOM */}
      <button
        onClick={handleToggleSound}
        className="
          absolute 
          bottom-4 left-4 
          md:bottom-6 md:left-6 
          z-20
          bg-black/30 backdrop-blur-md
          text-white 
          text-xs md:text-sm
          px-3 py-2 md:px-4 md:py-2
          rounded-full 
          border border-white/30 
          hover:bg-black/50 
          transition 
          shadow-lg
        "
      >
        {isMuted ? "🔇" : "🔊"}
      </button>


    </section>

      {/* ESTATÍSTICAS */}
      <section className="py-12 md:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {cityStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="
                  bg-primary-foreground/10 
                  rounded-xl 
                  p-4 
                  sm:p-6 
                  text-center 
                  backdrop-blur-sm 
                  hover:bg-primary-foreground/15 
                  hover:scale-[1.03] 
                  transition-all 
                  duration-300 
                  animate-fade-up
                "
              >
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-secondary" />
                  </div>
                </div>

                <p className="text-2xl sm:text-3xl font-bwmodelica mb-1 sm:mb-2">
                  {stat.value}
                </p>
                <p className="text-sm sm:text-base text-primary-foreground/80">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      
      {/* VÍDEO INSTITUCIONAL */}
      <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">

        <video
          ref={video2Ref}
          className="absolute inset-0 w-full h-full object-cover"
          src="https://res.cloudinary.com/dxgehoigz/video/upload/v1770829345/sqbeiaqsrzqgv17bltie.mp4"
          autoPlay
          loop
          muted={isMuted2}
          playsInline
        />

        {/* Overlay escuro */}
        <div className="absolute inset-0 bg-black/50" />

        {/* CONTEÚDO QUE DESAPARECE */}
        <div
          className={`
            absolute inset-0 
            flex items-center justify-center 
            text-center px-6 
            transition-opacity duration-1000
            ${showOverlayContent ? "opacity-100" : "opacity-0"}
          `}
        >
          <div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl text-white mb-4">
              Viva o <span className="text-secondary">Extraordinário</span>
            </h2>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
              Descubra o que faz Balneário Camboriú ser referência em luxo e valorização imobiliária.
            </p>
          </div>
        </div>

        {/* BOTÃO SOM */}
        <button
          onClick={handleToggleSound2}
          className="
            absolute bottom-4 left-4 md:bottom-6 md:left-6
            z-20
            bg-black/30 backdrop-blur-md
            text-white
            text-xs md:text-sm
            px-3 py-2 md:px-4 md:py-2
            rounded-full
            border border-white/30
            hover:bg-black/50
            transition
            shadow-lg
          "
        >
          {isMuted2 ? "🔇" : "🔊"}
        </button>

      </section>



      {/* INVESTIMENTO */}
      <section className="py-14 md:py-24 bg-luxury-bg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-center mb-4">
            Por que <span className="text-secondary">investir</span> em BC?
          </h2>

          <p className="text-center text-muted-foreground mb-10 sm:mb-14 max-w-xl mx-auto text-sm sm:text-base">
            Descubra os motivos que fazem de Balneário Camboriú o destino ideal para seu investimento
          </p>

          <div
            ref={cardsRef}
            className="grid sm:grid-cols-2 gap-6 md:gap-8"
          >

            {investmentReasons.map((reason, i) => {
              const Icon = reason.icon;
              return (
                <div
                  key={i}
                  className={`
                    group 
                    p-5 sm:p-8 
                    rounded-2xl 
                    bg-[#7e8aa6]/20 
                    border border-[#d6b25e]/40 
                    shadow-lg 
                    hover:shadow-[#d6b25e77] 
                    hover:-translate-y-2 
                    transition-all 
                    duration-300
                    ${cardsVisible ? "animate-dropIn opacity-0" : "opacity-0"}
                  `}
                  style={
                    cardsVisible
                      ? { animationDelay: `${i * 0.6}s` }
                      : undefined
                  }
                >


                  <div className="flex items-start gap-4 sm:gap-5">
                    <div
                      className="
                        w-12 h-12 sm:w-16 sm:h-16 
                        rounded-2xl 
                        bg-white/10 
                        group-hover:bg-white/20 
                        flex items-center justify-center 
                        transition-colors
                      "
                    >
                      <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-[#7e8aa6]" />
                    </div>

                    <div className="text-black">
                      <h3 className="text-xl sm:text-2xl font-bwmodelica mb-1 sm:mb-2">
                        {reason.title}
                      </h3>
                      <p className="text-sm sm:text-base">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* GRAFICO */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* TEXTO */}
            <div>
              <span className="text-xs text-accent font-body tracking-[0.25em] uppercase">
                Valorização Imobiliária
              </span>

              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6 leading-tight">
                A valorização imobiliária de Balneário Camboriú ao longo do tempo
              </h2>

              <div className="space-y-4 text-muted-foreground font-body text-sm md:text-base leading-relaxed">
                <p>
                  Ao longo das últimas décadas, Balneário Camboriú deixou de ser apenas
                  um destino de veraneio para se consolidar como um dos mercados
                  imobiliários mais valorizados do Brasil.
                </p>

                <p>
                  A combinação entre verticalização planejada, escassez de terrenos
                  próximos ao mar e investimentos contínuos em infraestrutura urbana
                  impulsionou o crescimento do metro quadrado de forma consistente.
                </p>

                <p>
                  O fortalecimento do turismo de alto padrão e a atração de
                  empreendimentos de luxo transformaram a cidade em um polo urbano
                  comparável a grandes referências internacionais, rendendo o título
                  de “Dubai Brasileira”.
                </p>
              </div>
            </div>

            {/* GRÁFICO */}
            <div className="w-full">
              <ValorizacaoChart />
            </div>

          </div>
        </div>
      </section>





      {/* SUSPENSE NO FOOTER */}
      <Suspense fallback={<div className="h-20 w-full" />}>
        <Footer />
      </Suspense>
      <FloatingContactWidget />
      
    </div>
  );
}
