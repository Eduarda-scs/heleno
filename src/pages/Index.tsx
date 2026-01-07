import React, { Suspense, lazy, useEffect, useRef, useState, memo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";


const FloatingContactWidget = lazy(() => import("@/components/whatsapp"));

// Lazy Components (carregam apenas quando precisam)
const Footer = lazy(() => import("@/components/Footer"));
const FeaturedProperties = lazy(() => import("./FeaturedProperties"));

// Ícones leves
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right";
import Award from "lucide-react/dist/esm/icons/award";
import Heart from "lucide-react/dist/esm/icons/heart";
import ShieldCheck from "lucide-react/dist/esm/icons/shield-check";
import Star from "lucide-react/dist/esm/icons/star";
import Sparkles from "lucide-react/dist/esm/icons/sparkles";


// Serviço
import { getPropertyFromWebhook } from "@/hooks/Admin/PropertyService";

// Swiper CSS global
import "swiper/css";

// Header fixo (evita CLS)
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

// Pure component para evitar re-renders
const CityFeature = memo(({ icon: Icon, title, description, delay }: any) => (
  <div
    className="text-center p-4 md:p-6 rounded-lg bg-gradient-to-br from-[#1b4c57] via-[#07262d] to-[#324d41] shadow-md font-bwmodelica"
    style={{
      opacity: 1,
      transition: `opacity 420ms ease ${delay}ms`,
    }}
  >
    <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-3 rounded-md bg-black/20 flex items-center justify-center">
      <Icon className="w-6 h-6 md:w-7 md:h-7 text-[#f6e9d2]" />
    </div>

    <h3 className="text-base md:text-lg font-semibold text-[#f6e9d2]">{title}</h3>
    <p className="text-sm md:text-base text-[#e3dfda]">{description}</p>
  </div>
));

const Index: React.FC = () => {
  const [isPropertiesLoading, setIsPropertiesLoading] = useState(false);
  const [shouldLoadFeatured, setShouldLoadFeatured] = useState(false);

  const featuredRef = useRef<HTMLDivElement | null>(null);
  const hasLoadedPropertiesRef = useRef(false);

  // Lazy load da seção FeaturedProperties
  useEffect(() => {
    if (!featuredRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoadFeatured(true);

          if (!hasLoadedPropertiesRef.current) {
            loadProperties();
            hasLoadedPropertiesRef.current = true;
          }

          observer.disconnect();
        }
      },
      { rootMargin: "200px", threshold: 0.1 }
    );

    observer.observe(featuredRef.current);
    return () => observer.disconnect();
  }, []);

  const loadProperties = async () => {
    if (isPropertiesLoading) return;

    setIsPropertiesLoading(true);
    try {
      await getPropertyFromWebhook();
    } catch (error) {
      console.error("Erro ao carregar propriedades:", error);
    }
    setIsPropertiesLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-[#f4f4f4]">
      {/* BACKGROUND – removido mármore verde */}
      <div aria-hidden className="fixed inset-0 bg-white -z-10" />

      {/* HEADER */}
      <Header />

      {/* HERO */}
      <section className="relative h-[85vh] md:h-screen min-h-[600px] w-full flex items-center justify-center overflow-hidden">

        <picture>
          <source media="(max-width: 768px)" srcSet="/hero-opt.webp" />
          <source media="(min-width: 769px)" srcSet="/opt-hero-home.webp" />
          <img
            src="/opt-hero-home.webp"
            loading="eager"
            decoding="async"
            alt="Vista aérea de Balneário Camboriú"
            className="w-full h-full object-cover"
          />
        </picture>

        <div className="absolute inset-0 bg-gradient-to-b from-[#07262dcc] via-[#07262d55] to-[#07262dcc]" />

       
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

          {/* features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
            {cityFeatures.map((f, i) => (
              <CityFeature key={i} icon={f.icon} title={f.title} description={f.description} delay={i * 80} />
            ))}
          </div>

          {/* imagem */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <img
              src="/opt-city-aerial.webp"
              loading="lazy"
              alt="Vista aérea da cidade"
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
      
        
      <Suspense >
        <FeaturedProperties />
      </Suspense>
        
      

      {/* SOBRE */}
      <section className="py-16 bg-[#f9f5f3]">
        <div className="container mx-auto px-4 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4 font-bwmodelica">
              <Award className="w-7 h-7 text-[#d2ab80]" />
              <span className="text-sm font-semibold text-[#d2ab80] uppercase tracking-wider">Excelência Imobiliária</span>
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
                loading="lazy"
                alt="Imóvel de luxo"
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
      <Suspense fallback={<div className="h-28 w-full bg-[#07262d]" />}>
        <FloatingContactWidget />
      </Suspense>
    </div>
  );
};

export default Index;
