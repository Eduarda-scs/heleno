import { Link, useNavigate } from "react-router-dom";
import { MapPin, Maximize2, Play, Bed, Bath, Car, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getUniquePropertyFromWebhook } from "@/hooks/Admin/ClientProperty";
import { useState } from "react";

interface PropertyCardProps {
  id: string;
  slug: string;
  title: string;
  location: string;
  type: string;
  image: string;
  price?: string;
  bedrooms?: string;
  bathrooms?: string;
  garage?: string;
  area?: string;
  featured?: boolean;
  videos?: any[];
  propertyData?: any;
  categories?: string[];
  amenities?: string[];
}

export const PropertyCard = ({
  id,
  slug,
  title,
  location,
  type,
  image,
  price = "Consultar",
  bedrooms = "0",
  bathrooms = "0",
  garage = "0",
  area = "0",
  featured = false,
  videos = [],
  propertyData,
  categories = [],
  amenities = [],
}: PropertyCardProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const hasImage = image && image !== "";
  const hasVideo = videos.length > 0;
  const hasVideosOnly = !hasImage && hasVideo;

  const handlePropertyClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const allProperties = propertyData?.properties || [];
      const numericId = parseInt(id);
      const fullPropertyData = allProperties.find((property: any) => {
        return property.id === numericId;
      });
      
      if (fullPropertyData) {
        console.log('📤 Enviando dados do imóvel para webhook/uniqueITEM:', fullPropertyData);
        
        const uniquePropertyData = await getUniquePropertyFromWebhook(fullPropertyData);
        
        if (uniquePropertyData) {
          console.log('✅ Dados recebidos do webhook/uniqueITEM:', uniquePropertyData);
          localStorage.setItem('uniquePropertyData', JSON.stringify(uniquePropertyData));
          localStorage.setItem('currentProperty', JSON.stringify(uniquePropertyData));
          
          navigate(`/empreendimento/${slug}/${id}`);
        } else {
          console.error('❌ Não foi possível obter dados do webhook/uniqueITEM');
          localStorage.setItem('currentProperty', JSON.stringify(fullPropertyData));
          navigate(`/empreendimento/${slug}/${id}`);
        }
      } else {
        console.log('⚠️ Imóvel não encontrado no cache.');
        navigate(`/empreendimento/${slug}/${id}`);
      }
    } catch (error) {
      console.error('❌ Erro ao processar clique do imóvel:', error);
      navigate(`/empreendimento/${slug}/${id}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getVideoUrl = () => {
    if (videos.length > 0 && videos[0].url) {
      return videos[0].url;
    }
    return null;
  };

  const videoUrl = getVideoUrl();

  const formatPrice = (priceStr: string) => {
    if (!priceStr || priceStr === "Consultar") return "Consultar";
    return `R$ ${priceStr}`;
  };

  return (
    <Card className="group overflow-hidden border-border hover:shadow-[var(--shadow-gold)] transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
      <div className="relative overflow-hidden aspect-[4/3]">
        <div 
          className="absolute inset-0 z-10 cursor-pointer"
          onClick={handlePropertyClick}
        />
        
        {hasImage ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.onerror = null;
              target.src = "https://via.placeholder.com/400x300?text=Imagem+Indisponível";
            }}
          />
        ) : hasVideo && videoUrl ? (
          <div className="w-full h-full bg-gray-200 relative">
            <video
              src={videoUrl}
              className="w-full h-full object-cover pointer-events-none"
              playsInline
              muted
              preload="metadata"
              onLoadedMetadata={(e) => {
                const v = e.currentTarget;
                try {
                  v.currentTime = 0.1;
                } catch {}
              }}
            />
            <div className="absolute inset-0 bg-black/20" />
            
            <div className="absolute top-4 left-4 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold z-20 flex items-center gap-1">
              <Play className="w-3 h-3 fill-current" />
              <span>Vídeo</span>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-secondary/90 rounded-full p-4 transform group-hover:scale-110 transition-transform duration-300 z-20 shadow-lg">
                <Play className="w-6 h-6 text-primary fill-primary" />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <div className="text-center text-muted-foreground p-4">
              <p className="font-semibold">{title}</p>
              <p className="text-sm mt-2">Imagem não disponível</p>
            </div>
          </div>
        )}
        
        {featured && (
          <div className="absolute top-4 right-4 bg-secondary text-primary px-3 py-1 rounded-full text-xs font-semibold z-20">
            Destaque
          </div>
        )}
        
        {type && (
          <div className="absolute top-4 left-4 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold z-20">
            {type}
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-20">
          <div className="text-white font-bold text-lg">
            {formatPrice(price)}
          </div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {isLoading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="mb-4 flex-1">
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-secondary transition-colors line-clamp-2">
            {title}
          </h3>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Bed className="w-4 h-4 text-secondary" />
              <span>{bedrooms} Quarto{parseInt(bedrooms) !== 1 ? 's' : ''}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Bath className="w-4 h-4 text-secondary" />
              <span>{bathrooms} Banheiro{parseInt(bathrooms) !== 1 ? 's' : ''}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Car className="w-4 h-4 text-secondary" />
              <span>{garage} Vaga{parseInt(garage) !== 1 ? 's' : ''}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Square className="w-4 h-4 text-secondary" />
              <span>{area}m²</span>
            </div>
          </div>
        </div>

        <Button 
          variant="hero" 
          className="w-full group mt-auto" 
          onClick={handlePropertyClick}
          disabled={isLoading}
        >
          <span>{isLoading ? 'Carregando...' : 'Ver Detalhes'}</span>
          {!isLoading && <Maximize2 className="w-4 h-4 group-hover:scale-110 transition-transform" />}
        </Button>
      </CardContent>
    </Card>
  );
};
