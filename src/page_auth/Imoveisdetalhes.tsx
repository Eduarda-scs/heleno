import { useEffect, useState, ChangeEvent, lazy, Suspense } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, MapPin, Home, User, Shield, Bed, Bath, Car, Ruler, Play, Save, X, Trash2, Upload } from "lucide-react";
import { usePropertyCRUD } from "@/hooks/Admin/PropertyCRUD";
import { sendPropertyToWebhook } from "@/hooks/Admin/PropertyManager";
import { getUniquePropertyFromWebhook } from "@/hooks/Admin/PropertyService";

const Header = lazy(() => import("@/components/Header"));

interface Amenity {
  id: number;
  amenitie_id?: number;
  amenitie_name: string;
  amenitie_description: string | null;
  amenitie_color: string | null;
  amenitie_emoji: string | null;
}

interface Category {
  id: number;
  category_id?: number;
  category_name: string;
  category_description: string | null;
  category_color: string | null;
  category_emoji: string | null;
}

interface PropertyType {
  id: number;
  property_type_id?: number;
  property_type_name: string;
  property_type_description: string | null;
  property_type_color: string | null;
  property_type_emoji: string | null;
}

interface Image {
  url: string;
  is_cover: string;
  position: string;
}

interface Video {
  url: string;
  is_cover: string;
  position: string;
}

interface Property {
  id: number;
  property_title: string;
  property_detail: string;
  property_street: string;
  property_street_number: string;
  property_neighborhood: string;
  property_city: string;
  property_postal_code: string;
  property_area_sqm: string;
  property_bedrooms: string;
  property_bathrooms: string;
  property_garage_spaces: string;
  property_price: string;
  property_negociation_price: string | null;
  property_condo_price: string | null;
  property_rental_price: string | null;
  property_status: string;
  property_created_by: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  categories: Category[];
  amenities: Amenity[];
  property_types: PropertyType[];
  images: Image[];
  videos: Video[];
}

interface LocationState {
  imovel: Property;
  allAmenities?: Amenity[];
  allCategories?: Category[];
  allPropertyTypes?: PropertyType[];
}

export default function Imoveisdetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { updateProperty } = usePropertyCRUD();
  const { toast } = useToast();

  const [imovel, setImovel] = useState<Property | null>(null);
  const [originalImovel, setOriginalImovel] = useState<Property | null>(null);
  const [imagemPrincipal, setImagemPrincipal] = useState<string>("");
  const [videoPrincipal, setVideoPrincipal] = useState<string>("");
  const [tipoMidiaSelecionada, setTipoMidiaSelecionada] = useState<"imagem" | "video">("imagem");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [allAmenities, setAllAmenities] = useState<Amenity[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allPropertyTypes, setAllPropertyTypes] = useState<PropertyType[]>([]);
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<number[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [selectedPropertyTypeIds, setSelectedPropertyTypeIds] = useState<number[]>([]);

  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
  const [draggedVideoIndex, setDraggedVideoIndex] = useState<number | null>(null);

  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [newVideos, setNewVideos] = useState<File[]>([]);
  const [newPhotoPreviews, setNewPhotoPreviews] = useState<string[]>([]);
  const [newVideoPreviews, setNewVideoPreviews] = useState<string[]>([]);
  const [selectedNewPhotoIndex, setSelectedNewPhotoIndex] = useState<number | null>(null);
  const [selectedNewVideoIndex, setSelectedNewVideoIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadPropertyData = async () => {
      if (!id) {
        console.error("[ImoveisDetalhes] ❌ ID não encontrado na URL");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        console.log("[ImoveisDetalhes] 🔄 Carregando dados do imóvel ID:", id);

        const result = await getUniquePropertyFromWebhook(parseInt(id));

        if (result && result.property) {
          const propriedade = result.property;

          console.log("[ImoveisDetalhes] ✅ Dados carregados:", {
            property: propriedade,
            categories: result.categories.length,
            amenities: result.amenities.length,
            property_types: result.property_types.length
          });

          setImovel(propriedade);
          setOriginalImovel(JSON.parse(JSON.stringify(propriedade)));

          setAllAmenities(result.amenities || []);
          setAllCategories(result.categories || []);
          setAllPropertyTypes(result.property_types || []);

          const propertyAmenityIds = (propriedade.amenities || []).map((a: Amenity) => a.amenitie_id || a.id);
          const propertyCategoryIds = (propriedade.categories || []).map((c: Category) => c.category_id || c.id);
          const propertyTypeIds = (propriedade.property_types || []).map((pt: PropertyType) => pt.property_type_id || pt.id);

          console.log("[ImoveisDetalhes] 🔍 IDs extraídos do imóvel:", {
            amenityIds: propertyAmenityIds,
            categoryIds: propertyCategoryIds,
            propertyTypeIds: propertyTypeIds
          });

          setSelectedAmenityIds(propertyAmenityIds);
          setSelectedCategoryIds(propertyCategoryIds);
          setSelectedPropertyTypeIds(propertyTypeIds);

          const coverImage = propriedade.images?.find(
            (img: Image) => img.is_cover === "true"
          );
          setImagemPrincipal(coverImage?.url || propriedade.images?.[0]?.url || "");

          if (propriedade.videos && propriedade.videos.length > 0) {
            setVideoPrincipal(propriedade.videos[0].url);
          }
        } else {
          console.error("[ImoveisDetalhes] ❌ Dados não encontrados para o ID:", id);
          toast({
            title: "Erro ao carregar imóvel",
            description: "Não foi possível carregar os dados do imóvel.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("[ImoveisDetalhes] ❌ Erro ao carregar dados:", error);
        toast({
          title: "Erro ao carregar imóvel",
          description: "Ocorreu um erro ao carregar os dados do imóvel.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPropertyData();
  }, [id, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Carregando detalhes...</p>
      </div>
    );
  }

  if (!imovel) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Imóvel não encontrado</p>
          <Button onClick={() => navigate("/admin/gestao-imoveis")}>
            Voltar para gestão de imóveis
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (priceString: string | null) => {
    if (!priceString) return "";

    if (priceString.includes('.') && priceString.includes(',')) {
      return priceString;
    }

    return priceString || "";
  };

  const isCreatedByClient = (): boolean => {
    return imovel.client_name !== "admin" &&
           imovel.client_phone !== "admin" &&
           imovel.client_email !== "admin";
  };

  const getStatusLabel = (status: string, isClient: boolean) => {
    const statusConfig = {
      authorized: "Autorizado",
      inactive: "Inativo",
      pending: "Pendente",
      active: "Ativo",
    };

    return statusConfig[status as keyof typeof statusConfig] || status;
  };

  const handleSelecionarImagem = (url: string) => {
    setImagemPrincipal(url);
    setTipoMidiaSelecionada("imagem");
  };

  const handleSelecionarVideo = (url: string) => {
    setVideoPrincipal(url);
    setTipoMidiaSelecionada("video");
  };

  const handleEditClick = () => {
    if (imovel) {
      const propertyAmenityIds = (imovel.amenities || []).map((a: Amenity) => a.amenitie_id || a.id);
      const propertyCategoryIds = (imovel.categories || []).map((c: Category) => c.category_id || c.id);
      const propertyTypeIds = (imovel.property_types || []).map((pt: PropertyType) => pt.property_type_id || pt.id);

      console.log("[ImoveisDetalhes] 🔄 Modo de edição ativado com seleções:", {
        amenities: propertyAmenityIds,
        categories: propertyCategoryIds,
        property_types: propertyTypeIds
      });

      setSelectedAmenityIds(propertyAmenityIds);
      setSelectedCategoryIds(propertyCategoryIds);
      setSelectedPropertyTypeIds(propertyTypeIds);
    }
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setImovel(JSON.parse(JSON.stringify(originalImovel)));

    setSelectedAmenityIds(
      originalImovel?.amenities?.map((a: Amenity) => a.amenitie_id || a.id) || []
    );

    setSelectedCategoryIds(
      originalImovel?.categories?.map((c: Category) => c.category_id || c.id) || []
    );

    setSelectedPropertyTypeIds(
      originalImovel?.property_types?.map((pt: PropertyType) => pt.property_type_id || pt.id) || []
    );

    setNewPhotos([]);
    setNewVideos([]);
    setNewPhotoPreviews([]);
    setNewVideoPreviews([]);
    setIsEditing(false);
  };


  const handleInputChange = (field: keyof Property, value: string) => {
    setImovel(prev => prev ? { ...prev, [field]: value } : null);
  };

  const toggleAmenity = (id: number) => {
    setSelectedAmenityIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const toggleCategory = (id: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const togglePropertyType = (id: number) => {
    setSelectedPropertyTypeIds((prev) =>
      prev.includes(id) ? prev.filter((pt) => pt !== id) : [...prev, id]
    );
  };


  const handleImageDragStart = (index: number) => {
    setDraggedImageIndex(index);
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleImageDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!imovel || draggedImageIndex === null || !imovel.images) return;

    const newImages = [...imovel.images];
    const draggedItem = newImages[draggedImageIndex];

    newImages.splice(draggedImageIndex, 1);
    newImages.splice(dropIndex, 0, draggedItem);

    newImages.forEach((img, idx) => {
      img.position = String(idx + 1);
    });

    setImovel({ ...imovel, images: newImages });
    setDraggedImageIndex(null);
  };

  const handleVideoDragStart = (index: number) => {
    setDraggedVideoIndex(index);
  };

  const handleVideoDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleVideoDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!imovel || draggedVideoIndex === null || !imovel.videos) return;

    const newVideos = [...imovel.videos];
    const draggedItem = newVideos[draggedVideoIndex];

    newVideos.splice(draggedVideoIndex, 1);
    newVideos.splice(dropIndex, 0, draggedItem);

    newVideos.forEach((video, idx) => {
      video.position = String(idx + 1);
    });

    setImovel({ ...imovel, videos: newVideos });
    setDraggedVideoIndex(null);
  };

  const handleRemoveImage = async (imageUrl: string) => {
    if (!imovel) return;

    const imageToRemove = imovel.images.find(img => img.url === imageUrl);
    if (!imageToRemove) return;

    try {
      setIsSaving(true);

      await updateProperty({
        event_name: 'remove_property_media',
        property_id: imovel.id,
        previous_data: originalImovel,
        updated_data: imovel,
        media_key: imageUrl,
      });

      const updatedImages = imovel.images.filter(img => img.url !== imageUrl);

      updatedImages.forEach((img, idx) => {
        img.position = String(idx + 1);
      });

      const updatedImovel = { ...imovel, images: updatedImages };
      setImovel(updatedImovel);
      setOriginalImovel(JSON.parse(JSON.stringify(updatedImovel)));

      if (imagemPrincipal === imageUrl) {
        setImagemPrincipal(updatedImages[0]?.url || "");
      }

      toast({
        title: "Imagem removida",
        description: "A imagem foi removida com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao remover imagem:', error);
      toast({
        title: "Erro ao remover imagem",
        description: "Ocorreu um erro ao remover a imagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveVideo = async (videoUrl: string) => {
    if (!imovel) return;

    const videoToRemove = imovel.videos.find(video => video.url === videoUrl);
    if (!videoToRemove) return;

    try {
      setIsSaving(true);

      await updateProperty({
        event_name: 'remove_property_media',
        property_id: imovel.id,
        previous_data: originalImovel,
        updated_data: imovel,
        media_key: videoUrl,
      });

      const updatedVideos = imovel.videos.filter(video => video.url !== videoUrl);

      updatedVideos.forEach((video, idx) => {
        video.position = String(idx + 1);
      });

      const updatedImovel = { ...imovel, videos: updatedVideos };
      setImovel(updatedImovel);
      setOriginalImovel(JSON.parse(JSON.stringify(updatedImovel)));

      if (videoPrincipal === videoUrl) {
        setVideoPrincipal(updatedVideos[0]?.url || "");
      }

      toast({
        title: "Vídeo removido",
        description: "O vídeo foi removido com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao remover vídeo:', error);
      toast({
        title: "Erro ao remover vídeo",
        description: "Ocorreu um erro ao remover o vídeo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewPhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const updatedFiles = [...newPhotos, ...files];
    setNewPhotos(updatedFiles);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setNewPhotoPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleNewVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const updatedFiles = [...newVideos, ...files];
    setNewVideos(updatedFiles);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setNewVideoPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveNewPhoto = (index: number) => {
    const updatedPhotos = newPhotos.filter((_, i) => i !== index);
    const updatedPreviews = newPhotoPreviews.filter((_, i) => i !== index);
    setNewPhotos(updatedPhotos);
    setNewPhotoPreviews(updatedPreviews);
  };

  const handleRemoveNewVideo = (index: number) => {
    const updatedVideos = newVideos.filter((_, i) => i !== index);
    const updatedPreviews = newVideoPreviews.filter((_, i) => i !== index);
    setNewVideos(updatedVideos);
    setNewVideoPreviews(updatedPreviews);
  };

  const handleSaveChanges = async () => {
    if (!imovel || !originalImovel) return;

    setIsSaving(true);

    try {
      const selectedAmenities = allAmenities.filter(a =>
        selectedAmenityIds.includes(a.id)
      );

      const selectedCategories = allCategories.filter(c =>
        selectedCategoryIds.includes(c.id)
      );

      const selectedPropertyTypes = allPropertyTypes.filter(pt =>
        selectedPropertyTypeIds.includes(pt.id)
      );

      console.log('[ImoveisDetalhes] 📊 Dados selecionados:', {
        amenityIds: selectedAmenityIds,
        categoryIds: selectedCategoryIds,
        propertyTypeIds: selectedPropertyTypeIds,
        selectedAmenities: selectedAmenities.length,
        selectedCategories: selectedCategories.length,
        selectedPropertyTypes: selectedPropertyTypes.length
      });

      const updatedImovel = {
        ...imovel,
        amenities: selectedAmenities,
        categories: selectedCategories,
        property_types: selectedPropertyTypes,
      };

      const imagePositions = imovel.images.map((img, idx) => ({
        url: img.url,
        position: String(idx + 1),
      }));

      const videoPositions = imovel.videos.map((video, idx) => ({
        url: video.url,
        position: String(idx + 1),
      }));

      const hasNewMedia = newPhotos.length > 0 || newVideos.length > 0;

      console.log('[ImoveisDetalhes] 📤 Enviando update:', {
        event_name: 'update_property',
        property_id: imovel.id,
        previous_data: originalImovel,
        updated_data: updatedImovel,
        image_positions: imagePositions,
        video_positions: videoPositions,
        has_new_media: hasNewMedia,
      });

      await updateProperty({
        event_name: 'update_property',
        property_id: imovel.id,
        previous_data: originalImovel,
        updated_data: updatedImovel,
      });

      if (hasNewMedia) {
        const allNewMedia = [...newPhotos, ...newVideos];

        const payload = {
          titulo: imovel.property_title,
          descricao: imovel.property_detail,
          cidade: imovel.property_city,
          bairro: imovel.property_neighborhood,
          rua: imovel.property_street,
          cep: imovel.property_postal_code,
          numero: imovel.property_street_number,
          valor: imovel.property_price,
          negociacao: imovel.property_negociation_price || "",
          tipo: selectedPropertyTypes.map(pt => pt.property_type_name).join(", "),
          quartos: imovel.property_bedrooms,
          banheiros: imovel.property_bathrooms,
          vagas: imovel.property_garage_spaces,
          metros: imovel.property_area_sqm,
          condominio: imovel.property_condo_price || "",
          phone: imovel.client_phone,
          email: imovel.client_email,
          message: "",
          area: imovel.property_area_sqm,
          quarto: imovel.property_bedrooms,
          banheiro: imovel.property_bathrooms,
          vaga: imovel.property_garage_spaces,
          endereco: `${imovel.property_street}, ${imovel.property_street_number}`,
          finalidade: imovel.property_negociation_price || "",
          event_name: 'update_property_media',
          caracteristicas: selectedCategories
            .map(c => c.category_name)
            .join(", "),
          nome: imovel.client_name,
          foto: allNewMedia,
        };

        await sendPropertyToWebhook(payload);
      }

      setImovel(updatedImovel);
      setOriginalImovel(JSON.parse(JSON.stringify(updatedImovel)));

      setNewPhotos([]);
      setNewVideos([]);
      setNewPhotoPreviews([]);
      setNewVideoPreviews([]);

      setIsEditing(false);

      toast({
        title: "Imóvel atualizado",
        description: "As alterações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as alterações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };


  const isClient = isCreatedByClient();
  const hasMediaContent = (imovel.images && imovel.images.length > 0) || (imovel.videos && imovel.videos.length > 0);

  return (
    <>
      <Suspense fallback={<div className="h-20 w-full" />}>
        <Header />
      </Suspense>
      <div className="min-h-screen bg-background pt-24 pb-8 px-4 md:px-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/gestao-imoveis")}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {hasMediaContent && (
                <Card className="overflow-hidden shadow-lg">
                  <div className="relative w-full h-96 bg-muted flex items-center justify-center">
                    {tipoMidiaSelecionada === "imagem" && imagemPrincipal && (
                      <img
                        src={imagemPrincipal}
                        alt={imovel.property_title}
                        className="w-full h-full object-contain"
                      />
                    )}
                    {tipoMidiaSelecionada === "video" && videoPrincipal && (
                      <video
                        src={videoPrincipal}
                        controls
                        className="w-full h-full object-contain"
                      >
                        Seu navegador não suporta vídeos.
                      </video>
                    )}
                  </div>

                  <div className="p-4 bg-card">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-sm font-semibold text-foreground">
                        Galeria {isEditing && "(Arraste para reordenar)"}
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                          {imovel.images && imovel.images.map((img, idx) => (
                            <div
                              key={`img-${idx}`}
                              className="relative"
                              draggable={isEditing}
                              onDragStart={() => handleImageDragStart(idx)}
                              onDragOver={(e) => handleImageDragOver(e, idx)}
                              onDrop={(e) => handleImageDrop(e, idx)}
                            >
                              <button
                                onClick={() => handleSelecionarImagem(img.url)}
                                className={`relative h-20 w-full rounded-lg overflow-hidden border-2 transition-all ${
                                  imagemPrincipal === img.url && tipoMidiaSelecionada === "imagem"
                                    ? "border-primary"
                                    : "border-border"
                                } ${isEditing ? "cursor-move" : ""}`}
                              >
                                <img
                                  src={img.url}
                                  alt={`Imagem ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                              {isEditing && (
                                <div className="absolute -top-2 -right-2">
                                  <button
                                    onClick={() => handleRemoveImage(img.url)}
                                    className="bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                                    title="Remover imagem"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}

                          {imovel.videos && imovel.videos.map((video, idx) => (
                            <div
                              key={`video-${idx}`}
                              className="relative"
                              draggable={isEditing}
                              onDragStart={() => handleVideoDragStart(idx)}
                              onDragOver={(e) => handleVideoDragOver(e, idx)}
                              onDrop={(e) => handleVideoDrop(e, idx)}
                            >
                              <button
                                onClick={() => handleSelecionarVideo(video.url)}
                                className={`relative h-20 w-full rounded-lg overflow-hidden border-2 transition-all ${
                                  videoPrincipal === video.url && tipoMidiaSelecionada === "video"
                                    ? "border-primary"
                                    : "border-border"
                                } ${isEditing ? "cursor-move" : ""}`}
                              >
                                <video
                                  src={video.url}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                  <Play className="h-8 w-8 text-white" />
                                </div>
                              </button>
                              {isEditing && (
                                <div className="absolute -top-2 -right-2">
                                  <button
                                    onClick={() => handleRemoveVideo(video.url)}
                                    className="bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                                    title="Remover vídeo"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {isEditing && (
                        <div className="flex flex-col gap-3 w-48">
                          <div>
                            <label className="block text-xs font-semibold text-foreground mb-2">
                              Adicionar Fotos
                            </label>
                            <label
                              htmlFor="new-foto"
                              className="flex items-center justify-center gap-2 h-10 bg-background border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                            >
                              <Upload className="w-4 h-4 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                Selecionar
                              </span>
                            </label>
                            <input
                              id="new-foto"
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleNewPhotoChange}
                              className="hidden"
                            />
                            {newPhotoPreviews.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {newPhotoPreviews.map((src, index) => (
                                  <div key={index} className="relative">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedNewPhotoIndex(index)}
                                      className="w-16 h-16 rounded-lg border border-border overflow-hidden cursor-pointer hover:border-primary transition-colors"
                                    >
                                      <img
                                        src={src}
                                        alt={`Nova foto ${index + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveNewPhoto(index)}
                                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-foreground mb-2">
                              Adicionar Vídeos
                            </label>
                            <label
                              htmlFor="new-video"
                              className="flex items-center justify-center gap-2 h-10 bg-background border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                            >
                              <Upload className="w-4 h-4 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                Selecionar
                              </span>
                            </label>
                            <input
                              id="new-video"
                              type="file"
                              accept="video/*"
                              multiple
                              onChange={handleNewVideoChange}
                              className="hidden"
                            />
                            {newVideoPreviews.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {newVideoPreviews.map((src, index) => (
                                  <div key={index} className="relative">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedNewVideoIndex(index)}
                                      className="w-16 h-16 rounded-lg border border-border overflow-hidden cursor-pointer hover:border-primary transition-colors bg-black"
                                    >
                                      <video
                                        src={src}
                                        className="w-full h-full object-cover"
                                      />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveNewVideo(index)}
                                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )}

              {!hasMediaContent && isEditing && (
                <Card className="overflow-hidden shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-4">
                          Este imóvel ainda não possui imagens ou vídeos...
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 w-48">
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-2">
                            Adicionar Fotos
                          </label>
                          <label
                            htmlFor="new-foto"
                            className="flex items-center justify-center gap-2 h-10 bg-background border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                          >
                            <Upload className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Selecionar
                            </span>
                          </label>
                          <input
                            id="new-foto"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleNewPhotoChange}
                            className="hidden"
                          />
                          {newPhotoPreviews.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {newPhotoPreviews.map((src, index) => (
                                <div key={index} className="relative">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedNewPhotoIndex(index)}
                                    className="w-16 h-16 rounded-lg border border-border overflow-hidden cursor-pointer hover:border-primary transition-colors"
                                  >
                                    <img
                                      src={src}
                                      alt={`Nova foto ${index + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveNewPhoto(index)}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-2">
                            Adicionar Vídeos
                          </label>
                          <label
                            htmlFor="new-video"
                            className="flex items-center justify-center gap-2 h-10 bg-background border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                          >
                            <Upload className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Selecionar
                            </span>
                          </label>
                          <input
                            id="new-video"
                            type="file"
                            accept="video/*"
                            multiple
                            onChange={handleNewVideoChange}
                            className="hidden"
                          />
                          {newVideoPreviews.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {newVideoPreviews.map((src, index) => (
                                <div key={index} className="relative">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedNewVideoIndex(index)}
                                    className="w-16 h-16 rounded-lg border border-border overflow-hidden cursor-pointer hover:border-primary transition-colors bg-black"
                                  >
                                    <video
                                      src={src}
                                      className="w-full h-full object-cover"
                                    />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveNewVideo(index)}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedNewPhotoIndex !== null && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedNewPhotoIndex(null)}>
                  <div className="relative w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedNewPhotoIndex(null)}
                      className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
                    >
                      <X className="w-8 h-8" />
                    </button>
                    <img
                      src={newPhotoPreviews[selectedNewPhotoIndex]}
                      alt="Visualização da nova foto"
                      className="w-full rounded-lg"
                    />
                  </div>
                </div>
              )}

              {selectedNewVideoIndex !== null && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedNewVideoIndex(null)}>
                  <div className="relative w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedNewVideoIndex(null)}
                      className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
                    >
                      <X className="w-8 h-8" />
                    </button>
                    <video
                      src={newVideoPreviews[selectedNewVideoIndex]}
                      className="w-full rounded-lg"
                      controls
                      autoPlay
                    />
                  </div>
                </div>
              )}

              <Card className="shadow-lg">
                <CardHeader className="border-b border-border">
                  {isEditing ? (
                    <input
                      type="text"
                      value={imovel.property_title}
                      onChange={(e) => handleInputChange('property_title', e.target.value)}
                      className="text-2xl md:text-3xl font-bold border-2 border-input bg-background text-foreground rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <CardTitle className="text-2xl md:text-3xl">
                      {imovel.property_title}
                    </CardTitle>
                  )}
                  {isEditing ? (
                    <textarea
                      value={imovel.property_detail}
                      onChange={(e) => handleInputChange('property_detail', e.target.value)}
                      className="text-muted-foreground text-sm mt-2 border-2 border-input bg-background text-foreground rounded px-2 py-1 w-full min-h-20"
                    />
                  ) : (
                    <p className="text-muted-foreground text-sm mt-2">
                      {imovel.property_detail}
                    </p>
                  )}
                </CardHeader>

                <CardContent className="pt-6 space-y-6">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Bed className="h-5 w-5 text-muted-foreground" />
                      {isEditing ? (
                        <input
                          type="number"
                          value={imovel.property_bedrooms}
                          onChange={(e) => handleInputChange('property_bedrooms', e.target.value)}
                          className="w-16 border-2 border-input bg-background text-foreground rounded px-2 py-1"
                        />
                      ) : (
                        <span className="font-semibold">
                          {imovel.property_bedrooms}
                        </span>
                      )}
                      <span className="text-muted-foreground">
                        {parseInt(imovel.property_bedrooms) > 1
                          ? "Quartos"
                          : "Quarto"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Bath className="h-5 w-5 text-muted-foreground" />
                      {isEditing ? (
                        <input
                          type="number"
                          value={imovel.property_bathrooms}
                          onChange={(e) => handleInputChange('property_bathrooms', e.target.value)}
                          className="w-16 border-2 border-input bg-background text-foreground rounded px-2 py-1"
                        />
                      ) : (
                        <span className="font-semibold">
                          {imovel.property_bathrooms}
                        </span>
                      )}
                      <span className="text-muted-foreground">
                        {parseInt(imovel.property_bathrooms) > 1
                          ? "Banheiros"
                          : "Banheiro"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Car className="h-5 w-5 text-muted-foreground" />
                      {isEditing ? (
                        <input
                          type="number"
                          value={imovel.property_garage_spaces}
                          onChange={(e) => handleInputChange('property_garage_spaces', e.target.value)}
                          className="w-16 border-2 border-input bg-background text-foreground rounded px-2 py-1"
                        />
                      ) : (
                        <span className="font-semibold">
                          {imovel.property_garage_spaces}
                        </span>
                      )}
                      <span className="text-muted-foreground">
                        {parseInt(imovel.property_garage_spaces) > 1
                          ? "Vagas"
                          : "Vaga"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Ruler className="h-5 w-5 text-muted-foreground" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={imovel.property_area_sqm}
                          onChange={(e) => handleInputChange('property_area_sqm', e.target.value)}
                          className="w-24 border-2 border-input bg-background text-foreground rounded px-2 py-1"
                        />
                      ) : (
                        <span className="font-semibold">
                          {imovel.property_area_sqm}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                      <div className="flex-1">
                        <p className="font-semibold">Localização</p>
                        {isEditing ? (
                          <div className="space-y-2 mt-2">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Rua"
                                value={imovel.property_street}
                                onChange={(e) => handleInputChange('property_street', e.target.value)}
                                className="flex-1 border-2 border-input bg-background text-foreground rounded px-2 py-1 text-sm"
                              />
                              <input
                                type="text"
                                placeholder="Número"
                                value={imovel.property_street_number}
                                onChange={(e) => handleInputChange('property_street_number', e.target.value)}
                                className="w-24 border-2 border-input bg-background text-foreground rounded px-2 py-1 text-sm"
                              />
                            </div>
                            <input
                              type="text"
                              placeholder="Bairro"
                              value={imovel.property_neighborhood}
                              onChange={(e) => handleInputChange('property_neighborhood', e.target.value)}
                              className="w-full border-2 border-input bg-background text-foreground rounded px-2 py-1 text-sm"
                            />
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Cidade"
                                value={imovel.property_city}
                                onChange={(e) => handleInputChange('property_city', e.target.value)}
                                className="flex-1 border-2 border-input bg-background text-foreground rounded px-2 py-1 text-sm"
                              />
                              <input
                                type="text"
                                placeholder="CEP"
                                value={imovel.property_postal_code}
                                onChange={(e) => handleInputChange('property_postal_code', e.target.value)}
                                className="w-32 border-2 border-input bg-background text-foreground rounded px-2 py-1 text-sm"
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-muted-foreground">
                              {imovel.property_street}, {imovel.property_street_number}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {imovel.property_neighborhood},{" "}
                              {imovel.property_city} - CEP{" "}
                              {imovel.property_postal_code}
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <p className="font-semibold">Tipo de Imóvel</p>
                        {isEditing ? (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {allPropertyTypes.length > 0 ? (
                              allPropertyTypes.map((pt) => (
                                <button
                                  key={pt.id}
                                  type="button"
                                  onClick={() => togglePropertyType(pt.id)}
                                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                    selectedPropertyTypeIds.includes(pt.id)
                                      ? "bg-purple-600 text-white"
                                      : "bg-muted text-foreground hover:bg-muted/80"
                                  }`}
                                >
                                  {pt.property_type_emoji && (
                                    <span className="mr-1">{pt.property_type_emoji}</span>
                                  )}
                                  {pt.property_type_name}
                                </button>

                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">Nenhum tipo disponível</p>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {imovel.property_types && imovel.property_types.length > 0 ? (
                              imovel.property_types.map((pt) => (
                                <span
                                  key={pt.property_type_id || pt.id}
                                  className="px-3 py-1 bg-muted text-foreground rounded-full text-sm font-medium"
                                >
                                  {pt.property_type_emoji && (
                                    <span className="mr-1">{pt.property_type_emoji}</span>
                                  )}
                                  {pt.property_type_name}
                                </span>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">-</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="font-semibold mb-3">Características</p>
                    {isEditing ? (
                      <div className="flex flex-wrap gap-2">
                        {allCategories.length > 0 ? (
                          allCategories.map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => toggleCategory(cat.id)}
                              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                selectedCategoryIds.includes(cat.id)
                                  ? "bg-blue-600 text-white"
                                  : "bg-muted text-foreground hover:bg-muted/80"
                              }`}
                            >
                              {cat.category_emoji && (
                                <span className="mr-1">{cat.category_emoji}</span>
                              )}
                              {cat.category_name}
                            </button>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">Nenhuma característica disponível</p>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {imovel.categories && imovel.categories.length > 0 ? (
                          imovel.categories.map((cat) => (
                            <span
                              key={cat.category_id || cat.id}
                              className="px-3 py-1 bg-muted text-foreground rounded-full text-sm font-medium"
                            >
                              {cat.category_emoji && (
                                <span className="mr-1">{cat.category_emoji}</span>
                              )}
                              {cat.category_name}
                            </span>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">Nenhuma característica selecionada</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="font-semibold mb-3">Comodidades</p>
                    {isEditing ? (
                      <div className="flex flex-wrap gap-2">
                        {allAmenities.length > 0 ? (
                          allAmenities.map((amenity) => (
                            <button
                              key={amenity.id}
                              type="button"
                              onClick={() => toggleAmenity(amenity.id)}
                              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                selectedAmenityIds.includes(amenity.id)
                                  ? "bg-green-600 text-white"
                                  : "bg-muted text-foreground hover:bg-muted/80"
                              }`}
                            >
                              {amenity.amenitie_emoji && (
                                <span className="mr-1">{amenity.amenitie_emoji}</span>
                              )}
                              {amenity.amenitie_name}
                            </button>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">Nenhuma comodidade disponível</p>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {imovel.amenities && imovel.amenities.length > 0 ? (
                          imovel.amenities.map((amenity) => (
                            <span
                              key={amenity.amenitie_id || amenity.id}
                              className="px-3 py-1 bg-muted text-foreground rounded-full text-sm font-medium"
                            >
                              {amenity.amenitie_emoji && (
                                <span className="mr-1">{amenity.amenitie_emoji}</span>
                              )}
                              {amenity.amenitie_name}
                            </span>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">Nenhuma comodidade selecionada</p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24 shadow-lg">
                <CardHeader className="border-b border-border bg-muted/50">
                  <CardTitle className="text-lg">Outras Informações</CardTitle>
                </CardHeader>

                <CardContent className="pt-6 space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Preço</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={imovel.property_price}
                        onChange={(e) => handleInputChange('property_price', e.target.value)}
                        className="text-2xl font-bold text-green-600 border-2 border-input bg-background text-foreground rounded px-2 py-1 w-full"
                        placeholder="0,00"
                      />
                    ) : (
                      <p className="text-3xl font-bold text-green-600">
                        R$ {formatPrice(imovel.property_price)}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-border pt-4 space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Preço Negociação</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={imovel.property_negociation_price || ""}
                          onChange={(e) => handleInputChange('property_negociation_price', e.target.value)}
                          className="text-lg font-semibold border-2 border-input bg-background text-foreground rounded px-2 py-1 w-full"
                          placeholder="0,0"
                        />
                      ) : (
                        imovel.property_negociation_price && (
                          <p className="text-lg font-semibold text-muted-foreground">
                            R$ {imovel.property_negociation_price}
                          </p>
                        )
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Preço Condomínio</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={imovel.property_condo_price || ""}
                          onChange={(e) => handleInputChange('property_condo_price', e.target.value)}
                          className="text-lg font-semibold border-2 border-input bg-background text-foreground rounded px-2 py-1 w-full"
                          placeholder="0,00"
                        />
                      ) : (
                        imovel.property_condo_price && (
                          <p className="text-lg font-semibold text-muted-foreground">
                            R$ {formatPrice(imovel.property_condo_price)}
                          </p>
                        )
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Preço Aluguel</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={imovel.property_rental_price || ""}
                          onChange={(e) => handleInputChange('property_rental_price', e.target.value)}
                          className="text-lg font-semibold border-2 border-input bg-background text-foreground rounded px-2 py-1 w-full"
                          placeholder="0,00"
                        />
                      ) : (
                        imovel.property_rental_price && (
                          <p className="text-lg font-semibold text-muted-foreground">
                            R$ {formatPrice(imovel.property_rental_price)}
                          </p>
                        )
                      )}
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-sm text-muted-foreground mb-2">Status</p>
                    {isEditing ? (
                      <select
                        value={imovel.property_status}
                        onChange={(e) => handleInputChange('property_status', e.target.value)}
                        className="w-full border-2 border-input bg-background text-foreground rounded px-3 py-2 text-sm font-semibold"
                      >
                        <option value="active">Ativo</option>
                        <option value="inactive">Inativo</option>
                        <option value="pending">Pendente</option>
                        <option value="authorized">Autorizado</option>
                      </select>
                    ) : (
                      <span className="inline-block px-3 py-1 bg-muted text-foreground border border-border rounded-full text-sm font-semibold">
                        {getStatusLabel(imovel.property_status, isClient)}
                      </span>
                    )}
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-sm text-muted-foreground mb-2">Criado por</p>
                    {isClient ? (
                      <div className="flex items-start gap-2">
                        <User className="h-5 w-5 text-muted-foreground mt-1" />
                        <div>
                          <p className="font-semibold text-foreground">{imovel.client_name}</p>
                          <p className="text-sm text-muted-foreground">{imovel.client_email}</p>
                          <p className="text-sm text-muted-foreground">{imovel.client_phone}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold text-foreground">Admin</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border pt-4 space-y-3 mt-6">
                    {isEditing ? (
                      <>
                        <Button
                          className="w-full"
                          size="lg"
                          onClick={handleSaveChanges}
                          disabled={isSaving}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {isSaving ? 'Salvando...' : 'Salvar'}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          size="lg"
                          onClick={handleCancelEdit}
                          disabled={isSaving}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <Button className="w-full" size="lg" onClick={handleEditClick}>
                        Editar Imóvel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
