import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect, Suspense, lazy } from "react";

// LAZY LOAD PARA REDUZIR A CADEIA CRÍTICA
const Header = lazy(() => import("@/components/Header"));
const Footer = lazy(() => import("@/components/Footer"));
const WhatsAppButton = lazy(() => import("@/components/whatsapp"));

// IMPORTAÇÃO SUPER LEVE DOS ÍCONES DO LUCIDE (SEM TRAZER A LIB INTEIRA)
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right";
import Building2 from "lucide-react/dist/esm/icons/building-2";
import Heart from "lucide-react/dist/esm/icons/heart";
import ShieldCheck from "lucide-react/dist/esm/icons/shield-check";
import Sparkles from "lucide-react/dist/esm/icons/sparkles";
import TrendingUp from "lucide-react/dist/esm/icons/trending-up";
import Users from "lucide-react/dist/esm/icons/users";
import Waves from "lucide-react/dist/esm/icons/waves";
import LeadModal from "@/components/leadscap";


// Imagens
import passarela from "@/assets/opt-passarela.webp";
import imagem2 from "@/assets/opt-image2.webp";
import imagem1 from "@/assets/opt-image1.webp";

const imagens = [passarela, imagem2, imagem1];

export default function City() {
  const [atual, setAtual] = useState(0);

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
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(/opt-balneario.webp)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/80" />

        <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bwmodelicaLightItalic mb-6 animate-fade-up"
            style={{ color: "#d2ab80" }}
          >
            Balneário Camboriú
          </h1>
          <p className="text-lg md:text-2xl lg:text-3xl max-w-3xl mx-auto animate-fade-up text-primary-foreground/90">
            A cidade que une modernidade, praia, gastronomia e qualidade de vida.
          </p>
        </div>
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

      {/* INVESTIMENTO */}
      <section className="py-14 md:py-24 bg-luxury-bg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-center mb-4">
            Por que <span className="text-secondary">investir</span> em BC?
          </h2>

          <p className="text-center text-muted-foreground mb-10 sm:mb-14 max-w-xl mx-auto text-sm sm:text-base">
            Descubra os motivos que fazem de Balneário Camboriú o destino ideal para seu investimento
          </p>

          <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
            {investmentReasons.map((reason, i) => {
              const Icon = reason.icon;
              return (
                <div
                  key={i}
                  className="
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
                  "
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

      {/* CARROSSEL + TEXTO */}
      <section className="py-16 md:py-24 bg-luxury-bg">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          {/* CARROSSEL AUTOMÁTICO */}
          <div className="rounded-2xl overflow-hidden shadow-[var(--shadow-medium)] hover:shadow-[var(--shadow-gold)] transition-shadow duration-300">
            <img
              src={imagens[atual]}
              className="w-full h-[300px] md:h-[450px] lg:h-[600px] object-cover transition-transform duration-700"
              alt="Lifestyle"
            />
          </div>

          {/* TEXTO */}
          <div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bwmodelica mb-6">
              Lifestyle <span className="text-secondary">Premium</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              Balneário Camboriú combina natureza, luxo, gastronomia e lazer
              para oferecer um estilo de vida incomparável.
            </p>

            <ul className="space-y-5 mb-10">
              {[
                "Praias de águas cristalinas",
                "Restaurantes renomados",
                "Vida noturna sofisticada",
                "Eventos culturais e esportivos",
                "Shopping centers de luxo",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-secondary" />
                  </div>
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>

            <Button variant="hero" size="lg" asChild>
              <Link to="/empreendimentos">
                Encontre Seu Imóvel <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* SUSPENSE NO FOOTER */}
      <Suspense fallback={<div className="h-20 w-full" />}>
        <Footer />
      </Suspense>
      <LeadModal />
      <Suspense fallback={<div className="h-28 w-full bg-[#07262d]" />}>
        <WhatsAppButton />
      </Suspense>
    </div>
  );
}
