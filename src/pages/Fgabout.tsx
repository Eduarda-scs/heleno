// src/pages/Fgabout.tsx

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import {
  Award,
  Building2,
  Diamond,
  Flag,
  Library,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import LeadModal from "@/components/leadscap";


const Header = lazy(() => import("@/components/Header"));
const Footer =  lazy(() => import("@/components/Footer"));
const WhatsAppButton = lazy(() => import("@/components/whatsapp"));


import { getEmpresasHeleno } from "@/components/supabaseActions";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface Empresa {
  id: number;
  nome: string;
  describ: string;
  pdf: string;
  foto: string;
  carrossel: number;
}

export default function AboutFG() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  // openCard: id do card aberto no mobile, null se nenhum
  const [openCard, setOpenCard] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getEmpresasHeleno();
      setEmpresas(data ?? []);
    }
    load();
  }, []);

  // toggle apenas em mobile (max-width: 768px)
  function toggleOpen(cardId: number) {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 768px)").matches) {
      setOpenCard((prev) => (prev === cardId ? null : cardId));
    }
  }

  // Estatísticas da FG
  const fgStats = [
    { icon: Building2, label: "Empreendimentos Entregues", value: "63+" },
    { icon: Award, label: "Anos de História", value: "20+" },
    { icon: Flag, label: "Investimentos Planejados", value: "R$ 750 mi+" },
    { icon: TrendingUp, label: "Crescimento", value: "Histórico" },
  ];

  // Pilares
  const pillars = [
    {
      icon: ShieldCheck,
      title: "Excelência Construtiva",
      description:
        "Projetos com materiais premium, engenharia sofisticada e atenção aos detalhes.",
    },
    {
      icon: Diamond,
      title: "Sofisticação & Luxo",
      description:
        "Empreendimentos de alto padrão focados em exclusividade e experiências superiores.",
    },
    {
      icon: Sparkles,
      title: "Inovação",
      description:
        "Tecnologia, automação e sustentabilidade em cada projeto.",
    },
    {
      icon: Library,
      title: "Tradição & Credibilidade",
      description:
        "Mais de 40 anos de legado e reputação consolidada no mercado.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
       <Suspense fallback={<div className="h-16 w-full"></div>}>
          <Header />
        </Suspense>
      

      {/* HERO SECTION COM MESMO TAMANHO DO INDEX.TSX */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-top"
          style={{ backgroundImage: `url(/opt-fgempreende.webp)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/80" />
      </section>

      {/* Estatísticas */}
      <section className="py-10 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {fgStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Icon className="w-8 h-8 mx-auto mb-2 text-secondary" />
                <div className="text-xl font-bwmodelica">{stat.value}</div>
                <div className="text-sm text-primary-foreground/80">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SOBRE */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-bwmodelica mb-4">
              Um marco na construção de Balneário Camboriú
            </h2>

            <p className="text-muted-foreground mb-4 text-lg">
              Com mais de 40 anos de atuação, a FG é uma das principais incorporadoras de alto padrão do Brasil.
            </p>

            <p className="text-muted-foreground mb-4 text-lg">
              Em 2021 completou 20 anos como uma gigante em inovação e arquitetura.
            </p>

            <p className="text-muted-foreground mb-6 text-lg">
              Anunciou investimentos superiores a R$ 750 milhões para expansão em BC.
            </p>

            <Button variant="gold" size="lg" asChild>
              <Link to="/empreendimentos">Ver Portfólio</Link>
            </Button>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-xl animate-fade-up">
            <img src="/opt-fg_time.webp" className="w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Pilares */}
      <section className="py-20 bg-luxury-bg">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bwmodelica">Pilares da FG</h2>
            <p className="text-muted-foreground mt-2 text-lg">
              Valores que definem a empresa
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={i}
                  className="
                    group p-6 rounded-xl 
                    bg-[#7e8aa6]/20 backdrop-blur-sm 
                    border border-[#d6b25e]/40
                    shadow-lg shadow-[#d6b25e33]
                    hover:shadow-xl hover:shadow-[#d6b25e77]
                    transition-all duration-300
                    hover:-translate-y-2
                    animate-fade-up
                  "
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="
                        w-12 h-12 rounded-full 
                        bg-[#d6b25e]/15
                        flex items-center justify-center 
                        group-hover:bg-[#d6b25e]/25 
                        transition-all
                      "
                    >
                      <Icon className="w-6 h-6 text-[#d6b25e]" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-1 text-black">
                        {pillar.title}
                      </h3>
                      <p className="text-black/80">{pillar.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* pdfs*/}

      <section>
        <style>{`
          .card-wrapper {
            position: relative;
            overflow: hidden;
            border-radius: 16px;
            height: 330px;
            cursor: pointer;
          }

          .card-thumb {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center;
            transition: transform .5s ease;
            z-index: 1;
            border-radius: 16px;
          }

          .card-title-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 12px 16px;
            background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
            color: white;
            font-size: 1.1rem;
            font-weight: 600;
            z-index: 3;
            transition: opacity .35s ease;
            pointer-events: none;
          }

          /* Desktop: título some no hover */
          .card-wrapper:hover .card-title-overlay {
            opacity: 0;
          }

          /* Mobile: some quando card abre */
          .card-wrapper.open .card-title-overlay {
            opacity: 0 !important;
          }

          .card-infos {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 330px;
            background: white;
            border-radius: 16px;
            padding: 20px 24px;
            transform: translateY(100%);
            transition: transform .45s ease-in-out;
            z-index: 2;
          }

          .fade-item {
            opacity: 0;
            transition: opacity .35s ease .2s;
          }

          .card-wrapper:hover .fade-item {
            opacity: 1;
          }

          /* ---- DESKTOP: subir card no hover ---- */
          @media (min-width: 769px) {
            .card-wrapper:hover .card-infos {
              transform: translateY(0);
            }
          }

          /* ---- MOBILE ---- */
          @media (max-width: 768px) {
            .card-wrapper.open .card-infos {
              transform: translateY(0) !important;
            }
            .card-wrapper.open .fade-item {
              opacity: 1 !important;
            }
            .card-wrapper {
              overflow: visible;
            }
            .card-thumb {
              overflow: hidden;
              border-radius: 16px;
            }
          }
        `}</style>

        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bwmodelica text-center mb-8">
            Confira os melhores empreendimentos FG
          </h2>

          <Swiper
            slidesPerView={1.1}
            spaceBetween={20}
            breakpoints={{
              768: { slidesPerView: 2.2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-10"
          >
            {empresas
              ?.filter((empresa) => empresa.carrossel === 1)
              .map((empresa) => {
                const isOpen = openCard === empresa.id;
                return (
                  <SwiperSlide key={empresa.id}>
                    <div
                      onClick={() => toggleOpen(empresa.id)}
                      className={`card-wrapper border border-black/20 shadow-[8px_12px_25px_#a17646aa] bg-black ${isOpen ? "open" : ""}`}
                      aria-expanded={isOpen ? "true" : "false"}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          toggleOpen(empresa.id);
                        }
                      }}
                    >
                      {/* IMG */}
                      <div
                        className="card-thumb"
                        style={{
                          backgroundImage: empresa.foto ? `url(${empresa.foto})` : undefined,
                        }}
                        aria-hidden
                      />

                      {/* TÍTULO */}
                      <div className="card-title-overlay">
                        {empresa.nome || "Nome indisponível"}
                      </div>

                      {/* INFORMAÇÕES */}
                      <div className="card-infos">
                        <p className="text-gray-700 uppercase fade-item">
                          Parceiro oficial
                        </p>

                        <h3 className="text-2xl font-bwmodelica text-black mt-2 fade-item">
                          {empresa.nome}
                        </h3>

                        <p className="text-gray-600 mt-3 fade-item">
                          {empresa.describ || "Sem descrição cadastrada."}
                        </p>

                        <div className="flex gap-3 mt-6 fade-item">
                          

                          <a
                            href="/empreendimentos"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="bg-[#1b4c57] hover:bg-[#14373f] rounded-full px-4 py-2 text-sm text-white"
                            >
                              Ver mais
                            </button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </div>
      </section>



      {/* Inovação */}
      <section className="py-20 bg-luxury-bg">
        <div className="container mx-auto px-4 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h4 className="text-3xl md:text-5xl font-bwmodelica mb-4">
              FG Empreendimentos: <span className="text-secondary">Líder no Brasil</span>
            </h4>

            <p className="text-muted-foreground text-lg mb-4">
              A FG Empreendimentos consolida-se não apenas como uma construtora, mas como uma potência em Pesquisa,
              Desenvolvimento e Inovação (PD&I) no cenário nacional. Com atuação estratégica em Balneário Camboriú,
              a empresa transformou o desafio de construir alto e com excelência em sua missão central.
            </p>

            <p className="text-muted-foreground text-lg mb-4">
              Seu protagonismo nasce de um investimento contínuo em PD&I, aliado a uma visão global que importa e
              exporta tecnologias de ponta para o mercado brasileiro.
            </p>

            <h3 className="font-semibold text-xl mt-6 mb-2 text-black">
              A Cultura da Inovação como Alicerce
            </h3>

            <p className="text-muted-foreground text-lg mb-4">
              O diferencial competitivo da FG vem de seu capital humano — engenheiros e arquitetos movidos pela
              paixão à inovação, responsáveis por incubar soluções que antecipam o futuro.
            </p>

            <ul className="list-disc pl-6 text-muted-foreground text-lg mb-4">
              <li>
                <strong>Sistemas Construtivos Inovadores:</strong> Construção modular e pré-fabricados de alta precisão,
                acelerando prazos e elevando a segurança.
              </li>
              <li>
                <strong>Materiais Vanguardistas:</strong> Concreto UHPC, compósitos sustentáveis e revestimentos
                autolimpantes de alta durabilidade.
              </li>
              <li>
                <strong>Tecnologias Disruptivas:</strong> BIM avançado, Inteligência Artificial para otimização de
                projetos e impressão 3D para componentes complexos.
              </li>
            </ul>

            <h3 className="font-semibold text-xl mt-6 mb-2 text-black">
              Mais do que Edifícios Altos: Um Legado de Engenharia e Rentabilidade
            </h3>

            <p className="text-muted-foreground text-lg mb-4">
              As inovações da FG têm um propósito claro: elevar desempenho, qualidade e valor. O resultado são obras
              mais ágeis, duráveis e com maior rentabilidade para clientes e investidores.
            </p>

            <ul className="list-disc pl-6 text-muted-foreground text-lg mb-6">
              <li><strong>Eficiência e Agilidade:</strong> Redução significativa do prazo de obra.</li>
              <li><strong>Qualidade e Durabilidade:</strong> Estruturas com vida útil superior.</li>
              <li><strong>Satisfação do Cliente:</strong> Entregas que superam expectativas tecnológicas e estéticas.</li>
            </ul>

            <h3 className="font-semibold text-xl mt-6 mb-2 text-black">
              Um Chamado para Co-criar o Futuro
            </h3>

            <p className="text-muted-foreground text-lg mb-6">
              A FG acredita que a inovação nasce da colaboração. Por isso, está abrindo um espaço para que startups,
              universidades e profissionais visionários possam co-criar soluções para o setor da construção civil.
            </p>

            <p className="text-muted-foreground text-lg mb-6">
              Junte-se à FG Empreendimentos. Mais do que construir edifícios, estamos construindo o futuro da engenharia.
            </p>

            <Button variant="hero" size="lg" asChild>
              <Link to="/empreendimentos">Ver Empreendimentos</Link>
            </Button>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img src="/opt-fg-innovation.webp" className="w-full object-cover" />
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="h-32 w-full"></div>}>
          <Footer />
        </Suspense>
      <LeadModal />
        <Suspense fallback={<div className="h-28 w-full bg-[#07262d]" />}>
          <WhatsAppButton />
        </Suspense>
    </div>
  );
}
