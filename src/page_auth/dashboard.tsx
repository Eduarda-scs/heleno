import { Cog } from "lucide-react";
import { lazy, Suspense } from "react";

const Header = lazy(() => import("@/components/Header"));
const Footer = lazy(() => import("@/components/Footer"));
const Dashboard = () => {
  return (
    <div className="min-h-screen bg-zinc-600 flex flex-col">
      <Suspense fallback={<div className="h-20 w-full" />}>
        <Header />
      </Suspense>

      <main className="flex-1 flex flex-col justify-center items-center px-6 text-center">
        {/* Engrenagem Girando */}
        <div className="animate-spin-slow mb-6">
          <Cog className="w-24 h-24 text-secondary drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]" />
        </div>

        {/* Texto */}
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-up">
          Página em Produção
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-xl animate-fade-up" style={{ animationDelay: "150ms" }}>
          Em breve disponível, estamos preparando tudo com o máximo de qualidade.
        </p>

        {/* Fundo decorativo */}
        <div className="absolute inset-0 -z-10 opacity-10 bg-[url('/noise.png')] pointer-events-none" />
      </main>

      <Suspense fallback={<div className="h-20 bg-background" />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Dashboard;
