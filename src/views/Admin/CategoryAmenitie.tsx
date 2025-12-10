import { useEffect, useState, lazy, Suspense} from "react";
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
import { PlusCircle, Trash2, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useCategoryAmenitie } from "@/hooks/Admin/CategoryAmenitie";


const Header = lazy(() => import("@/components/Header"));

interface Category {
  id: number;
  category_name: string;
  category_description: string | null;
  category_color: string | null;
  category_emoji: string | null;
}

interface Amenitie {
  id: number;
  amenitie_name: string;
  amenitie_description: string | null;
  amenitie_color: string | null;
  amenitie_emoji: string | null;
}

interface PropertyType {
  id: number;
  property_type_name: string;
  property_type_description: string | null;
}

interface PropertyNegociation {
  id: number;
  property_negociation_name: string;
  property_negociation_description: string | null;
}

type TabType = "category" | "amenitie" | "property_type" | "property_negociation";

export default function CategoryAmenitie() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [amenities, setAmenities] = useState<Amenitie[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [propertyNegociations, setPropertyNegociations] = useState<PropertyNegociation[]>([]);
  const [busca, setBusca] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("category");
  const [selecionados, setSelecionados] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<Category | Amenitie | PropertyType | PropertyNegociation | null>(null);
  const [form, setForm] = useState<any>({
    name: "",
    description: "",
  });

  const { toast } = useToast();
  const { getCategoryAmenitie, createCategoryAmenitie, updateCategoryAmenitie, deleteCategoryAmenitie } = useCategoryAmenitie();

  const carregarDados = async () => {
    try {
      const result = await getCategoryAmenitie();

      if (result && result.length > 0) {
        const categoriesData = JSON.parse(result[0].propertyCategory || "[]");
        const amenitiesData = JSON.parse(result[0].propertyAmenitie || "[]");
        const propertyTypesData = Array.isArray(result[0].propertyType)
          ? result[0].propertyType
          : JSON.parse(result[0].propertyType || "[]");
        const propertyNegociationsData = Array.isArray(result[0].propertyNegociation)
          ? result[0].propertyNegociation
          : JSON.parse(result[0].propertyNegociation || "[]");

        setCategories(categoriesData);
        setAmenities(amenitiesData);
        setPropertyTypes(propertyTypesData);
        setPropertyNegociations(propertyNegociationsData);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const getTabLabel = (tab: TabType) => {
    switch (tab) {
      case "category":
        return "Característica";
      case "amenitie":
        return "Comodidade";
      case "property_type":
        return "Tipo";
      case "property_negociation":
        return "Negociação";
      default:
        return "";
    }
  };

  const handleSalvar = async () => {
    if (!form.name) {
      toast({
        title: "Campo obrigatório",
        description: "Preencha pelo menos o nome!",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        ...(editando ? { id: editando.id } : {}),
        name: form.name,
        description: form.description || null,
      };

      if (editando) {
        await updateCategoryAmenitie(activeTab, payload);
        toast({
          title: "Atualizado com sucesso!",
          description: `${getTabLabel(activeTab)} atualizado.`,
        });
      } else {
        await createCategoryAmenitie(activeTab, payload);
        toast({
          title: "Criado com sucesso!",
          description: `${getTabLabel(activeTab)} criado.`,
        });
      }

      setShowModal(false);
      setEditando(null);
      setTimeout(() => carregarDados(), 1000);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleExcluirSelecionados = async () => {
    if (selecionados.length === 0) return;

    const lista = getListaAtual();
    const idsExcluir = selecionados.map((i) => lista[i].id);

    try {
      for (const id of idsExcluir) {
        await deleteCategoryAmenitie(activeTab, id);
      }
      toast({
        title: "Itens excluídos com sucesso!",
        description: `${selecionados.length} ${selecionados.length === 1 ? "item excluído" : "itens excluídos"}.`,
      });
      carregarDados();
      setSelecionados([]);
    } catch (error) {
      console.error("Erro ao excluir:", error);
      toast({
        title: "Erro ao excluir",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleAbrirModal = (item: Category | Amenitie | PropertyType | PropertyNegociation | null = null) => {
    if (item) {
      setEditando(item);
      let name = "";
      let description = null;

      if ('category_name' in item) {
        name = item.category_name;
        description = item.category_description;
      } else if ('amenitie_name' in item) {
        name = item.amenitie_name;
        description = item.amenitie_description;
      } else if ('property_type_name' in item) {
        name = item.property_type_name;
        description = item.property_type_description;
      } else if ('property_negociation_name' in item) {
        name = item.property_negociation_name;
        description = item.property_negociation_description;
      }

      setForm({ name, description });
    } else {
      setEditando(null);
      setForm({
        name: "",
        description: "",
      });
    }
    setShowModal(true);
  };

  const getListaAtual = () => {
    switch (activeTab) {
      case "category":
        return categories;
      case "amenitie":
        return amenities;
      case "property_type":
        return propertyTypes;
      case "property_negociation":
        return propertyNegociations;
      default:
        return [];
    }
  };

  const listaAtual = getListaAtual();
  const listaFiltrada = listaAtual.filter((item) => {
    let name = "";
    if ('category_name' in item) name = item.category_name;
    else if ('amenitie_name' in item) name = (item as Amenitie).amenitie_name;
    else if ('property_type_name' in item) name = item.property_type_name;
    else if ('property_negociation_name' in item) name = item.property_negociation_name;

    return name?.toLowerCase().includes(busca.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="h-20 w-full" />}>
        <Header />
      </Suspense>
      
      <div className="pt-24 px-6 space-y-6"> {/* Aumentei o padding-top para 24 (6rem) */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Gestão de Campos Extras</h1>
          <div className="flex gap-2">
            <Input
              placeholder="Buscar..."
              className="w-64"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <Button onClick={() => handleAbrirModal()}>
              <PlusCircle className="mr-2 h-5 w-5" />
              Nova {getTabLabel(activeTab)}
            </Button>
            {selecionados.length > 0 && (
              <Button variant="destructive" onClick={handleExcluirSelecionados}>
                <Trash2 className="mr-2 h-5 w-5" /> Excluir
              </Button>
            )}
          </div>
        </div>

        <div className="flex gap-2 border-b">
          <Button
            variant={activeTab === "category" ? "default" : "ghost"}
            onClick={() => {
              setActiveTab("category");
              setSelecionados([]);
            }}
            className="rounded-b-none"
          >
            Características
          </Button>
          <Button
            variant={activeTab === "amenitie" ? "default" : "ghost"}
            onClick={() => {
              setActiveTab("amenitie");
              setSelecionados([]);
            }}
            className="rounded-b-none"
          >
            Comodidades
          </Button>
          <Button
            variant={activeTab === "property_type" ? "default" : "ghost"}
            onClick={() => {
              setActiveTab("property_type");
              setSelecionados([]);
            }}
            className="rounded-b-none"
          >
            Tipo
          </Button>
          <Button
            variant={activeTab === "property_negociation" ? "default" : "ghost"}
            onClick={() => {
              setActiveTab("property_negociation");
              setSelecionados([]);
            }}
            className="rounded-b-none"
          >
            Negociação
          </Button>
        </div>

        <div className="rounded-md border border-border shadow-sm overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[50px] text-center">Sel.</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {listaFiltrada.length > 0 ? (
                listaFiltrada.map((item, i) => {
                  let name = "";
                  let description = null;

                  if ('category_name' in item) {
                    name = item.category_name;
                    description = item.category_description;
                  } else if ('amenitie_name' in item) {
                    name = (item as Amenitie).amenitie_name;
                    description = (item as Amenitie).amenitie_description;
                  } else if ('property_type_name' in item) {
                    name = item.property_type_name;
                    description = item.property_type_description;
                  } else if ('property_negociation_name' in item) {
                    name = item.property_negociation_name;
                    description = item.property_negociation_description;
                  }

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="text-center">
                        <input
                          type="checkbox"
                          checked={selecionados.includes(i)}
                          onChange={() =>
                            setSelecionados((prev) =>
                              prev.includes(i)
                                ? prev.filter((s) => s !== i)
                                : [...prev, i]
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{name}</TableCell>
                      <TableCell>{description || "-"}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAbrirModal(item)}
                        >
                          <Pencil className="h-4 w-4 mr-1" /> Atualizar
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-6"
                  >
                    Nenhum item encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editando
                  ? `Atualizar ${getTabLabel(activeTab)}`
                  : `Cadastrar Nova ${getTabLabel(activeTab)}`}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-3 py-4">
              <Input
                placeholder="Nome"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Textarea
                placeholder="Descrição (opcional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <DialogFooter>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSalvar}>
                {editando ? "Salvar Alterações" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}