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
import { PlusCircle, Trash2, Eye, XCircle, User, Shield } from "lucide-react";
import ModalCadastroImovel from "@/components/ModalCadastroImovel";
import { useIsMobile } from "@/hooks/use-mobile";
import { getPropertyFromWebhook } from "@/hooks/Admin/PropertyService";
import { removeProperty } from "@/hooks/Admin/RemoveProperty";

const Header = lazy(() => import("@/components/Header"));
const Footer = lazy(() => import("@/components/Footer"));

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

interface Image {
  url: string;
  is_cover: string;
  position: string;
}

interface Property {
  id: number;
  property_title: string;
  property_type: string;
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
  property_negociation: string;
  property_status: string;
  property_created_by: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  categories: Category[];
  amenities: Amenity[];
  images: Image[];
}

interface WebhookResponse {
  properties: Property[];
  categories: Category[];
  amenities: Amenity[];
}

export default function CadastroImoveis() {
  const [imoveis, setImoveis] = useState<Property[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [busca, setBusca] = useState("");
  const [selecionados, setSelecionados] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false); // Novo estado para controle
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  async function carregarImoveis() {
    try {
      console.log("[CadastroImoveis] 🔄 Carregando imóveis...");
      const retorno: WebhookResponse[] | null = await getPropertyFromWebhook();
      console.log("[CadastroImoveis] 📌 Retorno recebido:", retorno);

      if (retorno && retorno.length > 0) {
        if (retorno[0].properties) {
          setImoveis(retorno[0].properties);
          console.log(`[CadastroImoveis] ✅ ${retorno[0].properties.length} imóveis carregados`);
        } else {
          setImoveis([]);
          console.log("[CadastroImoveis] ⚠️ Nenhuma propriedade encontrada");
        }

        if (retorno[0].amenities) {
          setAmenities(retorno[0].amenities);
          console.log(`[CadastroImoveis] ✅ ${retorno[0].amenities.length} amenities carregadas`);
        } else {
          setAmenities([]);
        }

        if (retorno[0].categories) {
          setCategories(retorno[0].categories);
          console.log(`[CadastroImoveis] ✅ ${retorno[0].categories.length} categorias carregadas`);
        } else {
          setCategories([]);
        }
      } else {
        setImoveis([]);
        setAmenities([]);
        setCategories([]);
        console.log("[CadastroImoveis] ⚠️ Retorno vazio ou nulo");
      }
    } catch (error) {
      console.error("[CadastroImoveis] ❌ Erro ao carregar imóveis:", error);
    } finally {
      setIsInitialized(true); // Marca como inicializado após a tentativa
    }
  }

  useEffect(() => {
    // Aguarda um pequeno delay para garantir que a UI foi renderizada
    const timer = setTimeout(() => {
      if (!isInitialized) {
        console.log("[CadastroImoveis] 🚀 Iniciando carregamento após renderização...");
        carregarImoveis();
      }
    }, 100); // Delay de 100ms para garantir renderização completa

    return () => clearTimeout(timer);
  }, [isInitialized]);

  const handleSelect = (id: number) => {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleExcluirSelecionados = async () => {
    if (selecionados.length === 0)
      return alert("Selecione ao menos um imóvel!");
    setConfirmDelete(true);
  };

  const confirmarExclusao = async () => {
    console.log(`[CadastroImoveis] 🗑️ Excluindo ${selecionados.length} imóveis...`);
    
    for (const propertyId of selecionados) {
      await removeProperty(propertyId);
    }

    // Atualiza estado local imediatamente para feedback visual
    setImoveis((prev) => prev.filter((i) => !selecionados.includes(i.id)));
    setSelecionados([]);
    
    // Recarrega os dados para garantir sincronização
    await carregarImoveis();
    setConfirmDelete(false);
    
    console.log(`[CadastroImoveis] ✅ ${selecionados.length} imóveis excluídos`);
  };

  const handleAbrirDetalhes = (imovel: Property) => {
    navigate(`/detalhe-imovel/${imovel.id}`, {
      state: {
        imovel,
        allAmenities: amenities,
        allCategories: categories
      }
    });
  };

  const formatPrice = (priceString: string | number) => {
    if (!priceString) return "0,00";

    const priceStr = String(priceString);

    if (priceStr.includes('.') && priceStr.includes(',')) {
      return priceStr;
    }

    const cleanPrice = priceStr.replace(/\D/g, '');

    if (!cleanPrice) return "0,00";

    const numericValue = parseInt(cleanPrice, 10);

    const formatted = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericValue / 100);

    return formatted;
  };

  const isCreatedByClient = (imovel: Property): boolean => {
    return imovel.client_name !== "admin" &&
           imovel.client_phone !== "admin" &&
           imovel.client_email !== "admin";
  };

  const getStatusBadge = (status: string, createdByClient: boolean) => {
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
    const isClient = isCreatedByClient(imovel);

    if (isClient) {
      return (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-600" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">{imovel.client_name}</span>
            <span className="text-xs text-gray-500">{imovel.client_email}</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Admin</span>
        </div>
      );
    }
  };

  const imoveisFiltrados = imoveis.filter((i) =>
    i.property_title?.toLowerCase().includes(busca.toLowerCase())
  );

  // Mostrar loading enquanto não inicializado
  if (!isInitialized) {
    return (
      <div className="min-h-screen w-full bg-zinc-700 text-zinc-100">
        <Suspense fallback={<div className="h-20 bg-background" />}>
          <Header />
        </Suspense>
        
        <div className="container mx-auto px-4 py-10 lg:py-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto"></div>
            <p className="mt-4 text-zinc-200">Carregando imóveis...</p>
            <p className="text-sm text-zinc-400 mt-2">Aguarde enquanto os dados são carregados</p>
          </div>
        </div>
        
        <Suspense fallback={<div className="h-20 bg-background" />}>
          <Footer />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-zinc-700 text-zinc-100">
      <Suspense fallback={<div className="h-20 bg-background" />}>
        <Header />
      </Suspense>

      <div className="container mx-auto px-4 py-10 lg:py-16 animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
            <span className="text-zinc-100">Cadastro de</span>{" "}
            <span className="text-emerald-400">Imóveis</span>
          </h1>
          <p className="text-zinc-200 mt-2 text-sm lg:text-base">
            Gerencie anúncios, valores, disponibilidade e detalhes dos imóveis.
          </p>
          <div className="mt-4 text-sm text-zinc-400">
            Total de imóveis: {imoveis.length} | 
            Categorias: {categories.length} | 
            Amenidades: {amenities.length}
          </div>
        </div>

        <div
          className={`flex ${
            isMobile ? "flex-col gap-3" : "justify-between items-center"
          } mb-8`}
        >
          <Input
            placeholder="Buscar imóvel..."
            className={`${
              isMobile ? "w-full" : "w-72"
            } bg-zinc-200 text-black border border-zinc-400 placeholder-zinc-600`}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          <div
            className={`flex ${
              isMobile ? "flex-col gap-2 w-full" : "flex-row gap-2"
            }`}
          >
            <Button
              onClick={() => setShowModal(true)}
              className={`bg-emerald-500 hover:bg-emerald-600 ${
                isMobile && "w-full"
              }`}
            >
              <PlusCircle className="mr-2 h-5 w-5" /> Novo Imóvel
            </Button>

            {selecionados.length > 0 && (
              <Button
                variant="destructive"
                className={isMobile ? "w-full" : ""}
                onClick={handleExcluirSelecionados}
              >
                <Trash2 className="mr-2 h-5 w-5" />
                Excluir ({selecionados.length})
              </Button>
            )}
          </div>
        </div>

        {!isMobile && (
          <div className="w-full bg-zinc-600 text-zinc-100 rounded-lg shadow border border-zinc-500">
            <Table>
              <TableHeader className="bg-zinc-500 border-b border-zinc-400">
                <TableRow>
                  <TableHead className="w-12 text-center text-black">Sel.</TableHead>
                  <TableHead className="text-black">ID</TableHead>
                  <TableHead className="text-black">Título</TableHead>
                  <TableHead className="text-black">Negociação</TableHead>
                  <TableHead className="text-black">Valor</TableHead>
                  <TableHead className="text-black">Status</TableHead>
                  <TableHead className="text-black">Criado Por</TableHead>
                  <TableHead className="text-center text-black">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {imoveisFiltrados.length > 0 ? (
                  imoveisFiltrados.map((imovel) => {
                    const isClient = isCreatedByClient(imovel);

                    return (
                      <TableRow
                        key={imovel.id}
                        className={`hover:bg-zinc-500/40 transition ${
                          selecionados.includes(imovel.id)
                            ? "bg-zinc-500/60"
                            : ""
                        }`}
                      >
                        <TableCell className="text-center">
                          <input
                            type="checkbox"
                            checked={selecionados.includes(imovel.id)}
                            onChange={() => handleSelect(imovel.id)}
                            className="accent-emerald-500 h-4 w-4"
                          />
                        </TableCell>

                        <TableCell>{imovel.id}</TableCell>
                        <TableCell className="font-semibold">
                          {imovel.property_title}
                        </TableCell>
                        <TableCell className="capitalize">
                          {imovel.property_negociation || "-"}
                        </TableCell>
                        <TableCell className="font-medium text-emerald-300">
                          R$ {formatPrice(imovel.property_price)}
                        </TableCell>

                        <TableCell>
                          {getStatusBadge(imovel.property_status, isClient)}
                        </TableCell>

                        <TableCell>
                          {getCreatedByBadge(imovel)}
                        </TableCell>

                        <TableCell className="text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-zinc-400 text-black"
                            onClick={() => handleAbrirDetalhes(imovel)}
                          >
                            <Eye className="h-4 w-4 mr-1" /> Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-6 text-zinc-300"
                    >
                      {busca ? "Nenhum imóvel encontrado com essa busca." : "Nenhum imóvel cadastrado."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {isMobile && (
          <div className="space-y-4">
            {imoveisFiltrados.length > 0 ? (
              imoveisFiltrados.map((imovel) => {
                const coverImage = imovel.images?.find(img => img.is_cover === "true");
                const isClient = isCreatedByClient(imovel);

                return (
                  <div
                    key={imovel.id}
                    className={`border rounded-xl p-4 shadow-md bg-zinc-600 border-zinc-400 ${
                      selecionados.includes(imovel.id)
                        ? "border-emerald-400"
                        : "border-zinc-400"
                    }`}
                  >
                    {coverImage && (
                      <div className="mb-3 rounded-lg overflow-hidden">
                        <img
                          src={coverImage.url}
                          alt={imovel.property_title}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}

                    <div className="flex justify-between items-center mb-2">
                      <h2 className="font-semibold text-lg text-zinc-100">
                        {imovel.property_title}
                      </h2>
                      <input
                        type="checkbox"
                        checked={selecionados.includes(imovel.id)}
                        onChange={() => handleSelect(imovel.id)}
                        className="accent-emerald-400"
                      />
                    </div>

                    <p>
                      <strong className="text-zinc-200">Negociação:</strong>{" "}
                      {imovel.property_negociation}
                    </p>

                    <p>
                      <strong className="text-zinc-200">Valor:</strong>{" "}
                      R$ {formatPrice(imovel.property_price)}
                    </p>

                    <p>
                      <strong className="text-zinc-200">Status:</strong>{" "}
                      {getStatusBadge(imovel.property_status, isClient)}
                    </p>

                    <div className="mb-3 mt-2">
                      <strong className="text-zinc-200">Criado por:</strong>
                      <div className="mt-1">
                        {getCreatedByBadge(imovel)}
                      </div>
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

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3 border-zinc-400 text-zinc-100"
                      onClick={() => handleAbrirDetalhes(imovel)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> Ver detalhes
                    </Button>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-zinc-200 text-lg">
                  {busca ? "Nenhum imóvel encontrado com essa busca." : "Nenhum imóvel cadastrado."}
                </p>
                <Button
                  onClick={() => setShowModal(true)}
                  className="mt-4 bg-emerald-500 hover:bg-emerald-600"
                >
                  <PlusCircle className="mr-2 h-5 w-5" /> Cadastrar Primeiro Imóvel
                </Button>
              </div>
            )}
          </div>
        )}

        <ModalCadastroImovel
          open={showModal}
          onClose={() => setShowModal(false)}
          onSave={carregarImoveis}
          amenities={amenities}
          categories={categories}
        />

        {confirmDelete && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-zinc-600 border border-zinc-400 text-zinc-100 rounded-2xl shadow-xl p-6 w-[90%] max-w-md text-center">
              <XCircle className="text-red-400 w-12 h-12 mx-auto mb-3" />

              <h2 className="text-xl font-semibold mb-2">
                Confirmar exclusão
              </h2>

              <p className="text-zinc-200 mb-6">
                Tem certeza que deseja excluir {selecionados.length} imóvel(es) selecionado(s)?
                Esta ação não pode ser desfeita.
              </p>

              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  className="border-zinc-400 text-zinc-100"
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancelar
                </Button>

                <Button variant="destructive" onClick={confirmarExclusao}>
                  Excluir {selecionados.length} imóvel(es)
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Suspense fallback={<div className="h-20 bg-background" />}>
        <Footer />
      </Suspense>
    </div>
  );
}