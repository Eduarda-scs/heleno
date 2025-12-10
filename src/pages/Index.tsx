import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Lazy components
const Footer = lazy(() => import("@/components/Footer"));
const FeaturedProperties = lazy(() => import("./FeaturedProperties"));

// Ícones individuais (mais leve)
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right";
import Award from "lucide-react/dist/esm/icons/award";
import Heart from "lucide-react/dist/esm/icons/heart";
import ShieldCheck from "lucide-react/dist/esm/icons/shield-check";
import Star from "lucide-react/dist/esm/icons/star";
import Sparkles from "lucide-react/dist/esm/icons/sparkles";

// Serviços
import { getPropertyFromWebhook } from "@/hooks/Admin/PropertyService";

// Swiper global
import "swiper/css";

// Header carregado sincronamente (evita CLS)
import Header from "@/components/Header";

const cityFeatures = [
  {
    icon: Heart,
    title: "Qualidade de Vida",
    description: "Infraestrutura completa e lazer premium",
  },
  {
    icon: Star,
    title: "Gastronomia",
    description: "Restaurantes renomados e experiências únicas",
  },
  {
    icon: Sparkles,
    title: "Vida Noturna",
    description: "Entretenimento sofisticado e diversificado",
  },
  {
    icon: ShieldCheck,
    title: "Segurança",
    description: "Cidade segura e bem estruturada",
  },
];

const Index: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [isPropertiesLoading, setIsPropertiesLoading] = useState(false);
  const [shouldLoadFeatured, setShouldLoadFeatured] = useState(false);

  const featuredRef = useRef<HTMLDivElement | null>(null);
  const hasLoadedPropertiesRef = useRef(false);

  // Ativa animações leves sem impactar LCP
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 900);
    return () => clearTimeout(t);
  }, []);

  // Carregamento de FeaturedProperties só quando aparecer na tela
  useEffect(() => {
    if (!featuredRef.current) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setShouldLoadFeatured(true);

          if (!hasLoadedPropertiesRef.current) {
            loadProperties();
            hasLoadedPropertiesRef.current = true;
          }

          obs.disconnect();
        }
      },
      { root: null, rootMargin: "180px", threshold: 0.15 }
    );

    obs.observe(featuredRef.current);

    return () => obs.disconnect();
  }, []);

  const loadProperties = async () => {
    if (isPropertiesLoading) return;
    setIsPropertiesLoading(true);

    try {
      console.log("Carregando propriedades...");
      await getPropertyFromWebhook();
    } catch (error) {
      console.error("Erro ao carregar propriedades:", error);
    } finally {
      setIsPropertiesLoading(false);
    }
  };

  return (
    <div className="marmore-verde relative">

      {/* BACKGROUND GLOBAL */}
      <div
        aria-hidden
        className="fixed inset-0 bg-gradient-to-br from-[#9e77ab] via-[#d2ab80] to-[#07262d] opacity-25 -z-10"
      />

      {/* HEADER */}
      <Header />

      {/* HERO */}
      <section
        className="relative h-[85vh] min-h-[620px] w-full flex items-center justify-center overflow-hidden"
        aria-label="Banner principal"
      >
        <picture>
          <source media="(max-width: 768px)" srcSet="/heleno-hero2.webp" />
          <source media="(min-width: 769px)" srcSet="/opt-hero-balneario.webp" />

          <img
            src="/opt-hero-balneario.webp"
            alt="Vista aérea de Balneário Camboriú"
            width="1920"
            height="1080"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            class="w-full h-auto object-cover block"
          />

        </picture>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07262dcc] via-[#07262d55] to-[#07262dcc]" />

        {/* Scroll indicator */}
        <div className="absolute bottom-6 flex justify-center w-full">
          <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center opacity-90">
            <div className="w-1 h-3 bg-white/80 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* POR QUE BC */}
      <section className="py-16 bg-[#f9f5f3]">
        <div className="container mx-auto px-4 lg:px-8">

          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#07262d] font-bwmodelica">
              Por que <span className="text-[#9e77ab]">Balneário Camboriú</span> é única?
            </h2>
            <p className="text-base text-[#3b4548] max-w-xl mx-auto font-bwmodelica">
              A cidade que combina beleza natural com infraestrutura de primeiro mundo.
            </p>
          </div>

          {/* FEATURES */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8 font-bwmodelica">
            {cityFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="text-center p-4 md:p-6 rounded-lg bg-gradient-to-br from-[#1b4c57] via-[#07262d] to-[#324d41] shadow-md"
                  style={{
                    opacity: mounted ? 1 : 0,
                    transition: `opacity 420ms ease ${idx * 80}ms`,
                    transform: mounted ? "translateY(0)" : "translateY(8px)",
                  }}
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-3 rounded-md bg-black/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-[#f6e9d2]" />
                  </div>

                  <h3 className="text-base md:text-lg font-semibold text-[#f6e9d2]">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base text-[#e3dfda]">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* IMAGEM */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <img
              src="/opt-city-aerial-.webp"
              srcSet="
                /opt-city-aerial.webp 480w,
                /opt-city-aerial.webp 768w,
                /opt-city-aerial.webp 1280w
              "
              sizes="100vw"
              alt="Vista aérea da cidade"
              fetchPriority="high"
              loading="lazy"
              className="w-full h-[280px] md:h-[400px] object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#07262dcc] to-transparent flex items-end">
              <div className="p-6 md:p-8 text-[#f6e9d2]">
                <h3 className="text-2xl md:text-3xl font-bold">A Dubai Brasileira</h3>
                <p className="text-base md:text-lg mb-3">Modernidade, luxo e qualidade de vida</p>

                <Button variant="gold" asChild className="bg-[#d2ab80] hover:bg-[#a17646]">
                  <Link to="/cidade">
                    Conheça Mais <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <div ref={featuredRef} className="py-8 bg-white">

        {isPropertiesLoading && (
          <div className="py-12 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#d2ab80] border-t-transparent mx-auto mb-4" />
            <p className="text-[#07262d] font-bwmodelica">
              Carregando empreendimentos em destaque...
            </p>
          </div>
        )}

        {shouldLoadFeatured && (
          <Suspense
            fallback={
              <div className="py-12 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#07262d] border-t-transparent mx-auto mb-4" />
                <p className="text-[#07262d] font-bwmodelica">Preparando empreendimentos...</p>
              </div>
            }
          >
            <FeaturedProperties />
          </Suspense>
        )}

      </div>

      {/* SOBRE */}
      <section className="py-16 bg-[#f9f5f3]">
        <div className="container mx-auto px-4 lg:px-8 grid md:grid-cols-2 gap-12 items-center">

          <div>
            <div className="flex items-center gap-2 mb-4 font-bwmodelica">
              <Award className="w-7 h-7 text-[#d2ab80]" />
              <span className="text-sm font-semibold text-[#d2ab80] uppercase tracking-wider">
                Excelência Imobiliária
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-[#07262d] mb-4 font-bwmodelica">
              Seu Parceiro de <span className="text-[#9e77ab]">Confiança</span>
            </h2>

            <p className="text-base text-[#3b4548] mb-6 leading-relaxed font-bwmodelica">
              Com anos de experiência no mercado imobiliário de Balneário Camboriú, oferecemos atendimento
              personalizado e soluções exclusivas.
            </p>

            <Button variant="gold" size="lg" className="bg-[#d2ab80] hover:bg-[#a17646]" asChild>
              <Link to="/sobre">
                Conheça Nossa História <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src="/opt-property-luxury.webp"
                srcSet="
                  /opt-property-luxury.webp 480w,
                  /opt-property-luxury.webp 768w,
                  /opt-property-luxury.webp 1200w
                "
                sizes="(max-width: 1024px) 100vw, 50vw"
                alt="Imóvel de luxo"
                loading="lazy"
                fetchPriority="high"
                className="w-full h-[300px] md:h-[420px] object-cover"
              />
            </div>

            <div className="absolute -bottom-6 -right-6 w-36 h-36 bg-[#9e77ab33] rounded-2xl -z-10" />
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <Suspense fallback={<div className="h-28 w-full bg-[#07262d]" />}>
        <Footer />
      </Suspense>

      {/* REDUÇÃO DE ANIMAÇÃO PARA MELHORAR TBT */}
      <style>
        {`
          @media (prefers-reduced-motion: reduce) {
            .animate-pulse, .animate-spin {
              animation: none !important;
            }
          }
          .animate-pulse { animation: pulse 2.5s infinite; }
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
        `}
      </style>

    </div>
  );
};

export default Index;
