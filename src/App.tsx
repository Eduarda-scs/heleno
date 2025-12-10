import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CookieConsent from "@/components/CookieConsent";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth, AuthProvider } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

/* ============================
    LAZY IMPORTS DAS PÁGINAS
   ============================ */
const Index = lazy(() => import("./pages/Index"));
const City = lazy(() => import("./pages/City"));
const Properties = lazy(() => import("./pages/Properties"));
const PropertyDetails = lazy(() => import("./pages/PropertyDetails"));
const About = lazy(() => import("./pages/About"));
const AboutFG = lazy(() => import("./pages/Fgabout"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PoliticasCookies = lazy(() => import("./pages/PoliticasCookies"));
const PoliticasPrivacidade = lazy(() => import("./pages/politicaprivacidade"));
const TermosUso = lazy(() => import("./pages/termodeuso"));

// ADMIN
const Dashboard = lazy(() => import("./page_auth/dashboard"));
const ImovelDetalhes = lazy(() => import("./page_auth/Imoveisdetalhes"));
const CadastroImoveis = lazy(() => import("./views/Admin/Cadastroimoveis"));
const CategoryAmenitie = lazy(() => import("./views/Admin/CategoryAmenitie"));

/* ============================ */

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground transition-opacity duration-500 ease-in-out">
        <div className="text-center animate-fade-in">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-background text-foreground">
          <p>Carregando...</p>
        </div>
      }
    >
      <Routes>
        {/* ROTAS LIVRES */}
        <Route path="/" element={<Index />} />
        <Route path="/cidade" element={<City />} />
        <Route path="/fgabout" element={<AboutFG />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/empreendimentos" element={<Properties />} />
        <Route path="empreendimento/:id" element={<PropertyDetails />} />
        <Route path="/politicacokies" element={<PoliticasCookies />} />
        <Route path="/politicaprivacidade" element={<PoliticasPrivacidade />} />
        <Route path="/termodeuso" element={<TermosUso />} />

        {/* ROTAS PROTEGIDAS */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/gestao-imoveis"
          element={
            <ProtectedRoute requireAdmin>
              <CadastroImoveis />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/detalhes-imovel/:id"
          element={
            <ProtectedRoute requireAdmin>
              <ImovelDetalhes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/campos-extras"
          element={
            <ProtectedRoute requireAdmin>
              <CategoryAmenitie />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
            <CookieConsent />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
