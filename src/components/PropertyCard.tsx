import { Link } from "react-router-dom";
import { MapPin, Maximize2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PropertyCardProps {
  id: string;
  slug: string; // 👈 ADICIONE
  title: string;
  location: string;
  type: string;
  image: string;
  featured?: boolean;
  videos?: any[];
  propertyData?: any;
}


export const PropertyCard = ({
  id,
  slug, // 👈 AQUI
  title,
  location,
  type,
  image,
  featured,
  videos = [],
  propertyData,
}: PropertyCardProps) => {

  
  const hasImage = image && image !== "";
  const hasVideo = videos.length > 0;
  const hasVideosOnly = !hasImage && hasVideo;

  const handlePropertyClick = () => {
    // propertyData já é passado diretamente do Properties.tsx
    const allProperties = propertyData?.properties || [];
    
    
    
    const numericId = parseInt(id);
    const fullPropertyData = allProperties.find((property: any) => {
      return property.id === numericId;
    });
    
    if (fullPropertyData) {
      // Armazena os dados completos no localStorage para usar na página de detalhes
      localStorage.setItem('currentProperty', JSON.stringify(fullPropertyData));
    } else {
      console.log('⚠️ Imóvel não encontrado. IDs disponíveis:', allProperties.map((p: any) => ({id: p.id, title: p.property_title})));
    }
  };

  // Obter a URL do primeiro vídeo
  const getVideoUrl = () => {
    if (videos.length > 0 && videos[0].url) {
      return videos[0].url;
    }
    return null;
  };

  const videoUrl = getVideoUrl();

  return (
    <Card className="group overflow-hidden border-border hover:shadow-[var(--shadow-gold)] transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden aspect-[4/3]">
        <Link 
          to={`/empreendimento/${slug}/${id}`} 
          className="absolute inset-0 z-10 cursor-pointer"
          onClick={handlePropertyClick}
        />
        
        {/* Exibir imagem normal OU vídeo se não tiver imagem */}
        {hasImage ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
            {/* Overlay escuro para melhor contraste */}
            <div className="absolute inset-0 bg-black/20" />
            
            {/* Badge de Vídeo */}
            <div className="absolute top-4 left-4 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold z-20 flex items-center gap-1">
              <Play className="w-3 h-3 fill-current" />
              <span>Vídeo</span>
            </div>
            
            {/* Ícone de play centralizado */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-secondary/90 rounded-full p-4 transform group-hover:scale-110 transition-transform duration-300 z-20 shadow-lg">
                <Play className="w-6 h-6 text-primary fill-primary" />
              </div>
            </div>
          </div>
        ) : (
          // Fallback caso não tenha nem imagem nem vídeo
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <div className="text-center text-muted-foreground p-4">
              <p className="font-semibold">{title}</p>
              <p className="text-sm mt-2">Imagem não disponível</p>
            </div>
          </div>
        )}
        
        {/* Badge de Destaque */}
        {featured && (
          <div className="absolute top-4 right-4 bg-secondary text-primary px-3 py-1 rounded-full text-xs font-semibold z-20">
            Destaque
          </div>
        )}
        
        {/* Badge do Tipo */}
        {type && (
          <div className="absolute top-4 left-4 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold z-20">
            {type}
          </div>
        )}
        
        {/* Overlay no hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-secondary transition-colors line-clamp-2">
            {title}
          </h3>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-secondary" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>

        <Button variant="hero" className="w-full group" asChild>
          <Link to={`/empreendimento/${slug}/${id}`} onClick={handlePropertyClick}>
            <span>Ver Detalhes</span>
            <Maximize2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};