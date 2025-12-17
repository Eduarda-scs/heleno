import { useEffect, useState, lazy, Suspense } from "react";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { getPropertyFromWebhook } from "@/hooks/Admin/ClientProperty";
import { generateSlug } from "@/utils/slug"

const Header = lazy(() => import("@/components/Header"));
const Footer = lazy(() => import("@/components/Footer"));
const WhatsAppButton = lazy(() => import("@/components/whatsapp"));
// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

// Interface para o ClientProperty
interface PropertyType {
  id: number;
  property_title: string;
  property_city: string;
  property_types: Array<{ property_type_name: string }>;
  images: Array<{ url: string }>;
  videos: Array<{ url: string }>;
  categories: Array<any>;
  amenities: Array<any>;
}

interface ClientPropertyData {
  categories: Array<any>;
  property_types: Array<{ id: number; property_type_name: string }>;
  properties: PropertyType[];
}

const Properties = () => {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobilePage, setMobilePage] = useState(1);
  const [allProperties, setAllProperties] = useState<PropertyType[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<Array<{ id: number; property_type_name: string }>>([]);
  const [isInitialized, setIsInitialized] = useState(false); // Novo estado para controle
  
  const itemsPerPageDesktop = 8;
  const itemsPerPageMobile = 4;

  // Função para carregar propriedades
  const loadProperties = async () => {
    try {
      const data = await getPropertyFromWebhook();
      
      // A estrutura retornada é um array, então precisamos extrair os dados do primeiro item
      if (Array.isArray(data) && data.length > 0) {
        const clientData = data[0]; // Pega o primeiro item do array
    
        setAllProperties(clientData.properties || []);
        setPropertyTypes(clientData.property_types || []);
      } else {
        setAllProperties([]);
        setPropertyTypes([]);
      }
    } catch (error) {
      setAllProperties([]);
      setPropertyTypes([]);
    } finally {
      setIsInitialized(true); // Marca como inicializado após a tentativa
    }
  };

  // Buscar dados após a renderização completa
  useEffect(() => {
    // Aguarda um pequeno delay para garantir que a UI foi renderizada
    const timer = setTimeout(() => {
      if (!isInitialized) {
        loadProperties();
      }
    }, 100); // Delay de 100ms para garantir renderização completa

    return () => clearTimeout(timer);
  }, [isInitialized]);

  // Obter filtros dos property_types
  const filters = propertyTypes.length > 0
    ? ["Todos", ...propertyTypes.map(type => type.property_type_name)]
    : [];

  // Converter dados para o formato esperado pelo PropertyCard
  const parsedProperties = allProperties.map((property) => {
    const firstImage = property.images?.[0]?.url || "";
    const propertyTypes = property.property_types || [];
  
    const slug = generateSlug(property.property_title || "");
  
    return {
      id: property.id.toString(),
      slug, // 👈 AQUI
      title: property.property_title || "Sem título",
      location: property.property_city || "Localização não informada",
      type: propertyTypes[0]?.property_type_name || "",
      image: firstImage,
      videos: property.videos || [],
      categories: propertyTypes.map(type => type.property_type_name) || [],
      propertyData: { properties: allProperties, property_types: propertyTypes }
    };
  });
  

  const filteredProperties = activeFilter === "Todos"
    ? parsedProperties
    : parsedProperties.filter((property) => {
        // Verifica se alguma categoria do imóvel corresponde ao filtro ativo
        const matches = property.categories.some(category => 
          category.toLowerCase() === activeFilter.toLowerCase()
        );
        
        return matches;
      });

  // Lógica para desktop - paginação
  const totalPagesDesktop = Math.ceil(filteredProperties.length / itemsPerPageDesktop);
  const startIndexDesktop = (currentPage - 1) * itemsPerPageDesktop;
  const endIndexDesktop = startIndexDesktop + itemsPerPageDesktop;
  const propertiesDesktop = filteredProperties.slice(startIndexDesktop, endIndexDesktop);

  const goToNextPage = () => {
    if (currentPage < totalPagesDesktop) {
      setCurrentPage(currentPage + 1);
    }
  };

  

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Lógica para mobile - carrossel com blocos de 4
  const chunk = (arr: any[], size: number) => {
    return arr.reduce((acc, _, i) => {
      if (i % size === 0) acc.push(arr.slice(i, i + size));
      return acc;
    }, []);
  };

  const mobileChunks = chunk(filteredProperties, itemsPerPageMobile);
  const currentMobileChunk = mobileChunks[mobilePage - 1] || [];

  const goToNextMobilePage = () => {
    if (mobilePage < mobileChunks.length) {
      setMobilePage(mobilePage + 1);
    }
  };

  const goToPrevMobilePage = () => {
    if (mobilePage > 1) {
      setMobilePage(mobilePage - 1);
    }
  };

  // Reset paginação quando mudar filtro
  useEffect(() => {
    setCurrentPage(1);
    setMobilePage(1);
  }, [activeFilter]);

  // Mostrar loading enquanto não inicializado
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background">
        <Suspense fallback={<div className="h-20 bg-background" />}>
          <Header />
        </Suspense>

        {/* HERO - Versão simplificada para loading */}
        <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url("/opt-empreendimentos.webp")` }}
          />
          <div className="absolute inset-0 bg-primary/70" />

          <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
            <h1 className="text-3xl md:text-6xl font-bwmodelicaLightItalic mb-4 md:mb-6">
              Nossos <span className="text-secondary">Empreendimentos</span>
            </h1>

            <p className="text-base md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto font-bwmodelica">
              Encontre o imóvel perfeito para você em Balneário Camboriú
            </p>
          </div>
        </section>

      

        {/* CONTEÚDO LOADING */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"></div>
              <p className="text-xl text-muted-foreground">
                Carregando empreendimentos...
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Aguarde enquanto buscamos os melhores imóveis para você
              </p>
            </div>
          </div>
        </section>

        <Suspense fallback={<div className="h-20 bg-background" />}>
          <Footer />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="h-20 bg-background" />}>
        <Header />
      </Suspense>

      {/* HERO */}
      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
        <div class="absolute inset-0">
          <img
            src="/opt-empreendimentos.webp"
            alt="Banner Opt Empreendimentos"
            fetchpriority="high"
            decoding="async"
            class="w-full h-full object-cover"
          />
        </div>


        <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground animate-fade-up">
          <h1 className="
            text-3xl
            md:text-6xl
            font-bwmodelicaLightItalic 
            mb-4 md:mb-6
          ">
            Nossos <span className="text-secondary">Empreendimentos</span>
          </h1>

          <p className="
            text-base
            md:text-2xl
            text-primary-foreground/90
            max-w-3xl mx-auto
            font-bwmodelica
          ">
            Encontre o imóvel perfeito para você em Balneário Camboriú
          </p>
          
          {/* Contador de propriedades */}
          <div className="mt-6 text-sm md:text-base text-primary-foreground/80">
            {allProperties.length > 0 ? (
              <span>
                Mostrando <span className="text-secondary font-semibold">{filteredProperties.length}</span> de <span className="text-secondary font-semibold">{allProperties.length}</span> empreendimentos
              </span>
            ) : (
              <span>Nenhum empreendimento disponível no momento</span>
            )}
          </div>
        </div>

      </section>

      {/* FILTROS */}
      <section className="py-8 bg-luxury-bg border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center font-bwmodelica">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "gold" : "outline"}
                onClick={() => setActiveFilter(filter)}
                className="transition-all duration-300"
              >
                {filter}
              </Button>
            ))}
          </div>
          
          {/* Feedback do filtro ativo */}
          {activeFilter !== "Todos" && filteredProperties.length > 0 && (
            <div className="text-center mt-4 text-sm text-muted-foreground">
              Mostrando {filteredProperties.length} empreendimento(s) na categoria "{activeFilter}"
            </div>
          )}
        </div>
      </section>

      {/* DESKTOP - PAGINAÇÃO */}
      <section className="py-16 bg-background hidden md:block">
        <div className="container mx-auto px-4 lg:px-8">
          {allProperties.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">
                Nenhum empreendimento disponível no momento.
              </p>
              <p className="text-sm text-muted-foreground">
                Novos empreendimentos serão adicionados em breve.
              </p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">
                Nenhum empreendimento encontrado com este filtro.
              </p>
              <Button
                variant="outline"
                onClick={() => setActiveFilter("Todos")}
                className="mt-4"
              >
                Ver Todos os Empreendimentos
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {propertiesDesktop.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    {...property}
                  />
                ))}
              </div>

              {/* PAGINAÇÃO DESKTOP */}
              {filteredProperties.length > 0 && totalPagesDesktop > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <Button
                    variant="outline"
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2"
                  >
                    <span>←</span>
                    Anterior
                  </Button>

                  <span className="text-sm text-muted-foreground">
                    Página {currentPage} de {totalPagesDesktop}
                    <span className="ml-2 text-xs">
                      ({filteredProperties.length} itens)
                    </span>
                  </span>

                  <Button
                    variant="outline"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPagesDesktop}
                    className="flex items-center gap-2"
                  >
                    Próxima
                    <span>→</span>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* MOBILE - CARROSSEL */}
      <section className="py-16 bg-background md:hidden">
        <div className="container mx-auto px-4">
          {allProperties.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">
                Nenhum empreendimento disponível no momento.
              </p>
              <p className="text-sm text-muted-foreground">
                Novos empreendimentos serão adicionados em breve.
              </p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">
                Nenhum empreendimento encontrado com este filtro.
              </p>
              <Button
                variant="outline"
                onClick={() => setActiveFilter("Todos")}
                className="mt-4"
              >
                Ver Todos os Empreendimentos
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center text-sm text-muted-foreground">
                Deslize para ver mais empreendimentos
              </div>
              
              <Swiper
                slidesPerView={1.1}
                spaceBetween={16}
                className="pb-10"
                navigation={false}
                pagination={{
                  clickable: true,
                }}
              >
                {filteredProperties.map((property) => (
                  <SwiperSlide key={property.id}>
                    <PropertyCard 
                      {...property}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Contador mobile */}
              <div className="text-center text-sm text-muted-foreground mt-4">
                Mostrando {filteredProperties.length} de {allProperties.length} empreendimentos
              </div>
            </>
          )}
        </div>
      </section>

      <Suspense fallback={<div className="h-20 bg-background" />}>
        <Footer />
      </Suspense>
      <Suspense fallback={<div className="h-28 w-full bg-[#07262d]" />}>
        <WhatsAppButton />
      </Suspense>
    </div>
  );
};

export default Properties;