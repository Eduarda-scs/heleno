import { useRef, useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getSearchByName } from "@/hooks/Admin/searchNameAdmin";
import { generateSlug } from "@/utils/slug";

interface PropertyFromAPI {
  id: number;
  property_title: string;
  images?: Array<{ url: string; is_cover?: string }>;
}

interface PropertySearchProps {
  onSearchResults: (results: any[], isSearching: boolean) => void;
  onClearSearch: () => void;
}

const PropertySearch = ({ onSearchResults, onClearSearch }: PropertySearchProps) => {
  const [searchName, setSearchName] = useState("");
  const [suggestions, setSuggestions] = useState<PropertyFromAPI[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchName.trim().length >= 3) {
      setIsLoading(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const results = await getSearchByName(searchName);
          setSuggestions(results.slice(0, 5));
          setShowSuggestions(true);
        } catch (error) {
          console.error("❌ Erro ao buscar sugestões:", error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoading(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchName]);

  const handleSuggestionClick = (property: PropertyFromAPI) => {
    // Alterado: Agora redireciona para /detalhe-imovel/id-do-imovel
    setShowSuggestions(false);
    setSearchName("");
    navigate(`/admin/detalhes-imovel/${property.id}`);
  };

  const handleSearch = async () => {
    if (!searchName.trim()) return;

    try {
        setIsLoading(true);

        // fecha sugestões ao confirmar
        setShowSuggestions(false);

        const results = await getSearchByName(searchName);

        // 🔥 aqui é o ponto-chave
        onSearchResults(results, true);
    } catch (error) {
        console.error("❌ Erro na busca:", error);
        onSearchResults([], true);
    } finally {
        setIsLoading(false);
    }
    };


  const handleClear = () => {
    setSearchName("");
    setSuggestions([]);
    setShowSuggestions(false);
    onClearSearch();
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
            }
            }}
          placeholder="Buscar imóvel por nome..."
          className="w-full pl-10 pr-10 py-2.5 bg-card border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
        />
        {searchName && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          {suggestions.map((property) => {
            const coverImage = property.images?.find(img => img.is_cover === 'true')?.url || property.images?.[0]?.url;
            return (
              <button
                key={property.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSuggestionClick(property);
                }}
                className="w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-center gap-3 border-b border-border last:border-b-0"
              >
                {coverImage && (
                  <img
                    src={coverImage}
                    alt=""
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                )}
                <span className="text-sm font-medium truncate">{property.property_title}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PropertySearch;