import { useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendLeadToWebhook } from "@/components/c2sapi";
import { useToast } from "@/components/ui/use-toast";

interface LeadModalProps {
  open: boolean;
  onClose: () => void;
  propertyTitle: string;
}

export function LeadModal({ open, onClose, propertyTitle }: LeadModalProps) {
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!name || !email || !message) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, email e mensagem.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      await sendLeadToWebhook({
        name,
        email,
        phone,
        message: `${propertyTitle} - ${message}`,
        source: "modal",
      });

      toast({
        title: "Mensagem enviada!",
        description: "Entraremos em contato em breve.",
      });

      onClose();
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch {
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-md rounded-xl p-6 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X />
        </button>

        <h3 className="text-2xl font-bold mb-1">Fale sobre o imóvel</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {propertyTitle}
        </p>

        <div className="space-y-3">
          <input
            placeholder="Nome"
            className="w-full border rounded-lg px-4 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Email"
            type="email"
            className="w-full border rounded-lg px-4 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Telefone (opcional)"
            className="w-full border rounded-lg px-4 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <textarea
            placeholder="Escreva sua mensagem"
            className="w-full border rounded-lg px-4 py-2 min-h-[100px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <Button
            variant="hero"
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            disabled={loading}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            {loading ? "Enviando..." : "Enviar mensagem"}
          </Button>
        </div>
      </div>
    </div>
  );
}
