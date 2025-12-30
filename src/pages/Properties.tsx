import { useEffect, useState, lazy, Suspense } from "react";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { getPropertyFromWebhook } from "@/hooks/Admin/ClientProperty";
import { generateSlug } from "@/utils/slug";
import { ChevronDown, ChevronUp } from "lucide-react";

const Header = lazy(() => import("@/components/Header"));
const Footer = lazy(() => import("@/components/Footer"));
const FloatingContactWidget = lazy(() => import("@/components/whatsapp"));

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

interface FilterOption {
  value: string;
  label: string;
}

interface FilterProps {
  options: FilterOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  isOpen: boolean;
  onToggle: () => void;
}

const Filter = ({ options, selectedValue, onValueChange, placeholder, isOpen, onToggle }: FilterProps) => {
  const selectedOption = options.find(opt => opt.value === selectedValue);

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-4 py-3 bg-background border border-border rounded-lg hover:border-secondary transition-colors duration-200"
      >
        <span className={`${selectedValue ? 'text-foreground' : 'text-muted-foreground'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-xl z-[10] max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onValueChange(option.value);
              }}
              className={`w-full text-left px-4 py-3 hover:bg-[#cca77b] transition-colors duration-150 ${
                selectedValue === option.value
                  ? 'bg-secondary text-primary font-bwmodelica'
                  : 'text-foreground'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Properties = () => {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);

  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<Array<{ id: number; property_type_name: string }>>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availableBedrooms, setAvailableBedrooms] = useState<string[]>([]);
  const [availableGarageSpaces, setAvailableGarageSpaces] = useState<string[]>([]);

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loadingPage, setLoadingPage] = useState<number | null>(null);

  const [filters, setFilters] = useState({
    cidade: "",
    tipo: "",
    valor: "",
    quartos: "",
    vagas: "",
  });

  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const loadProperties = async (page = 1) => {
    try {
      setIsLoading(true);
      setLoadingPage(page);

      const backendFilters: any = {};

      if (filters.tipo && filters.tipo !== '') {
        backendFilters.type = filters.tipo;
      }

      if (filters.cidade && filters.cidade !== '') {
        backendFilters.city = filters.cidade;
      }

      if (filters.quartos && filters.quartos !== '') {
        backendFilters.bedrooms = filters.quartos;
      }

      if (filters.vagas && filters.vagas !== '') {
        backendFilters.garage_spaces = filters.vagas;
      }

      if (filters.valor && filters.valor !== '') {
        backendFilters.price = filters.valor;
      }

      console.log('🔍 [FILTROS] Estado atual dos filtros:', filters);
      console.log('📤 [FILTROS] Filtros sendo enviados para backend:', backendFilters);

      const filtersToSend = Object.keys(backendFilters).length > 0 ? backendFilters : null;

      console.log(`📡 [PAGINAÇÃO] Buscando página ${page} com filtros:`, filtersToSend);

      const response = await getPropertyFromWebhook(page, filtersToSend);

      if (response && response.data) {
        const validProperties = response.data.filter((prop: any) => {
          return prop && Object.keys(prop).length > 0 && prop.property_title;
        });

        console.log(`✅ Página ${page} carregada:`, {
          total_items: response.total_items,
          total_pages: response.total_pages,
          properties_received: validProperties.length,
          page_requested: page
        });

        setProperties(validProperties);
        setTotalPages(response.total_pages || 1);
        setTotalItems(response.total_items || 0);
        setCurrentPage(response.page || page);

        if (response.property_types && response.property_types.length > 0) {
          setPropertyTypes(response.property_types);
        }

        if (page === 1) {
          if (response.propertyCities && response.propertyCities.length > 0) {
            const cities = response.propertyCities.map((city: any) => city.property_city);
            setAvailableCities(cities);
          }

          if (response.propertyBedrooms && response.propertyBedrooms.length > 0) {
            const bedrooms = response.propertyBedrooms
              .map((b: any) => b.property_bedrooms?.toString())
              .filter(Boolean);
            setAvailableBedrooms(bedrooms.sort((a, b) => parseInt(a) - parseInt(b)));
          }

          if (response.propertyGarageSpaces && response.propertyGarageSpaces.length > 0) {
            const garageSpaces = response.propertyGarageSpaces
              .map((g: any) => g.property_garage_spaces?.toString())
              .filter(Boolean);
            setAvailableGarageSpaces(garageSpaces.sort((a, b) => parseInt(a) - parseInt(b)));
          }
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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isInitialized) {
        loadProperties(1);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      console.log('🔄 [FILTROS] Filtros alterados, recarregando página 1:', filters);
      loadProperties(1);
    }
  }, [
    filters.tipo,
    filters.cidade,
    filters.valor,
    filters.quartos,
    filters.vagas,
    isInitialized
  ]);

  const parsedProperties = properties.map((property) => {
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

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      loadProperties(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      loadProperties(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      loadProperties(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);

      if (end === totalPages) {
        start = totalPages - maxVisible + 1;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const handleFilterToggle = (filterName: string) => {
    setOpenFilter(openFilter === filterName ? null : filterName);
  };

  const handleFilterChange = (filterName: string, value: string) => {
    console.log(`🎯 [FILTRO] Alterando ${filterName}: ${value}`);
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setOpenFilter(null);
  };

  const cidadeOptions: FilterOption[] = [
    { value: '', label: 'Todas as cidades' },
    ...availableCities.map(city => ({
      value: city,
      label: city
    }))
  ];

  const tipoOptions: FilterOption[] = [
    { value: '', label: 'Todos os tipos' },
    ...propertyTypes.map(type => ({
      value: type.property_type_name,
      label: type.property_type_name
    }))
  ];

  const valorOptions: FilterOption[] = [
    { value: '', label: 'Todos os preços' },
    { value: 'ate-500k', label: 'Até R$ 500 mil' },
    { value: 'ate-1m', label: 'Até R$ 1 milhão' },
    { value: 'ate-2m', label: 'Até R$ 2 milhões' },
    { value: 'ate-5m', label: 'Até R$ 5 milhões' },
    { value: 'acima-5m', label: 'Acima de R$ 5 milhões' },
  ];

  const quartosOptions: FilterOption[] = [
    { value: '', label: 'Quantidade de quartos' },
    ...availableBedrooms.map(bedroom => ({
      value: bedroom,
      label: `${bedroom} quarto${parseInt(bedroom) > 1 ? 's' : ''}`
    }))
  ];

  const vagasOptions: FilterOption[] = [
    { value: '', label: 'Quantidade de vagas' },
    ...availableGarageSpaces.map(space => ({
      value: space,
      label: `${space} vaga${parseInt(space) > 1 ? 's' : ''}`
    }))
  ];

  if (isLoading && !isInitialized) {
    return (
      <div className="min-h-screen bg-background">
        <Suspense fallback={<div className="h-20 bg-background" />}>
          <Header />
        </Suspense>

        <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/opt-empreendimentos.webp"
              alt="Banner Opt Empreendimentos"
              className="w-full h-full object-cover"
              fetchpriority="high"
              decoding="async"
            />
          </div>

          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
            <h1 className="text-3xl md:text-6xl font-bwmodelicaLightItalic mb-4">
              Nossos <span className="text-secondary">Empreendimentos</span>
            </h1>

            <p className="text-base md:text-2xl text-primary-foreground/90">
              Encontre o imóvel perfeito para você em Balneário Camboriú
            </p>
          </div>
        </section>

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

      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
            <img
              src="/opt-empreendimentos.webp"
              alt="Banner Opt Empreendimentos"
              className="w-full h-full object-cover"
              fetchpriority="high"
              decoding="async"
            />
          </div>

          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
            <h1 className="text-3xl md:text-6xl font-bwmodelicaLightItalic mb-4">
              Nossos <span className="text-secondary">Empreendimentos</span>
            </h1>

            <p className="text-base md:text-2xl text-primary-foreground/90">
              Encontre o imóvel perfeito para você em Balneário Camboriú
            </p>
        </div>
      </section>


      <section className="w-full bg-background/70 backdrop-blur-md border-b border-border py-8 relative z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-xl border border-border">

            <div className="flex-1 min-w-[200px]">
              <Filter
                options={cidadeOptions}
                selectedValue={filters.cidade}
                onValueChange={(value) => handleFilterChange('cidade', value)}
                placeholder="Cidade"
                isOpen={openFilter === 'cidade'}
                onToggle={() => handleFilterToggle('cidade')}
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <Filter
                options={tipoOptions}
                selectedValue={filters.tipo}
                onValueChange={(value) => handleFilterChange('tipo', value)}
                placeholder="Tipo de imóvel"
                isOpen={openFilter === 'tipo'}
                onToggle={() => handleFilterToggle('tipo')}
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <Filter
                options={valorOptions}
                selectedValue={filters.valor}
                onValueChange={(value) => handleFilterChange('valor', value)}
                placeholder="Qualquer Valor"
                isOpen={openFilter === 'valor'}
                onToggle={() => handleFilterToggle('valor')}
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <Filter
                options={quartosOptions}
                selectedValue={filters.quartos}
                onValueChange={(value) => handleFilterChange('quartos', value)}
                placeholder="Quartos"
                isOpen={openFilter === 'quartos'}
                onToggle={() => handleFilterToggle('quartos')}
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <Filter
                options={vagasOptions}
                selectedValue={filters.vagas}
                onValueChange={(value) => handleFilterChange('vagas', value)}
                placeholder="Vagas"
                isOpen={openFilter === 'vagas'}
                onToggle={() => handleFilterToggle('vagas')}
              />
            </div>

          </div>
        </div>
      </section>


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
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({
                    cidade: "",
                    tipo: "",
                    valor: "",
                    quartos: "",
                    vagas: "",
                  });
                  setCurrentPage(1);
                  loadProperties(1);
                }}
                className="mt-4 hover:bg-[#07262d] hover:text-primary-foreground"
              >
                Limpar Filtros
              </Button>
            </div>
          ) : (
            <>
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

              {totalPages > 1 && (
                <div className="flex flex-col items-center gap-6 mt-12 pt-8 border-t border-border">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      onClick={goToPrevPage}
                      disabled={currentPage === 1 || isLoading}
                      className="flex items-center gap-2 min-w-32 hover:bg-[#07262d] hover:text-primary-foreground"
                    >
                      <span>←</span>
                      Anterior
                    </Button>

                    <div className="flex items-center gap-1 mx-4">
                      {getPageNumbers().map((pageNum) => (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "gold" : "outline"}
                          onClick={() => goToPage(pageNum)}
                          disabled={isLoading}
                          className={`min-w-10 h-10 px-0 hover:bg-[#07262d] hover:text-primary-foreground ${
                            currentPage === pageNum
                              ? "font-bwmodelica shadow-md"
                              : ""
                          }`}
                        >
                          {pageNum}
                        </Button>
                      ))}

                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <span className="px-2 text-muted-foreground">...</span>
                          <Button
                            variant="outline"
                            onClick={() => goToPage(totalPages)}
                            disabled={isLoading}
                            className="min-w-10 h-10 px-0 hover:bg-[#07262d] hover:text-primary-foreground"
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages || isLoading}
                      className="flex items-center gap-2 min-w-32 hover:bg-[#07262d] hover:text-primary-foreground"
                    >
                      Próxima
                      <span>→</span>
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Página {currentPage} de {totalPages} • {totalItems} imóveis no total
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

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
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({
                    cidade: "",
                    tipo: "",
                    valor: "",
                    quartos: "",
                    vagas: "",
                  });
                  setCurrentPage(1);
                  loadProperties(1);
                }}
                className="mt-4 hover:bg-[#07262d] hover:text-primary-foreground"
              >
                Limpar Filtros
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <div className="bg-luxury-bg px-4 py-2 rounded-lg inline-block">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-bwmodelica text-foreground">{properties.length}</span> de{" "}
                    <span className="font-bwmodelica text-foreground">{totalItems}</span> imóveis
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Página <span className="font-bwmodelica">{currentPage}</span> de{" "}
                    <span className="font-bwmodelica">{totalPages}</span>
                  </p>
                </div>
              </div>

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

              {totalPages > 1 && (
                <div className="flex flex-col items-center gap-4 mt-8">
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPrevPage}
                      disabled={currentPage === 1 || isLoading}
                      className="text-xs min-w-24 hover:bg-[#07262d] hover:text-primary-foreground"
                    >
                      ← Anterior
                    </Button>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bwmodelica text-foreground">
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
                      className="text-xs min-w-24 hover:bg-[#07262d] hover:text-primary-foreground"
                    >
                      Próxima →
                    </Button>
                  </div>

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
                          className={`w-8 h-8 rounded-md text-xs hover:bg-[#07262d] hover:text-primary-foreground ${
                            currentPage === pageNum
                              ? 'bg-secondary text-primary font-bwmodelica'
                              : 'bg-luxury-bg text-foreground'
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
        <FloatingContactWidget />
      </Suspense>
    </div>
  );
};

export default Properties;