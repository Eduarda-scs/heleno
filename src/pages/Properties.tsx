import { useEffect, useState, lazy, Suspense } from "react";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { getPropertyFromWebhook } from "@/hooks/Admin/ClientProperty";
import { generateSlug } from "@/utils/slug";

const Header = lazy(() => import("@/components/Header"));
const Footer = lazy(() => import("@/components/Footer"));
const WhatsAppButton = lazy(() => import("@/components/whatsapp"));

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

interface PropertyType {
  id: number;
  property_title: string;
  property_city: string;
  property_price: string;
  property_bedrooms: string;
  property_bathrooms: string;
  property_garage_spaces: string;
  property_area_sqm: string;
  property_status: string;
  images: Array<{ url: string; is_cover: boolean; position: number }>;
  videos: Array<{ url: string }>;
  property_types: Array<{ property_type_name: string }>;
  amenities: Array<{ amenitie_name: string }>;
  categories: Array<{ category_name: string }>;
}

interface FilterType {
  id: number;
  name: string;
  type: string;
}

const Properties = () => {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  
  // ESTADOS ATUALIZADOS PARA PAGINAÇÃO REAL
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<Array<{ id: number; property_type_name: string }>>([]);
  
  // Estados para paginação
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loadingPage, setLoadingPage] = useState<number | null>(null);

  // Função para carregar propriedades com paginação real
  const loadProperties = async (page = 1, filter = activeFilter) => {
    try {
      setIsLoading(true);
      setLoadingPage(page);
      
      // Montar filtros para enviar ao backend
      const backendFilters = filter === "Todos" ? null : { 
        type: filter 
      };
      console.log("beckendfiltres" , backendFilters)

      const response = await getPropertyFromWebhook(page, backendFilters);
      
      if (response && response.data) {
        console.log(`✅ Página ${page} carregada:`, {
          total_items: response.total_items,
          total_pages: response.total_pages,
          properties_received: response.data.length,
          page_requested: page
        });
        
        // Atualiza os estados com a resposta do backend
        setProperties(response.data || []);
        setTotalPages(response.total_pages || 1);
        setTotalItems(response.total_items || 0);
        setCurrentPage(response.page || page);
        
        // Extrai filtros dos property_types
        if (response.property_types && response.property_types.length > 0) {
          setPropertyTypes(response.property_types);
        }
      } else {
        console.error("❌ Resposta inválida do backend:", response);
        setProperties([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("❌ Erro ao carregar propriedades:", error);
      setProperties([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
      setLoadingPage(null);
      if (!isInitialized) setIsInitialized(true);
    }
  };

  // Buscar dados após a renderização completa
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isInitialized) {
        loadProperties(1);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isInitialized]);

  // Quando mudar o filtro, recarrega a página 1
  useEffect(() => {
    if (isInitialized) {
      loadProperties(1, activeFilter);
    }
  }, [activeFilter]);

  const filteredProperties = properties.filter((property) => {
    if (activeFilter === "Todos") return true;

    // o status vem do property_types
    const type = property.property_types?.[0]?.property_type_name;

    return type === activeFilter;
  });


  // Converter dados para o formato esperado pelo PropertyCard
const parsedProperties = filteredProperties.map((property) => {
    // Encontra a imagem de capa (is_cover: true) ou usa a primeira imagem
    const coverImage = property.images?.find(img => img.is_cover)?.url || 
                      property.images?.[0]?.url || "";
    
    const propertyTypesArray = property.property_types || [];
    
    const slug = generateSlug(property.property_title || "");

    return {
      id: property.id.toString(),
      slug,
      title: property.property_title || "Sem título",
      location: property.property_city || "Localização não informada",
      price: property.property_price || "Consultar",
      bedrooms: property.property_bedrooms || "0",
      bathrooms: property.property_bathrooms || "0",
      garage: property.property_garage_spaces || "0",
      area: property.property_area_sqm || "0",
      type: propertyTypesArray[0]?.property_type_name || "",
      image: coverImage,
      videos: property.videos || [],
      categories: propertyTypesArray.map(type => type.property_type_name) || [],
      amenities: property.amenities?.map(a => a.amenitie_name) || [],
      property_categories: property.categories?.map(c => c.category_name) || [],
      propertyData: { 
        properties: properties, 
        property_types: propertyTypesArray 
      }
    };
  });
  console.log("🏠 propriedadades", parsedProperties)

  // Obter filtros dinamicamente dos property_types
  const filters = propertyTypes.length > 0
    ? ["Todos", ...propertyTypes.map(type => type.property_type_name)]
    : ["Todos"]; 
    console.log("🔍 filtro", filters)

  // Funções de navegação
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      loadProperties(currentPage + 1, activeFilter);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      loadProperties(currentPage - 1, activeFilter);
    }
  };

  // Função para ir para uma página específica
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      loadProperties(page, activeFilter);
    }
  };

  // Gerar array de páginas para exibição (máximo 5 páginas)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Mostrar todas as páginas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas próximas à atual
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);
      
      // Ajustar start se end estiver no limite
      if (end === totalPages) {
        start = totalPages - maxVisible + 1;
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  // Mostrar loading enquanto carrega
  if (isLoading && !isInitialized) {
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
        <div className="absolute inset-0">
          <img
            src="/opt-empreendimentos.webp"
            alt="Banner Opt Empreendimentos"
            fetchpriority="high"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground animate-fade-up">
          <h1 className="text-3xl md:text-6xl font-bwmodelicaLightItalic mb-4 md:mb-6">
            Nossos <span className="text-secondary">Empreendimentos</span>
          </h1>

          <p className="text-base md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto font-bwmodelica">
            Encontre o imóvel perfeito para você em Balneário Camboriú
          </p>
          
          {/* Contador de propriedades */}
          <div className="mt-6 text-sm md:text-base text-primary-foreground/80">
            {totalItems > 0 ? (
              <span>
                <span className="text-secondary font-semibold">{totalItems}</span> empreendimentos disponíveis
                <span className="mx-2">•</span>
                Página <span className="text-secondary font-semibold">{currentPage}</span> de <span className="text-secondary font-semibold">{totalPages}</span>
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
                disabled={isLoading}
              >
                {filter}
                {isLoading && activeFilter === filter && (
                  <span className="ml-2 animate-spin">⟳</span>
                )}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* DESKTOP - PAGINAÇÃO REAL */}
      <section className="py-16 bg-background hidden md:block">
        <div className="container mx-auto px-4 lg:px-8">
          {isLoading && loadingPage === currentPage ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"></div>
              <p className="text-xl text-muted-foreground">
                Carregando página {currentPage}...
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Aguarde enquanto buscamos os empreendimentos
              </p>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">
                {totalItems === 0 
                  ? "Nenhum empreendimento disponível no momento."
                  : "Nenhum empreendimento encontrado com este filtro."
                }
              </p>
              {activeFilter !== "Todos" && (
                <Button
                  variant="outline"
                  onClick={() => setActiveFilter("Todos")}
                  className="mt-4"
                >
                  Ver Todos os Empreendimentos
                </Button>
              )}
            </div>
          ) : (
            <>
              
              {/* GRID DE IMÓVEIS - EXATAMENTE 8 POR PÁGINA */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {parsedProperties.map((property, index) => (
                  <div 
                    key={`${property.id}-page-${currentPage}-${index}`}
                    className="animate-fade-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <PropertyCard {...property} />
                  </div>
                ))}
              </div>

              {/* PAGINAÇÃO REAL DESKTOP */}
              {totalPages > 1 && (
                <div className="flex flex-col items-center gap-6 mt-12 pt-8 border-t border-border">
                  
                  {/* Controles de paginação */}
                  <div className="flex items-center justify-center gap-2">
                    {/* Botão Anterior */}
                    <Button
                      variant="outline"
                      onClick={goToPrevPage}
                      disabled={currentPage === 1 || isLoading}
                      className="flex items-center gap-2 min-w-32"
                    >
                      <span>←</span>
                      Anterior
                    </Button>

                    {/* Números das páginas */}
                    <div className="flex items-center gap-1 mx-4">
                      {getPageNumbers().map((pageNum) => (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "gold" : "outline"}
                          onClick={() => goToPage(pageNum)}
                          disabled={isLoading}
                          className={`min-w-10 h-10 px-0 ${
                            currentPage === pageNum 
                              ? "font-bold shadow-md" 
                              : "hover:bg-accent"
                          }`}
                        >
                          {pageNum}
                        </Button>
                      ))}
                      
                      {/* Elipsis se houver muitas páginas */}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <span className="px-2 text-muted-foreground">...</span>
                          <Button
                            variant="outline"
                            onClick={() => goToPage(totalPages)}
                            disabled={isLoading}
                            className="min-w-10 h-10 px-0"
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Botão Próxima */}
                    <Button
                      variant="outline"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages || isLoading}
                      className="flex items-center gap-2 min-w-32"
                    >
                      Próxima
                      <span>→</span>
                    </Button>
                  </div>
                  
                  {/* Indicador de página */}
                  <div className="text-xs text-muted-foreground">
                    Página {currentPage} de {totalPages} • {totalItems} imóveis no total
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* MOBILE - COM PAGINAÇÃO REAL */}
      <section className="py-16 bg-background md:hidden">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"></div>
              <p className="text-xl text-muted-foreground">
                Carregando empreendimentos...
              </p>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">
                {totalItems === 0 
                  ? "Nenhum empreendimento disponível no momento."
                  : "Nenhum empreendimento encontrado com este filtro."
                }
              </p>
              {activeFilter !== "Todos" && (
                <Button
                  variant="outline"
                  onClick={() => setActiveFilter("Todos")}
                  className="mt-4"
                >
                  Ver Todos os Empreendimentos
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* INFO DA PAGINAÇÃO MOBILE */}
              <div className="mb-6 text-center">
                <div className="bg-luxury-bg px-4 py-2 rounded-lg inline-block">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{properties.length}</span> de{" "}
                    <span className="font-semibold text-foreground">{totalItems}</span> imóveis
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Página <span className="font-semibold">{currentPage}</span> de{" "}
                    <span className="font-semibold">{totalPages}</span>
                  </p>
                </div>
              </div>
              
              {/* Swiper para mobile - MOSTRA OS 8 IMÓVEIS DA PÁGINA */}
              <Swiper
                slidesPerView={1.1}
                spaceBetween={16}
                className="pb-10"
                navigation={false}
                pagination={{ 
                  clickable: true,
                  dynamicBullets: true 
                }}
              >
                {parsedProperties.map((property, index) => (
                  <SwiperSlide key={`${property.id}-mobile-${index}`}>
                    <PropertyCard {...property} />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Paginação mobile */}
              {totalPages > 1 && (
                <div className="flex flex-col items-center gap-4 mt-8">
                  {/* Controles mobile */}
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPrevPage}
                      disabled={currentPage === 1 || isLoading}
                      className="text-xs min-w-24"
                    >
                      ← Anterior
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {currentPage}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        de {totalPages}
                      </span>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages || isLoading}
                      className="text-xs min-w-24"
                    >
                      Próxima →
                    </Button>
                  </div>
                  
                  {/* Seletor de página mobile */}
                  <div className="w-full max-w-xs">
                    <div className="text-xs text-center text-muted-foreground mb-2">
                      Ir para página:
                    </div>
                    <div className="flex flex-wrap justify-center gap-1">
                      {getPageNumbers().map((pageNum) => (
                        <button
                          key={`mobile-page-${pageNum}`}
                          onClick={() => goToPage(pageNum)}
                          disabled={isLoading}
                          className={`w-8 h-8 rounded-md text-xs ${
                            currentPage === pageNum
                              ? 'bg-secondary text-primary font-bold'
                              : 'bg-luxury-bg text-foreground hover:bg-accent'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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