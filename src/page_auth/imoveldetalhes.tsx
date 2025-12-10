"use client"
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "@/utility/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL;

export default function ImovelDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [imovel, setImovel] = useState<any>(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState<any>({});
  const [midias, setMidias] = useState<(string | File)[]>([]);
  const [showExcluirModal, setShowExcluirModal] = useState(false);

  // 🔹 Carrega o imóvel do Supabase
  async function carregarImovel() {
    const { data, error } = await supabase.from("heleno_imoveis").select("*").eq("id", id).single();
    if (!error && data) {
      setImovel(data);
      setForm({
        ...data,
        caracteristicas:
          typeof data.caracteristicas === "string"
            ? data.caracteristicas
            : Array.isArray(data.caracteristicas)
            ? data.caracteristicas.join(", ")
            : "",
        Condominio:
          typeof data.Condominio === "string"
            ? data.Condominio
            : Array.isArray(data.Condominio)
            ? data.Condominio.join(", ")
            : "",
      });

      // 🔹 Lê o campo url (JSON)
      let urls: string[] = [];
      try {
        if (typeof data.url === "object" && data.url !== null) {
          urls = Object.values(data.url);
        } else if (typeof data.url === "string") {
          const parsed = JSON.parse(data.url);
          urls = Object.values(parsed);
        }
      } catch {
        urls = [];
      }

      setMidias(urls);
    }
  }

  useEffect(() => {
    carregarImovel();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleExcluir = async () => {
    const { error } = await supabase.from("heleno_imoveis").delete().eq("id", id);
    if (!error) {
      setShowExcluirModal(false);
      alert("Imóvel excluído com sucesso!");
      navigate("/Cadastroimoveis");
    }
  };

  // 🔹 Atualiza o imóvel via webhook (N8N)
  const handleAtualizar = async () => {
    const formData = new FormData();
    formData.append("funcao", "atualizar_imovel");
    

    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    formData.append("id", String(id));

    // 🔹 Envia TODAS as mídias atuais (antigas + novas)
    midias.forEach((m) => {
      if (m instanceof File) {
        formData.append("midia", m);
      } else {
        formData.append("midia_url", m);
      }
    });

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Imóvel atualizado com sucesso via webhook!");
        setEditando(false);
        carregarImovel();
      } else {
        alert("Erro ao enviar dados para o webhook.");
      }
    } catch (error) {
      console.error("Erro ao enviar para o webhook:", error);
    }
  };

  const handleAddMidia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setMidias((prev) => [...prev, ...Array.from(files)]);
  };

  const handleRemoveMidia = (index: number) => {
    setMidias((prev) => prev.filter((_, i) => i !== index));
  };

  if (!imovel) return <p className="p-6">Carregando detalhes...</p>;

  const camposNumericos = ["valor", "cep", "quartos", "banheiros", "metros", "vagas"];
  const camposTexto = [
    "titulo",
    "descricao",
    "cidade",
    "bairro",
    "rua",
    "numero",
    "tipo",
    "negociacao",
    "nome_anunciante",
    "Condominio",
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Detalhes do Imóvel</h1>
        {!editando && (
          <div className="flex gap-3">
            <Button onClick={() => setEditando(true)}>Atualizar</Button>
            <Button variant="destructive" onClick={() => setShowExcluirModal(true)}>
              Excluir
            </Button>
          </div>
        )}
      </div>

      {/* --- Informações --- */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle>{imovel.titulo}</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {!editando ? (
            <>
              {camposTexto.concat(camposNumericos).map((campo) => (
                <p key={campo}>
                  <b>{campo}:</b> {imovel[campo] ?? "campo vazio"}
                </p>
              ))}

              {imovel.caracteristicas && (
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-lg mt-4">Características</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {imovel.caracteristicas
                      .split(",")
                      .map((item: string, i: number) => (
                        <div key={i} className="bg-muted p-2 rounded-lg shadow-sm text-sm">
                          {item.trim()}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {camposTexto.map((campo) => (
                <Input
                  key={campo}
                  name={campo}
                  value={form[campo] || ""}
                  onChange={handleChange}
                  placeholder={campo}
                />
              ))}

              {camposNumericos.map((campo) => (
                <Input
                  key={campo}
                  name={campo}
                  value={form[campo] || ""}
                  onChange={handleChange}
                  placeholder={campo}
                  type="number"
                />
              ))}

              <div className="col-span-2">
                <h3 className="font-semibold mb-2">Características (separe por vírgulas)</h3>
                <Input
                  name="caracteristicas"
                  value={form.caracteristicas || ""}
                  onChange={handleChange}
                  placeholder="Ex: Piscina, Garagem, Varanda"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* --- Mídia --- */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Mídia</CardTitle>
        </CardHeader>
        <CardContent>
          {midias.length === 0 && <p className="text-gray-500">Nenhuma mídia cadastrada.</p>}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {midias.map((m, index) => {
              const url = m instanceof File ? URL.createObjectURL(m) : m;
              return (
                <div key={index} className="relative">
                  {url.endsWith(".mp4") || url.endsWith(".webm") ? (
                    <video
                      src={url}
                      controls
                      className="rounded-lg shadow-md w-full h-48 object-cover"
                    />
                  ) : (
                    <img
                      src={url}
                      alt={`Mídia ${index + 1}`}
                      className="rounded-lg shadow-md w-full h-48 object-cover"
                    />
                  )}
                  {editando && (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => handleRemoveMidia(index)}
                    >
                      X
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          {editando && (
            <div className="mt-4">
              <label className="font-medium mb-2 block">Adicionar novas mídias</label>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleAddMidia}
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {editando && (
        <div className="flex justify-end gap-3 mt-4 px-6 pb-4">
          <Button variant="secondary" onClick={() => setEditando(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAtualizar}>Salvar Alterações</Button>
        </div>
      )}

      {/* --- Modal de exclusão --- */}
      <Dialog open={showExcluirModal} onOpenChange={setShowExcluirModal}>
        <DialogContent className="max-w-md text-center space-y-4">
          <DialogHeader>
            <DialogTitle>Excluir Imóvel?</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            ⚠️ Se você continuar, <b>esses dados não poderão ser recuperados.</b>
          </p>
          <DialogFooter className="flex justify-center gap-4 pt-2">
            <Button variant="secondary" onClick={() => setShowExcluirModal(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleExcluir}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
