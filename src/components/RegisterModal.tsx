import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";


interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

export const RegisterModal = ({ isOpen, onClose, onLoginClick }: RegisterModalProps) => {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await register(name, email, password, whatsapp);
      toast.success("Cadastro realizado com sucesso!");
      onClose();
      setName("");
      setWhatsapp("");
      setEmail("");
      setPassword("");
    } catch (error) {
      toast.error("Erro ao fazer cadastro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="bg-[#07262d] rounded-2xl shadow-strong p-6 md:p-8 m-4">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src="logo-small.webp" alt="Logo" className="h-16 w-auto" />
          </div>
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary-foreground">Cadastro</h2>
            <button
              onClick={onClose}
              className="text-secondary hover:text-secondary/80 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-primary-foreground">Nome</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-primary-foreground/10 border-secondary/30 text-primary-foreground focus:border-secondary placeholder:text-primary-foreground/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-primary-foreground">WhatsApp</Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="(00) 00000-0000"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
                className="bg-primary-foreground/10 border-secondary/30 text-primary-foreground focus:border-secondary placeholder:text-primary-foreground/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-primary-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-primary-foreground/10 border-secondary/30 text-primary-foreground focus:border-secondary placeholder:text-primary-foreground/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-primary-foreground">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-primary-foreground/10 border-secondary/30 text-primary-foreground focus:border-secondary placeholder:text-primary-foreground/50"
              />
            </div>

            <Button
              type="submit"
              variant="hero"
              className="w-full mt-6"
              disabled={isLoading}
            >
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-primary-foreground/70">
              Já tem uma conta?{" "}
              <button 
                type="button"
                onClick={onLoginClick} 
                className="text-secondary hover:underline font-semibold"
              >
                Fazer Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
