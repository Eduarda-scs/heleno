import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Usuario {
  id: number;
  email?: string;
  nome: string;
  tipo?: string;
}

interface AuthContextType {
  user: Usuario | null;
  setUser: (user: Usuario | null) => void;
  logout: () => void;
  loading: boolean; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const storedUser = localStorage.getItem("ha_user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        setUser(parsedUser);
      } catch (error) {
        
        localStorage.removeItem("ha_user");
      }
    } else {
      console.log("");
    }

    // Simula tempo de carregamento (útil para UX)
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const logout = () => {
    
    localStorage.removeItem("ha_user");
    setUser(null);
    window.location.reload(); //  força reset total
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro do AuthProvider");
  return context;
}
