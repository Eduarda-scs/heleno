import { useState, useEffect,useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { sendPropertyToWebhook } from "@/hooks/Admin/PropertyManager";
import { useToast } from "@/components/ui/use-toast";
import { X } from "lucide-react";


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

interface ModalCadastroImovelProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  amenities?: Amenity[];
  categories?: Category[];
  propertyTypes?: PropertyType[];
}

export default function ModalCadastroImovel({
  open,
  onClose,
  onSave,
  amenities = [],
  categories = [],
  propertyTypes = [],
}: ModalCadastroImovelProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  console.log("AMENITIES:", amenities);
  console.log("CATEGORIES:", categories);
  console.log("PROPERTY TYPES:", propertyTypes);


  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    cidade: "",
    bairro: "",
    rua: "",
    cep: "",
    numero: "",
    valor: "",
    negociacao: "",
    quartos: "",
    banheiros: "",
    vagas: "",
    metros: "",
    valorNegociacao: "",
    valorCondominio: "",
    valorLocacao: "",
  });

  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<number[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);


  const [fotos, setFotos] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [errors, setErrors] = useState<{ titulo?: string }>({});

  const handleNextStep = () => {
    const newErrors: { titulo?: string } = {};

    if (!form.titulo.trim()) {
      newErrors.titulo = "O título do imóvel é obrigatório";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      toast({
        title: "Campos obrigatórios",
        description: "Preencha os campos obrigatórios antes de continuar.",
        variant: "destructive",
      });

      // 👇 FAZ O MODAL VOLTAR PRO TOPO
      modalRef.current?.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setErrors({});
    setStep(2);
  };




  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>, tipo: "foto" | "video") => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (tipo === "foto") {
        setFotos((prev) => [...prev, ...filesArray]);
      } else {
        setVideos((prev) => [...prev, ...filesArray]);
      }
    }
  };

  const handleRemoveFile = (index: number, tipo: "foto" | "video") => {
    if (tipo === "foto") {
      setFotos((prev) => prev.filter((_, i) => i !== index));
    } else {
      setVideos((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const toggleAmenity = (id: number) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const toggleCategory = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const togglePropertyType = (id: number) => {
    setSelectedPropertyTypes((prev) =>
      prev.includes(id) ? prev.filter((pt) => pt !== id) : [...prev, id]
    );
  };

  const handleEnviar = async () => {
    setIsSubmitting(true);

    const selectedAmenitiesNames = amenities
      .filter((a) => selectedAmenities.includes(a.id))
      .map((a) => a.amenitie_name)
      .join(", ");

    const selectedCategoriesNames = categories
      .filter((c) => selectedCategories.includes(c.id))
      .map((c) => c.category_name)
      .join(", ");

    const selectedPropertyTypesNames = propertyTypes
      .filter((pt) => selectedPropertyTypes.includes(pt.id))
      .map((pt) => pt.property_type_name)
      .join(", ");

    const allFiles = [...fotos, ...videos];

    const payload = {
      titulo: form.titulo,
      descricao: form.descricao,
      cidade: form.cidade,
      bairro: form.bairro,
      rua: form.rua,
      cep: form.cep,
      numero: form.numero,
      valor: form.valor,
      negociacao: form.negociacao,
      tipo: selectedPropertyTypesNames,
      quartos: form.quartos,
      banheiros: form.banheiros,
      vagas: form.vagas,
      metros: form.metros,
      condominio: form.valorCondominio,
      valorNegociacao: form.valorNegociacao,
      valorLocacao: form.valorLocacao,
      foto: allFiles,
      phone: "",
      email: "",
      message: "",
      area: form.metros,
      quarto: form.quartos,
      banheiro: form.banheiros,
      vaga: form.vagas,
      endereco: `${form.rua}, ${form.numero}, ${form.bairro}, ${form.cidade}`,
      finalidade: form.negociacao,
      event_name: "create_property",
      caracteristicas: selectedCategoriesNames,
      comodidades: selectedAmenitiesNames,
      nome: "",
    };

    console.log("[ModalCadastroImovel] 📦 Payload preparado:", {
      ...payload,
      foto: `${allFiles.length} arquivo(s)`,
    });

    try {
      await sendPropertyToWebhook(payload);
      
      // Limpa os formulários
      setForm({
        titulo: "",
        descricao: "",
        cidade: "",
        bairro: "",
        rua: "",
        cep: "",
        numero: "",
        valor: "",
        negociacao: "",
        quartos: "",
        banheiros: "",
        vagas: "",
        metros: "",
        valorNegociacao: "",
        valorCondominio: "",
        valorLocacao: "",
      });
      setSelectedAmenities([]);
      setSelectedCategories([]);
      setSelectedPropertyTypes([]);
      setFotos([]);
      setVideos([]);
      setStep(1);

      toast({
        title: "Imóvel cadastrado com sucesso!",
        description: "O imóvel será exibido em breve.",
      });

      onSave();
      onClose();
    } catch (error) {
      console.error("[ModalCadastroImovel] ❌ Erro ao enviar imóvel:", error);
      toast({
        title: "Erro ao cadastrar imóvel",
        description: "Ocorreu um erro ao enviar os arquivos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setStep(1);
      setForm({
        titulo: "",
        descricao: "",
        cidade: "",
        bairro: "",
        rua: "",
        cep: "",
        numero: "",
        valor: "",
        negociacao: "",
        quartos: "",
        banheiros: "",
        vagas: "",
        metros: "",
        valorNegociacao: "",
        valorCondominio: "",
        valorLocacao: "",
      });
      setSelectedAmenities([]);
      setSelectedCategories([]);
      setSelectedPropertyTypes([]);
      setFotos([]);
      setVideos([]);
      setIsSubmitting(false);
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isSubmitting && onClose()}>
        <DialogContent
          className="max-w-3xl w-full rounded-2xl overflow-hidden p-0 border shadow-2xl"
          style={{
            maxHeight: "85vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "#07262d",
          }}
        >
          <div
            ref={modalRef}
            className="overflow-y-auto p-6"
          >

            <DialogHeader>
              <DialogTitle className="text-white">
                {step === 1 ? "Cadastrar Imóvel" : "Adicionar Fotos e Vídeos"}
              </DialogTitle>
            </DialogHeader>

            {step === 1 ? (
              <div className="space-y-6 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="titulo"
                    placeholder="Título"
                    value={form.titulo}
                    onChange={handleChange}
                    className={`bg-white/10 text-white placeholder:text-white/60 ${
                      errors.titulo
                        ? "border-red-500 focus-visible:ring-red-500"
                        : "border-white/20"
                    }`}
                    disabled={isSubmitting}
                  />

                  {errors.titulo && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.titulo}
                    </p>
                  )}

                  <Textarea
                    name="descricao"
                    placeholder="Descrição"
                    value={form.descricao}
                    onChange={handleChange}
                    className="col-span-2 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    disabled={isSubmitting}
                  />
                  <Input
                    name="cidade"
                    placeholder="Cidade"
                    value={form.cidade}
                    onChange={handleChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    disabled={isSubmitting}
                  />
                  <Input
                    name="bairro"
                    placeholder="Bairro"
                    value={form.bairro}
                    onChange={handleChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    disabled={isSubmitting}
                  />
                  <Input
                    name="rua"
                    placeholder="Rua"
                    value={form.rua}
                    onChange={handleChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    disabled={isSubmitting}
                  />
                  <Input
                    name="numero"
                    placeholder="Número"
                    type="number"
                    value={form.numero}
                    onChange={handleChange}
                    className="no-spinner bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    disabled={isSubmitting}
                  />
                  <Input
                    name="cep"
                    placeholder="CEP"
                    value={form.cep}
                    onChange={handleChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    disabled={isSubmitting}
                  />
                  <Input
                    name="valor"
                    placeholder="Preço (R$)"
                    type="text"
                    value={form.valor}
                    onChange={handleChange}
                    className="no-spinner bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    disabled={isSubmitting}
                  />
                  <Input
                    name="valorNegociacao"
                    placeholder="Valor de Negociação (R$)"
                    type="text"
                    value={form.valorNegociacao}
                    onChange={handleChange}
                    className="no-spinner bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    disabled={isSubmitting}
                  />
                  <Input
                    name="valorCondominio"
                    placeholder="Valor do Condomínio (R$)"
                    type="text"
                    value={form.valorCondominio}
                    onChange={handleChange}
                    className="no-spinner bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    disabled={isSubmitting}
                  />
                  <Input
                    name="valorLocacao"
                    placeholder="Valor de Locação (R$)"
                    type="text"
                    value={form.valorLocacao}
                    onChange={handleChange}
                    className="no-spinner bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    disabled={isSubmitting}
                  />
                  <Input
                    name="negociacao"
                    placeholder="Preço de Negociação (R$)"
                    value={form.negociacao}
                    onChange={handleChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    disabled={isSubmitting}
                  />
                  <Input
                    name="quartos"
                    placeholder="Quartos"
                    type="number"
                    value={form.quartos}
                    onChange={handleChange}
                    className="no-spinner bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    disabled={isSubmitting}
                  />
                  <Input
                    name="banheiros"
                    placeholder="Banheiros"
                    type="number"
                    value={form.banheiros}
                    onChange={handleChange}
                    className="no-spinner bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    disabled={isSubmitting}
                  />
                  <Input
                    name="vagas"
                    placeholder="Vagas"
                    type="number"
                    value={form.vagas}
                    onChange={handleChange}
                    className="no-spinner bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    disabled={isSubmitting}
                  />
                  <Input
                    name="metros"
                    placeholder="Metros quadrados"
                    type="number"
                    value={form.metros}
                    onChange={handleChange}
                    className="no-spinner bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="border-t border-white/20 pt-4">
                  <h3 className="font-semibold mb-3 text-white">Tipo de Imóvel</h3>
                  {propertyTypes.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {propertyTypes.map((propertyType) => (
                        <button
                          key={propertyType.id}
                          type="button"
                          onClick={() => !isSubmitting && togglePropertyType(propertyType.id)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            selectedPropertyTypes.includes(propertyType.id)
                              ? "bg-purple-600 text-white"
                              : "bg-white/20 text-white hover:bg-white/30"
                          } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                          disabled={isSubmitting}
                        >
                          {propertyType.property_type_name}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-white/60">Nenhum tipo de imóvel disponível</p>
                  )}
                </div>

                <div className="border-t border-white/20 pt-4">
                  <h3 className="font-semibold mb-3 text-white">Características</h3>
                  {categories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => !isSubmitting && toggleCategory(category.id)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            selectedCategories.includes(category.id)
                              ? "bg-blue-600 text-white"
                              : "bg-white/20 text-white hover:bg-white/30"
                          } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                          disabled={isSubmitting}
                        >
                          {category.category_name}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-white/60">Nenhuma característica disponível</p>
                  )}
                </div>

                <div className="border-t border-white/20 pt-4">
                  <h3 className="font-semibold mb-3 text-white">Comodidades</h3>
                  {amenities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {amenities.map((amenity) => (
                        <button
                          key={amenity.id}
                          type="button"
                          onClick={() => !isSubmitting && toggleAmenity(amenity.id)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            selectedAmenities.includes(amenity.id)
                              ? "bg-green-600 text-white"
                              : "bg-white/20 text-white hover:bg-white/30"
                          } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                          disabled={isSubmitting}
                        >
                          {amenity.amenitie_name}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-white/60">Nenhuma comodidade disponível</p>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/20">
                  <Button
                    variant="secondary"
                    onClick={onClose}
                    className="bg-white/20 text-white hover:bg-white/30"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    className="bg-white text-[#07262d] hover:bg-white/90"
                    disabled={isSubmitting}
                  >
                    Próximo
                  </Button>

                </div>
              </div>
            ) : (
              <div className="space-y-6 mt-4">
                <div>
                  <Label className="text-white">Fotos do imóvel</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFiles(e, "foto")}
                    className="bg-white/10 border-white/20 text-white file:text-white"
                    disabled={isSubmitting}
                  />
                  {fotos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {fotos.map((file, i) => (
                        <div key={i} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`foto-${i}`}
                            className="w-full h-28 object-cover rounded-md"
                          />
                          <button
                            onClick={() => !isSubmitting && handleRemoveFile(i, "foto")}
                            className={`absolute top-1 right-1 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black/60 hover:bg-black'} text-white rounded-full p-1`}
                            disabled={isSubmitting}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-white">Vídeos do imóvel</Label>
                  <Input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={(e) => handleFiles(e, "video")}
                    className="bg-white/10 border-white/20 text-white file:text-white"
                    disabled={isSubmitting}
                  />
                  {videos.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {videos.map((file, i) => (
                        <div key={i} className="relative">
                          <video controls className="w-full h-40 rounded-md">
                            <source src={URL.createObjectURL(file)} type={file.type} />
                          </video>
                          <button
                            onClick={() => !isSubmitting && handleRemoveFile(i, "video")}
                            className={`absolute top-1 right-1 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black/60 hover:bg-black'} text-white rounded-full p-1`}
                            disabled={isSubmitting}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between border-t border-white/20 pt-4">
                  <Button
                    variant="secondary"
                    onClick={() => setStep(1)}
                    className="bg-white/20 text-white hover:bg-white/30"
                    disabled={isSubmitting}
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={handleEnviar}
                    disabled={isSubmitting}
                    className="bg-white text-[#07262d] hover:bg-white/90"
                  >
                    {isSubmitting ? "Enviando..." : "Enviar Imóvel"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        input[type="number"].no-spinner::-webkit-outer-spin-button,
        input[type="number"].no-spinner::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"].no-spinner {
          -moz-appearance: textfield;
        }
      `}</style>
    </>
  );
}