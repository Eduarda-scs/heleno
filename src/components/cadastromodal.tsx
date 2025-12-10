import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";


interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
  onSubmitRegister: (data: { name: string; email: string; phone: string }) => void;
}

export const RegisterModal = ({ 
  isOpen, 
  onClose, 
  onLoginClick,
  onSubmitRegister 
}: RegisterModalProps) => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmitRegister({
      name,
      email,
      phone,
    });

    setName("");
    setEmail("");
    setPhone("");
    onClose();
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
            <img src="/logo-small.webp" alt="Logo" className="h-16 w-auto" />
          </div>

          <div className="mb-6">
        {/* Título + botão fechar */}
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-primary-foreground">Cadastro</h2>

            <button
            onClick={onClose}
            className="text-secondary hover:text-secondary/80 transition-colors"
            >
            <X className="w-6 h-6" />
            </button>
        </div>

        {/* Texto abaixo do título */}
        <p className="text-primary-foreground/80 text-sm mt-2">
            Preencha seus dados para que nossa equipe entre em contato com você o mais rápido possível.
            Estamos aqui para ajudar!
        </p>
        </div>


          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-primary-foreground">
                Nome completo
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-primary-foreground/10 border-secondary/30 text-primary-foreground focus:border-secondary placeholder:text-primary-foreground/50"
              />
            </div>

            {/* Email */}
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

            {/* Telefone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-primary-foreground">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="bg-primary-foreground/10 border-secondary/30 text-primary-foreground focus:border-secondary placeholder:text-primary-foreground/50"
              />
            </div>

            <Button
              type="submit"
              variant="hero"
              className="w-full mt-6"
            >
              Enviar
            </Button>
          </form>

          

        </div>
      </div>
    </>
  );
};
