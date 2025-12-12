import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  Briefcase,
  MapPin,
  Users,
} from "lucide-react";
import { lazy, Suspense } from "react";

const WhatsAppButton = lazy(() => import("@/components/whatsapp"));
const Header = lazy(() => import("@/components/Header"));
const Footer = lazy(() => import("@/components/Footer"));

const values = [
  {
    icon: Briefcase,
    title: "Excelência",
    description:
      "Atuação baseada em precisão estratégica e resultados consistentes no mercado de luxo.",
  },
  {
    icon: Award,
    title: "Autoridade",
    description:
      "Reconhecido como referência em imóveis de alto padrão no Ceará e em Santa Catarina.",
  },
  {
    icon: Users,
    title: "Atendimento",
    description:
      "Uma experiência personalizada, inteligente e pensada para cada perfil de cliente.",
  },
  {
    icon: MapPin,
    title: "Atuação Nacional",
    description:
      "Presença forte no Eusébio (CE) e em Balneário Camboriú (SC), com projetos exclusivos.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div>Carregando...</div>}>
        <Header />
      </Suspense>

      {/* HERO SECTION */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-top"
          style={{ backgroundImage: `url(/opt-heleno_sobre.webp)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/80" />

        <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bwmodelicaLightItalic mb-6 animate-fade-up"
            style={{ color: "#d2ab80" }}
          >
            Sobre <span className="text-secondary">Heleno Alves</span>
          </h1>
          <p className="text-lg md:text-2xl lg:text-3xl max-w-3xl mx-auto animate-fade-up text-primary-foreground/90">
            Um dos maiores nomes do mercado imobiliário de luxo no Brasil.
          </p>
        </div>
      </section>

      {/* BIOGRAFIA - texto esquerda / foto direita */}
      <section className="py-20 bg-luxury-bg">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-8 h-8 text-secondary" />
                <span className="text-sm font-semibold text-secondary uppercase tracking-wider">
                  Biografia
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bwmodelica text-foreground mb-6">
                Um especialista em <span className="text-secondary">alto padrão e luxo</span>
              </h2>

              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Heleno Alves é um corretor de imóveis renomado no município de Eusébio (CE) e em
                Balneário Camboriú (SC), referência absoluta no mercado de alto padrão e luxo.
                Com 29 anos de trajetória, ele construiu uma reputação marcada pela precisão
                estratégica, pela condução impecável de negociações complexas e pela capacidade de
                entregar resultados seguros, inteligentes e altamente rentáveis. Seu nome tornou-se
                sinônimo de confiança no setor imobiliário de luxo.
              </p>

              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Casado e pai de quatro filhos, Heleno carrega consigo valores sólidos que moldam sua
                vida e sua atuação profissional: ética, transparência e respeito. Esses pilares
                fortalecem sua credibilidade e sustentam sua forma singular de trabalhar, sempre com
                uma visão refinada, humana e estratégica.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Hoje, ampliando ainda mais sua atuação, Heleno também passa a integrar o seleto
                grupo de profissionais responsáveis pela comercialização do Senna Tower, o edifício
                residencial mais alto do mundo. Participar de um empreendimento dessa magnitude
                reforça seu posicionamento como um dos nomes mais fortes do setor e consolida seu
                papel entre os maiores especialistas em imóveis de altíssimo padrão no Brasil.
              </p>
            </div>

            <div className="relative animate-fade-up">
              <div className="rounded-2xl overflow-hidden shadow-[var(--shadow-medium)]">
                <img
                  src="/heleno_sobre2.webp"
                  alt="Heleno Alves"
                  className="w-full h-[1000px] object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-secondary/10 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* SOBRE O TRABALHO - AGORA foto esquerda / texto direita */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">

          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* FOTO — AGORA À ESQUERDA */}
            <div className="relative animate-fade-up order-1 md:order-1">
              <div className="rounded-2xl overflow-hidden shadow-[var(--shadow-medium)]">
                <picture>
                  <source
                    media="(max-width: 768px)"
                    srcSet="/heleno_sobre.webp"
                  />
                  <source
                    media="(min-width: 769px)"
                    srcSet="/heleno_sobre.webp"
                  />
                  <img
                    src="/heleno_sobre.webp"
                    alt="Carreira de Heleno Alves"
                    className="w-full h-[900px] object-cover"
                    loading="lazy"
                  />
                </picture>
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-secondary/10 rounded-2xl -z-10" />
            </div>

            {/* TEXTO — À DIREITA */}
            <div className="animate-fade-up order-2 md:order-2 text-left">
              <h2 className="text-4xl md:text-5xl font-bwmodelica text-foreground mb-4">
                O Trabalho de <span className="text-secondary">Heleno Alves</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Estratégia, excelência e visão de futuro.
              </p>

              <div className="space-y-10 text-lg text-muted-foreground mt-6">
                <p>
                  O trabalho de Heleno Alves é movido pela crença de que cada negociação merece
                  excelência absoluta. Seu atendimento une estratégia, sensibilidade e uma leitura
                  precisa do mercado, permitindo que cada cliente visualize não apenas um imóvel,
                  mas um patrimônio de valor crescente.  Seu olhar analítico, aliado à experiência 
                  de quase três décadas, faz com que Heleno identifique oportunidades exclusivas e 
                  conduza negociações de alto impacto com segurança, clareza e rentabilidade.
                </p>

                <p>
                  Sua atuação abrange desde a curadoria de empreendimentos seletos até a negociação
                  de propriedades que integram o topo do mercado nacional.A entrada de Heleno no 
                  processo de comercialização do Senna Tower, considerado o edifício residencial mais 
                  alto do mundo, evidencia seu nível de autoridade e reforça sua presença entre os 
                  profissionais mais preparados para lidar com imóveis de altíssimo valor. Ele entrega 
                  não apenas opções, mas estratégias completas para famílias e investidores que buscam 
                  precisão, visão de futuro e excelência.
                </p>

                <p>
                  Além disso, Heleno se consolidou como uma voz relevante nas redes sociais,
                  criando conteúdo que educa e aproxima,  e fortalecendo sua imagem como 
                  especialista em imóveis de luxo. Para compradores exigentes, investidores 
                  criteriosos e famílias que valorizam segurança e sofisticação, Heleno Alves 
                  representa o equilíbrio perfeito entre experiência, ética e resultados 
                  extraordinários.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className="py-20 bg-luxury-bg">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-bwmodelica text-foreground mb-4">
              Valores que Guiam a <span className="text-secondary">Sua Jornada</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Princípios essenciais que definem sua atuação.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 bg-card rounded-xl shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-gold)] transition-all duration-300 hover:-translate-y-2 animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bwmodelica text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bwmodelica mb-6">
            Quer conhecer mais sobre o trabalho de Heleno Alves?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Entre em contato e permita que nossa equipe prepare uma experiência personalizada.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gold" size="xl" asChild>
              <Link to="/contato">
                Falar com Heleno
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>

            <Button variant="hero" size="xl" asChild>
              <Link to="/empreendimentos">Ver Empreendimentos</Link>
            </Button>
          </div>
        </div>
      </section>

      <Suspense fallback={<div>Carregando...</div>}>
        <Footer />
      </Suspense>
      <Suspense fallback={<div className="h-28 w-full bg-[#07262d]" />}>
        <WhatsAppButton />
      </Suspense>
    </div>
  );
};

export default About;
