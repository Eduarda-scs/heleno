import { useState, } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useLogin } from "@/hooks/useLogin";
import { toast } from "sonner";


interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterClick: () => void;
}

const LoginModal = ({ isOpen, onClose, onRegisterClick }: LoginModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const { checkLogin, isLoading } = useLogin();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const userData = await checkLogin(email, password);

    if (userData) {
      login(userData);
      toast.success(`Bem-vindo(a), ${userData.full_name || userData.name}!`);
      onClose();
      setEmail("");
      setPassword("");
      
      // Navegação baseada no department (se necessário)
      const department = userData.department?.toLowerCase();
      if (department === "super admin" || department === "super_admin" || department === "admin") {
        // Pode adicionar navegação específica se necessário
      }
    } else {
      toast.error("E-mail ou senha incorretos.");
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
            <img
              src="/logo-small.webp"
              alt="Logo Heleno Alves"
              width="512"
              height="256"
              class="h-20 w-auto object-contain"
            />

          </div>
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary-foreground">Login</h2>
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
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

         
        </div>
      </div>
    </>
  );
};

export default LoginModal;