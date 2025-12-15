import { useParams, Link } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Bed,
  Bath,
  Maximize2,
  MapPin,
  CheckCircle,
  MessageCircle,
  X,
  Car,
  Share2,
  Plus,
} from "lucide-react";
import { usePropertyDetailStore } from "@/store/usePropertyDetailStore";
import { getPropertyFromWebhook } from "@/hooks/Admin/PropertyService";
import { useToast } from "@/components/ui/use-toast";



const Header = lazy(() => import("@/components/Header"));
const Footer = lazy(() => import("@/components/Footer"));

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<any>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [lightboxClosing, setLightboxClosing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { toast } = useToast();

  const { currentProperty, clearCurrentProperty } = usePropertyDetailStore();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleShare = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast({
        title: "Link copiado!",
        description: "O link do imóvel foi copiado para a área de transferência.",
        duration: 3000,
      });
    });
  };

  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 200;
      const progress = Math.max(0.5, 1 - (scrollY / maxScroll));
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  const findPropertyInWebhookData = (webhookData: any, propertyId: string | undefined) => {
    if (!webhookData || !propertyId) return null;

    for (const propertyType of webhookData) {
      if (propertyType.properties) {
        const foundProperty = propertyType.properties.find(
          (prop: any) => prop.id.toString() === propertyId
        );
        if (foundProperty) return foundProperty;
      }
    }
    
    return null;
  };
  const formatDescription = (text: string) => {
    if (!text) return '';
    
    // Substituir quebras de linha (\n) por <br />
    return text.replace(/\n/g, '<br />');
  };

  const convertStorePropertyToComponentFormat = (storeProperty: any) => {
    const fotosArray = storeProperty.images?.map((img: any) => ({
      type: "image",
      url: img.url,
    })) || [];

    const videosArray = storeProperty.videos?.map((video: any) => ({
      type: "video",
      url: video.url,
    })) || [];

    const caracteristicasArray = storeProperty.amenities?.map((amenity: any) => 
      amenity.amenity_name || ''
    ).filter(Boolean) || [];

    const propertyTypesArray = storeProperty.property_types?.map((type: any) => 
      type.property_type_name || ''
    ).filter(Boolean) || [];

    const categoriesArray = storeProperty.categories?.map((category: any) => 
      category.category_name || ''
    ).filter(Boolean) || [];

    return {
      id: storeProperty.id,
      titulo: storeProperty.property_title,
      descricao: storeProperty.property_detail,
      cidade: storeProperty.property_city,
      bairro: storeProperty.property_neighborhood,
      rua: storeProperty.property_street,
      numero: storeProperty.property_street_number,
      cep: storeProperty.property_postal_code,
      valor: storeProperty.property_price,
      valor_negociacao: storeProperty.property_negociation_price,
      valor_condominio: storeProperty.property_condo_price,
      valor_locacao: storeProperty.property_rental_price,
      quartos: storeProperty.property_bedrooms,
      banheiros: storeProperty.property_bathrooms,
      metros: storeProperty.property_area_sqm,
      vagas: storeProperty.property_garage_spaces,
      tipo: storeProperty.property_types?.[0]?.property_type_name || "Imóvel",
      caracteristicas: caracteristicasArray,
      property_types: propertyTypesArray,
      categories: categoriesArray,
      amenities: caracteristicasArray,
      fotos: fotosArray,
      videos: videosArray,
      whatsapp: "554792639593",
      status: true,
    };
  };

  const fetchProperty = async () => {
    try {
      console.log(`[PropertyDetails] 🔄 Buscando imóvel ID: ${id}`);

      if (currentProperty && currentProperty.id.toString() === id) {
        console.log(`[PropertyDetails] ✅ Encontrado no store: ${currentProperty.property_title}`);
        
        const storeProperty = convertStorePropertyToComponentFormat(currentProperty);
        setProperty(storeProperty);
        return;
      }

      console.log(`[PropertyDetails] 🔍 Não encontrado no store, buscando via webhook...`);

      const webhookData = await getPropertyFromWebhook();
      
      const foundProperty = findPropertyInWebhookData(webhookData, id);
      
      if (foundProperty) {
        console.log(`[PropertyDetails] ✅ Encontrado via webhook: ${foundProperty.property_title}`);
        const convertedProperty = convertStorePropertyToComponentFormat(foundProperty);
        setProperty(convertedProperty);
      } else {
        console.log(`[PropertyDetails] ❌ Imóvel não encontrado nos dados do webhook`);
        setProperty(null);
      }
    } catch (webhookError) {
      console.error("[PropertyDetails] ❌ Erro ao buscar dados do webhook:", webhookError);
      setProperty(null);
    } finally {
      setIsInitialized(true);
    }
  };

  useEffect(() => {
    if (!id) return;

    const timer = setTimeout(() => {
      if (!isInitialized) {
        console.log("[PropertyDetails] 🚀 Iniciando carregamento após renderização...");
        fetchProperty();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [id, isInitialized]);

  useEffect(() => {
    return () => {
      clearCurrentProperty();
    };
  }, [clearCurrentProperty]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxClosing(true);
    setTimeout(() => {
      setLightboxOpen(false);
      setLightboxClosing(false);
      document.body.style.overflow = 'unset';
    }, 300);
  };

  const nextMedia = () => {
    setLightboxIndex((prev) =>
      prev + 1 < gallery.length ? prev + 1 : 0
    );
  };

  const prevMedia = () => {
    setLightboxIndex((prev) =>
      prev - 1 >= 0 ? prev - 1 : gallery.length - 1
    );
  };

  const formatEndereco = () => {
    if (!property) return null;
    
    const { bairro, cidade, rua, numero } = property;
    
    if (!bairro && !cidade && !rua && !numero) {
      return null;
    }

    if (cidade && !bairro && !rua && !numero) {
      return cidade;
    }

    const parts = [];
    if (bairro) parts.push(bairro);
    if (cidade) parts.push(cidade);
    
    return parts.join(', ');
  };

  const renderValores = () => {
    if (!property) return null;
    
    const temVenda = property.valor || property.valor_negociacao;
    const temCondominio = property.valor_condominio;
    const temLocacao = property.valor_locacao;

    if (!temVenda && !temCondominio && !temLocacao) return null;

    return (
      <div className="space-y-4 md:space-y-6">
        {temVenda && (
          <div className="flex flex-col md:flex-row md:items-start md:gap-8">
            <div className="flex-1">
              <p className="text-base md:text-lg text-muted-foreground mb-1">Venda</p>
              <div className="space-y-1">
                {property.valor && (
                  <p className="text-2xl md:text-3xl font-bold text-black">
                    R$ {property.valor}
                  </p>
                )}
                {property.valor_negociacao && (
                  <p className="text-sm text-muted-foreground">
                    Negociação: R$ {property.valor_negociacao}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
          {temCondominio && (
            <div>
              <p className="text-base md:text-lg text-muted-foreground mb-1">Condomínio</p>
              <p className="text-xl md:text-2xl font-semibold text-black">
                R$ {property.valor_condominio}
              </p>
            </div>
          )}

          {temLocacao && (
            <div>
              <p className="text-base md:text-lg text-muted-foreground mb-1">Locação</p>
              <p className="text-xl md:text-2xl font-semibold text-black">
                R$ {property.valor_locacao}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDiferenciais = () => {
    if (!property) return null;
    
    const todosDiferenciais = [
      ...(property.property_types || []),
      ...(property.categories || []),
      ...(property.amenities || [])
    ];

    if (todosDiferenciais.length === 0) return null;

    return (
      <div>
        <h2 className="text-2xl font-bold mb-4 md:mb-6">Diferenciais</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {todosDiferenciais.map((diferencial: string, i: number) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
              <span className="text-sm leading-tight break-words">{diferencial}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background">
        <Suspense fallback={<div className="h-20 bg-background" />}>
          <Header />
        </Suspense>

        <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          <div className="absolute inset-0 bg-primary/70" />

          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 z-[99999]">
            <Link
              to="/empreendimentos"
              className="inline-flex items-center gap-2 bg-black/40 px-3 sm:px-4 py-2 rounded-lg text-white font-medium backdrop-blur-md transition text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              Voltar
            </Link>
          </div>
        </section>

        <div className="py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
              <div className="lg:col-span-2 space-y-8 md:space-y-10">
                <div className="space-y-6">
                  <div className="h-10 bg-gray-200 rounded animate-pulse max-w-3xl"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse max-w-2xl"></div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-gray-100 p-3 sm:p-4 rounded-lg animate-pulse">
                      <div className="w-6 h-6 bg-gray-300 mx-auto mb-2 rounded-full"></div>
                      <div className="h-4 bg-gray-300 rounded mb-1"></div>
                      <div className="h-5 bg-gray-300 rounded w-1/2 mx-auto"></div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded animate-pulse max-w-40"></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="aspect-video bg-gray-200 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded animate-pulse max-w-40"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-24 bg-gray-100 p-6 sm:p-8 rounded-xl animate-pulse space-y-4">
                  <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"></div>
          <p className="text-muted-foreground">Carregando detalhes do imóvel...</p>
          <p className="text-sm text-muted-foreground mt-2">Aguarde enquanto buscamos as informações</p>
        </div>

        <Suspense fallback={<div className="h-20 bg-background" />}>
          <Footer />
        </Suspense>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Suspense fallback={<div className="h-20 bg-background" />}>
          <Header />
        </Suspense>

        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-6">Imóvel não encontrado</h2>
          <p className="text-muted-foreground mb-8">
            O imóvel que você está procurando não existe ou foi removido.
          </p>
          <Link to="/empreendimentos">
            <Button variant="hero">Voltar para Empreendimentos</Button>
          </Link>
        </div>

        <Suspense fallback={<div className="h-20 bg-background" />}>
          <Footer />
        </Suspense>
      </div> 
    );
  }

  const heroImage = property.fotos[0]?.url || "";

  const gallery = [
    ...(heroImage ? [{ type: "image", url: heroImage }] : []),
    ...property.fotos.slice(1),
    ...property.videos,
  ];

  // Para mobile: mostrar apenas 2 fotos principais + botão "ver mais"
  const visibleGalleryMobile = gallery.slice(0, 4);
  const hasMoreMediaMobile = gallery.length > 4;

  // Para desktop: mostrar 4 fotos
  const visibleGalleryDesktop = gallery.slice(0, 4);
  const hasMoreMediaDesktop = gallery.length > 4;

  const currentMedia = gallery?.[lightboxIndex];
  const enderecoFormatado = formatEndereco();
  const heroHeight = isMobile 
    ? `calc(50vh * ${scrollProgress})`
    : '70vh';

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="h-20 bg-background" />}>
        <Header />
      </Suspense>

      {/* HERO */}
      <section 
        className="relative flex items-center justify-center overflow-hidden transition-all duration-300"
        style={{ 
          height: heroHeight
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300"
          style={{ 
            backgroundImage: `url(${heroImage})`,
            transform: isMobile ? `scale(${1 + (0.3 * (1 - scrollProgress))})` : 'none'
          }}
        />
        <div 
          className="absolute inset-0 transition-opacity duration-300"
          style={{ 
            backgroundColor: `rgba(0, 0, 0, ${0.7})`
          }}
        />

        {/* BOTÃO VOLTAR */}
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 z-[99999]">
          <Link
            to="/empreendimentos"
            className="inline-flex items-center gap-2 bg-black/40 px-3 sm:px-4 py-2 rounded-lg text-white font-medium hover:bg-black/60 backdrop-blur-md transition text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Voltar
          </Link>
        </div>

        {/* LOCALIZAÇÃO */}
        {enderecoFormatado && (
          <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 z-[99999]">
            <div className="inline-flex items-center gap-2 bg-black/40 px-3 sm:px-4 py-2 rounded-lg text-white font-medium backdrop-blur-md text-sm sm:text-base max-w-[200px] sm:max-w-none">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-secondary flex-shrink-0" />
              <span className="font-bwmodelica truncate">{enderecoFormatado}</span>
            </div>
          </div>
        )}
      </section>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
            {/* MAIN CONTENT */}
            <div className="lg:col-span-2 space-y-8 md:space-y-10">
              {/* TÍTULO E VALORES */}
              <div className="space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bwmodelica text-black leading-tight">
                  {property.titulo}
                </h1>
                
                {renderValores()}
              </div>

              {/* CARACTERÍSTICAS DO IMÓVEL */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-card p-3 sm:p-4 rounded-lg text-center">
                  <Bed className="w-5 h-5 sm:w-6 sm:h-6 text-black mx-auto mb-2" />
                  <div className="text-xs sm:text-sm text-muted-foreground">Quartos</div>
                  <div className="font-semibold text-sm sm:text-base">{property.quartos}</div>
                </div>

                <div className="bg-card p-3 sm:p-4 rounded-lg text-center">
                  <Bath className="w-5 h-5 sm:w-6 sm:h-6 text-black mx-auto mb-2" />
                  <div className="text-xs sm:text-sm text-muted-foreground">Banheiros</div>
                  <div className="font-semibold text-sm sm:text-base">{property.banheiros}</div>
                </div>

                <div className="bg-card p-3 sm:p-4 rounded-lg text-center">
                  <Maximize2 className="w-5 h-5 sm:w-6 sm:h-6 text-black mx-auto mb-2" />
                  <div className="text-xs sm:text-sm text-muted-foreground">Área</div>
                  <div className="font-semibold text-sm sm:text-base">{property.metros} m²</div>
                </div>

                {property.vagas && property.vagas > 0 && (
                  <div className="bg-card p-3 sm:p-4 rounded-lg text-center">
                    <Car className="w-5 h-5 sm:w-6 sm:h-6 text-black mx-auto mb-2" />
                    <div className="text-xs sm:text-sm text-muted-foreground">Vagas</div>
                    <div className="font-semibold text-sm sm:text-base">{property.vagas}</div>
                  </div>
                )}
              </div>

              {/* GALERIA - MOBILE E DESKTOP SEPARADOS */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <h2 className="text-2xl font-bold">Galeria</h2>
                  
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700 transition w-full sm:w-auto"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Compartilhar</span>
                  </button>
                </div>

                {/* GALERIA MOBILE — 4 mídias fixas */}
                <div className="sm:hidden">
                  <div className="grid grid-cols-2 grid-rows-2 gap-3">
                    {visibleGalleryMobile.map((item: any, index: number) => {
                      const isLast = index === 3 && hasMoreMediaMobile;

                      return (
                        <div
                          key={index}
                          onClick={() => openLightbox(index)}
                          className="relative overflow-hidden rounded-lg cursor-pointer group aspect-square"
                        >
                          {item.type === "image" ? (
                            <img
                              src={item.url}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              alt={`Imagem ${index + 1} do imóvel`}
                              loading="lazy"
                            />
                          ) : (
                            <video
                              src={item.url}
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                            />
                          )}

                          {isLast && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <div className="text-center">
                                <Plus className="w-8 h-8 text-white mb-1 mx-auto" />
                                <p className="text-white text-lg font-semibold">
                                  +{gallery.length - 4}
                                </p>
                                <p className="text-white/80 text-xs">Ver mais</p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>


                {/* GALERIA DESKTOP */}
                <div className="hidden sm:block">
                  <div className="grid grid-cols-2 gap-4">
                    {visibleGalleryDesktop.map((item: any, index: number) => (
                      <div
                        key={index}
                        onClick={() => openLightbox(index)}
                        className="relative overflow-hidden rounded-xl cursor-pointer group aspect-video"
                      >
                        {item.type === "image" ? (
                          <img
                            src={item.url}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            alt={`Imagem ${index + 1} do imóvel`}
                            loading="lazy"
                          />
                        ) : (
                          <video
                            src={item.url}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                          />
                        )}

                        {/* Overlay para mostrar +X mídias na última imagem (desktop) */}
                        {index === 3 && hasMoreMediaDesktop && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <div className="text-center">
                              <Plus className="w-8 h-8 text-white mb-2 mx-auto" />
                              <p className="text-white text-lg font-semibold">
                                +{gallery.length - 4}
                              </p>
                              <p className="text-white/80 text-sm">Ver mais</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

             {/* DESCRIÇÃO */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Descrição</h2>
                {/* MODIFICAÇÃO AQUI: Usando dangerouslySetInnerHTML para renderizar HTML */}
                <div 
                  className="text-base sm:text-lg text-muted-foreground leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ 
                    __html: formatDescription(property.descricao) 
                  }}
                />
              </div>

              {/* DIFERENCIAIS */}
              {renderDiferenciais()}
            </div>

            {/* SIDEBAR */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card p-6 sm:p-8 rounded-xl shadow-[var(--shadow-medium)] space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold">Interessado?</h3>

                <p className="text-muted-foreground text-sm sm:text-base">
                  Fale diretamente com Heleno!
                </p>

                <Button variant="gold" size="lg" className="w-full" asChild>
                  <a
                    href={`https://wa.me/${property.whatsapp}?text=Olá, venho do seu site tenho interesse no imóvel ${property.titulo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </a>
                </Button>

                <Button variant="hero" size="lg" className="w-full" asChild>
                  <Link to="/contato">Formulário de Contato</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="h-20 bg-background" />}>
        <Footer />
      </Suspense>

      {/* CSS PARA ANIMAÇÕES */}
      <style>
        {`
          @keyframes slideUpMobile {
            0% { transform: translateY(100%); opacity: 0; }
            60% { transform: translateY(-4%); }
            100% { transform: translateY(0%); opacity: 1; }
          }

          @keyframes slideDownMobile {
            0% { transform: translateY(0%); opacity: 1; }
            100% { transform: translateY(100%); opacity: 0; }
          }

          .mobile-slide-up {
            animation: slideUpMobile 450ms ease-out forwards;
          }

          .mobile-slide-down {
            animation: slideDownMobile 350ms ease-in forwards;
          }

          .overlay-fade {
            transition: opacity 350ms ease;
          }
        `}
      </style>

      {/* LIGHTBOX */}
      {(lightboxOpen || lightboxClosing) && (
        <div
          className={`fixed inset-0 z-[99999] flex ${
            isMobile ? "items-end" : "items-center"
          } justify-center`}
        >
          {/* Overlay */}
          <div
            className={`absolute inset-0 bg-black/80 backdrop-blur-sm overlay-fade ${
              lightboxClosing ? "opacity-0" : "opacity-100"
            }`}
            onClick={closeLightbox}
          />

          {/* CONTAINER */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`
              relative w-full
              ${isMobile ? "max-h-[85vh] h-[85vh] rounded-t-2xl" : "h-full rounded-lg"}
              bg-black flex items-center justify-center p-4 overflow-hidden

              ${
                isMobile
                  ? lightboxClosing
                    ? "mobile-slide-down"
                    : "mobile-slide-up"
                  : ""
              }
            `}
          >
            {/* BOTÃO FECHAR */}
            <button
              className="absolute top-4 right-4 text-white z-20 bg-black/50 rounded-full p-2 backdrop-blur-md hover:bg-black/70 transition-colors"
              onClick={closeLightbox}
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {/* NAVEGAÇÃO DESKTOP */}
            {!isMobile && (
              <>
                <button
                  className="absolute left-4 sm:left-6 text-white z-20 bg-black/50 rounded-full p-2 backdrop-blur-md hover:bg-black/70 transition-colors"
                  onClick={prevMedia}
                >
                  <ArrowLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>

                <button
                  className="absolute right-4 sm:right-6 text-white z-20 bg-black/50 rounded-full p-2 backdrop-blur-md hover:bg-black/70 transition-colors rotate-180"
                  onClick={nextMedia}
                >
                  <ArrowLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
              </>
            )}

            {/* MÍDIA */}
            <div className="max-w-4xl w-full flex items-center justify-center">
              {currentMedia?.type === "image" ? (
                <img
                  src={currentMedia?.url ?? ""}
                  className="w-full max-h-[70vh] sm:max-h-[80vh] object-contain rounded-lg"
                  alt="Visualização ampliada"
                />
              ) : (
                <video
                  src={currentMedia?.url ?? ""}
                  controls
                  autoPlay
                  className="w-full max-h-[70vh] sm:max-h-[80vh] rounded-lg"
                />
              )}
            </div>
            {/* INDICADOR DE NAVEGAÇÃO MOBILE */}
            {isMobile && gallery.length > 1 && (
              <>
                {/* SETA ESQUERDA */}
                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                  <div className="bg-black/40 backdrop-blur-md rounded-full p-2 animate-pulse">
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* SETA DIREITA */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                  <div className="bg-black/40 backdrop-blur-md rounded-full p-2 animate-pulse rotate-180">
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </div>
                </div>
              </>
            )}


            {/* ZONAS DE TOQUE MOBILE */}
            {isMobile && (
              <>
                <div
                  className="absolute left-0 top-0 bottom-0 w-1/3 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevMedia();
                  }}
                />
                <div
                  className="absolute right-0 top-0 bottom-0 w-1/3 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextMedia();
                  }}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;