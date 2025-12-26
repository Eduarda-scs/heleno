import { useEffect, useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Trash2, Eye, User, Shield, ChevronLeft, ChevronRight, Image as ImageIcon, Filter } from "lucide-react";
import ModalCadastroImovel from "@/components/ModalCadastroImovel";
import { useIsMobile } from "@/hooks/use-mobile";
import { getPropertyFromWebhook, getUniquePropertyFromWebhook } from "@/hooks/Admin/PropertyService";
import { removeProperty } from "@/hooks/Admin/RemoveProperty";
import { useToast } from "@/components/ui/use-toast";

const Header = lazy(() => import("@/components/Header"));

interface Amenity {
  id: number;
  amenitie_name: string;
  amenitie_description: string | null;
  amenitie_color: string | null;
  amenitie_emoji: string | null;
}

interface Category {
  id: number;
  category_name: string;
  category_description: string | null;
  category_color: string | null;
  category_emoji: string | null;
}

interface PropertyType {
  id: number;
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
}

export default function CadastroImoveis() {
  const [imoveis, setImoveis] = useState<Property[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [busca, setBusca] = useState("");
  const [filtroCriadoPor, setFiltroCriadoPor] = useState<string>("todos");
  const [selecionados, setSelecionados] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoadingProperties, setIsLoadingProperties] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  async function carregarImoveis(page: number = 1, limit: number = 5) {
    setIsLoadingProperties(true);
    try {
      const retorno = await getPropertyFromWebhook(page, limit);
      console.log("[Cadastroimoveis] 📌 Retorno:", retorno);

      if (retorno) {
        if (retorno.properties) {
          setImoveis(retorno.properties);
        } else {
          setImoveis([]);
        }

        if (retorno.amenities) {
          setAmenities(retorno.amenities);
        } else {
          setAmenities([]);
        }

        if (retorno.categories) {
          setCategories(retorno.categories);
        } else {
          setCategories([]);
        }

        if (retorno.property_types) {
          setPropertyTypes(retorno.property_types);
        } else {
          setPropertyTypes([]);
        }

        setTotalPages(retorno.total_pages || 1);
        setTotalItems(retorno.total_items || 0);
        setCurrentPage(retorno.page || page);
      } else {
        setImoveis([]);
        setAmenities([]);
        setCategories([]);
        setPropertyTypes([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Erro ao carregar imóveis:", error);
      setImoveis([]);
      setAmenities([]);
      setCategories([]);
      setPropertyTypes([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setIsLoadingProperties(false);
      if (!isInitialized) setIsInitialized(true);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isInitialized) {
        carregarImoveis(1, itemsPerPage);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isInitialized]);

  const handleSelect = (id: number) => {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleExcluirSelecionados = async () => {
    if (selecionados.length === 0) {
      toast({
        title: "Atenção",
        description: "Selecione ao menos um imóvel!",
        variant: "destructive",
      });
      return;
    }

    for (const propertyId of selecionados) {
      await removeProperty(propertyId);
    }

    setImoveis((prev) => prev.filter((i) => !selecionados.includes(i.id)));

    toast({
      title: "Imóveis excluídos com sucesso!",
      description: `${selecionados.length} ${selecionados.length === 1 ? 'imóvel foi excluído' : 'imóveis foram excluídos'}.`,
    });

    setSelecionados([]);

    carregarImoveis(currentPage, itemsPerPage);
  };

  const handleAbrirDetalhes = async (imovel: Property) => {
    try {
      console.log(`[Cadastroimoveis] 🚀 Clicou em Detalhes do imóvel ${imovel.id}`);

      console.log('📤 Enviando dados completos do imóvel para webhook/uniqueITEM:', imovel);

      const uniquePropertyData = await getUniquePropertyFromWebhook(imovel);

      if (uniquePropertyData) {
        console.log('✅ Dados recebidos do webhook/uniqueITEM:', uniquePropertyData);

        navigate(`/admin/detalhes-imovel/${imovel.id}`, {
          state: {
            imovel: uniquePropertyData,
            allAmenities: amenities,
            allCategories: categories,
            allPropertyTypes: propertyTypes
          }
        });
      } else {
        console.error('❌ Não foi possível obter dados do webhook/uniqueITEM - usando dados locais');

        navigate(`/admin/detalhes-imovel/${imovel.id}`, {
          state: {
            imovel,
            allAmenities: amenities,
            allCategories: categories,
            allPropertyTypes: propertyTypes
          }
        });
      }
    } catch (error) {
      console.error('❌ Erro ao buscar dados únicos:', error);

      navigate(`/admin/detalhes-imovel/${imovel.id}`, {
        state: {
          imovel,
          allAmenities: amenities,
          allCategories: categories,
          allPropertyTypes: propertyTypes
        }
      });
    }
  };

  const formatPrice = (priceString: string) => {
    if (!priceString) return "0,00";

    if (priceString.includes('.') && priceString.includes(',')) {
      return priceString;
    }

    const cleanPrice = priceString.replace(/\D/g, '');

    if (!cleanPrice) return "0,00";

    const numericValue = parseInt(cleanPrice, 10);

    const formatted = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericValue / 100);

    return formatted;
  };

  const getCriadoPorTipo = (imovel: Property): string => {
    if (imovel.property_created_by) {
      return imovel.property_created_by;
    }

    if (imovel.client_name !== "admin" &&
        imovel.client_phone !== "admin" &&
        imovel.client_email !== "admin") {
      return "client";
    }

    return "admin";
  };

  const getStatusBadge = (status: string, criadoPor: string) => {
    const statusConfig = {
      authorized: { label: "Autorizado", className: "bg-gray-100 text-gray-700 border-gray-300" },
      inactive: { label: "Inativo", className: "bg-gray-100 text-gray-700 border-gray-300" },
      pending: { label: "Pendente", className: "bg-gray-100 text-gray-700 border-gray-300" },
      active: { label: "Ativo", className: "bg-gray-100 text-gray-700 border-gray-300" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      className: "bg-gray-100 text-gray-700 border-gray-300"
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const getCreatedByBadge = (imovel: Property) => {
    const criadoPor = getCriadoPorTipo(imovel);

    switch (criadoPor) {
      case "admin":
        return (
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-600" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">Admin</span>
              <span className="text-xs text-gray-500">Administrador</span>
            </div>
          </div>
        );

      case "api":
        return (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 flex items-center justify-center bg-purple-100 rounded">
              <span className="text-xs font-bold text-purple-600">API</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">API Integration</span>
              <span className="text-xs text-gray-500">DWV Platform</span>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-600" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">{imovel.client_name}</span>
              <span className="text-xs text-gray-500">{imovel.client_email}</span>
            </div>
          </div>
        );
    }
  };

  const getFirstImage = (imovel: Property) => {
    if (imovel.images && imovel.images.length > 0) {
      return imovel.images[0].url;
    }
    return null;
  };

  const getPropertyTypesDisplay = (imovel: Property) => {
    if (imovel.property_types && imovel.property_types.length > 0) {
      return imovel.property_types.map(pt => pt.property_type_name).join(", ");
    }
    return "-";
  };

  const imoveisFiltrados = imoveis.filter((i) => {
    const buscaMatch = i.property_title?.toLowerCase().includes(busca.toLowerCase());

    const criadoPor = getCriadoPorTipo(i);
    const criadoPorMatch = filtroCriadoPor === "todos" || criadoPor === filtroCriadoPor;

    return buscaMatch && criadoPorMatch;
  });

  const goToNextPage = () => {
    if (currentPage < totalPages && !isLoadingProperties) {
      carregarImoveis(currentPage + 1, itemsPerPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1 && !isLoadingProperties) {
      carregarImoveis(currentPage - 1, itemsPerPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    carregarImoveis(1, newItemsPerPage);
  };

  const handleModalSave = () => {
    carregarImoveis(currentPage, itemsPerPage);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="h-20 w-full" />}>
        <Header />
      </Suspense>
      <div className="pt-28 md:pt-32 p-4 md:p-6 space-y-6">
        <div
          className={`flex ${
            isMobile ? "flex-col gap-3" : "justify-between items-center"
          }`}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left">
            Gestão de Imóveis
          </h1>

          <div
            className={`flex ${
              isMobile ? "flex-col gap-2 w-full" : "flex-row gap-2"
            }`}
          >
            <Input
              placeholder="Buscar imóvel..."
              className={`${isMobile ? "w-full" : "w-64"}`}
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <Button
              onClick={() => setShowModal(true)}
              className={`${isMobile ? "w-full" : ""}`}
            >
              <PlusCircle className="mr-2 h-5 w-5" /> Novo Imóvel
            </Button>
            {selecionados.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleExcluirSelecionados}
                className={`${isMobile ? "w-full" : ""}`}
              >
                <Trash2 className="mr-2 h-5 w-5" /> Excluir
              </Button>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold">Filtrar por</h3>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Criado por:</span>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filtroCriadoPor === "todos" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroCriadoPor("todos")}
                  className="hover:bg-[#07262d] hover:text-white"
                >
                  Todos
                </Button>
                <Button
                  variant={filtroCriadoPor === "admin" ? "default" : "outline"}
                  size="sm"
                  className="flex items-center gap-2 hover:bg-[#07262d] hover:text-white"
                  onClick={() => setFiltroCriadoPor("admin")}
                >
                  <Shield className="h-4 w-4" /> Admin
                </Button>
                <Button
                  variant={filtroCriadoPor === "api" ? "default" : "outline"}
                  size="sm"
                  className="flex items-center gap-2 bg-purple-50 text-purple-700 hover:bg-[#07262d] hover:text-white border-purple-200"
                  onClick={() => setFiltroCriadoPor("api")}
                >
                  <span className="font-bold">API</span> Sistema
                </Button>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2 text-sm text-gray-600">
              <span>Mostrando {imoveisFiltrados.length} de {totalItems} imóveis</span>
              {filtroCriadoPor !== "todos" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFiltroCriadoPor("todos")}
                  className="h-8 hover:bg-[#07262d] hover:text-white"
                >
                  Limpar filtro
                </Button>
              )}
            </div>
          </div>
        </div>

        {isLoadingProperties ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-xl text-muted-foreground">
              {currentPage > 1 ? `Carregando página ${currentPage}...` : "Carregando imóveis..."}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Aguarde enquanto buscamos os dados
            </p>
          </div>
        ) : (
          <>
            {!isMobile ? (
              <div className="rounded-md border border-border shadow-sm overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[50px] text-center">Sel.</TableHead>
                      <TableHead className="w-[80px]">Imagem</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Cidade</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Criado Por</TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {imoveisFiltrados.length > 0 ? (
                      imoveisFiltrados.map((imovel) => {
                        const criadoPor = getCriadoPorTipo(imovel);
                        const firstImage = getFirstImage(imovel);

                        return (
                          <TableRow
                            key={imovel.id}
                            className={`hover:bg-muted/30 ${
                              selecionados.includes(imovel.id) ? "bg-muted/50" : ""
                            }`}
                          >
                            <TableCell className="text-center">
                              <input
                                type="checkbox"
                                checked={selecionados.includes(imovel.id)}
                                onChange={() => handleSelect(imovel.id)}
                                className="accent-primary"
                              />
                            </TableCell>
                            <TableCell>
                              {firstImage ? (
                                <div className="w-12 h-12 rounded-md overflow-hidden border">
                                  <img
                                    src={firstImage}
                                    alt={`Imagem de ${imovel.property_title}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-12 h-12 rounded-md border border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                                  <ImageIcon className="h-5 w-5 text-gray-400" />
                                </div>
                              )}
                            </TableCell>
                            <TableCell>{imovel.id}</TableCell>
                            <TableCell className="font-semibold">
                              {imovel.property_title}
                            </TableCell>
                            <TableCell className="capitalize">
                              {getPropertyTypesDisplay(imovel)}
                            </TableCell>
                            <TableCell>
                              {imovel.property_city || "-"}
                            </TableCell>
                            <TableCell className="font-medium text-green-600">
                              R$ {formatPrice(imovel.property_price)}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(imovel.property_status, criadoPor)}
                            </TableCell>
                            <TableCell>
                              {getCreatedByBadge(imovel)}
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAbrirDetalhes(imovel)}
                                className="hover:bg-[#07262d] hover:text-white"
                              >
                                <Eye className="h-4 w-4 mr-1" /> Detalhes
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={10}
                          className="text-center text-muted-foreground py-6"
                        >
                          {totalItems === 0 ? (
                            "Nenhum imóvel cadastrado."
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <span>Nenhum imóvel encontrado com os filtros atuais.</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setFiltroCriadoPor("todos");
                                  setBusca("");
                                }}
                                className="hover:bg-[#07262d] hover:text-white"
                              >
                                Limpar filtros
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="space-y-4">
                {imoveisFiltrados.length > 0 ? (
                  imoveisFiltrados.map((imovel) => {
                    const firstImage = getFirstImage(imovel);
                    const criadoPor = getCriadoPorTipo(imovel);

                    return (
                      <div
                        key={imovel.id}
                        className={`border rounded-xl p-4 shadow-sm bg-white ${
                          selecionados.includes(imovel.id) ? "border-primary" : ""
                        }`}
                      >
                        {firstImage && (
                          <div className="mb-3 rounded-lg overflow-hidden">
                            <img
                              src={firstImage}
                              alt={imovel.property_title}
                              className="w-full h-48 object-cover"
                            />
                          </div>
                        )}

                        <div className="flex justify-between items-center mb-2">
                          <h2 className="font-semibold text-lg">{imovel.property_title}</h2>
                          <input
                            type="checkbox"
                            checked={selecionados.includes(imovel.id)}
                            onChange={() => handleSelect(imovel.id)}
                            className="accent-primary"
                          />
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Tipo:</strong> {getPropertyTypesDisplay(imovel)}
                        </p>

                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Cidade:</strong> {imovel.property_city}
                        </p>

                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Valor:</strong>{" "}
                          <span className="text-green-600 font-semibold">
                            R$ {formatPrice(imovel.property_price)}
                          </span>
                        </p>

                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Status:</strong>
                          </p>
                          {getStatusBadge(imovel.property_status, criadoPor)}
                        </div>

                        <div className="mb-3 pb-3 border-b">
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Criado por:</strong>
                          </p>
                          {getCreatedByBadge(imovel)}
                        </div>

                        {imovel.categories && imovel.categories.length > 0 && (
                          <div className="mb-3 flex flex-wrap gap-1">
                            {imovel.categories.map((cat) => (
                              <span
                                key={cat.id}
                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                              >
                                {cat.category_name}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-3 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAbrirDetalhes(imovel)}
                            className="w-full hover:bg-[#07262d] hover:text-white"
                          >
                            <Eye className="h-4 w-4 mr-1" /> Detalhes
                          </Button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-muted-foreground p-4 border rounded-lg bg-white">
                    {totalItems === 0 ? (
                      "Nenhum imóvel cadastrado."
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <span>Nenhum imóvel encontrado com os filtros atuais.</span>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setFiltroCriadoPor("todos");
                            setBusca("");
                          }}
                          className="hover:bg-[#07262d] hover:text-white"
                        >
                          Limpar filtros
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {totalItems > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Itens por página:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(e.target.value)}
                className="border rounded-md px-3 py-1 text-sm"
                disabled={isLoadingProperties}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {startIndex + 1}-{Math.min(endIndex, totalItems)} de {totalItems}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevPage}
                disabled={currentPage === 1 || isLoadingProperties}
                className="flex items-center gap-1 hover:bg-[#07262d] hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>

              <span className="text-sm text-gray-600 px-3">
                Página {currentPage} de {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages || isLoadingProperties}
                className="flex items-center gap-1 hover:bg-[#07262d] hover:text-white"
              >
                Próxima
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <ModalCadastroImovel
          open={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleModalSave}
          amenities={amenities}
          categories={categories}
          propertyTypes={propertyTypes}
        />
      </div>
    </div>
  );
}
