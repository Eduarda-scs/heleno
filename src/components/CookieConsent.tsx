import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie-consent");
    if (!accepted) {
      setTimeout(() => setVisible(true), 500); // animação suave
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "true");
    setVisible(false);
  };

  return (
    visible && (
      <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-xl z-50">
        <div className="bg-primary text-primary-foreground rounded-2xl shadow-xl p-5 border border-primary-foreground/20 relative animate-slide-up">

          {/* Botão de fechar */}
          <button
            onClick={acceptCookies}
            className="absolute top-3 right-3 text-primary-foreground/70 hover:text-secondary transition"
          >
            <X size={18} />
          </button>

          <h3 className="text-lg font-semibold mb-2 text-secondary">
            Nós usamos cookies 🍪
          </h3>

          <p className="text-sm text-primary-foreground/80 leading-relaxed">
            Usamos cookies para melhorar sua experiência e fornecer conteúdo
            personalizado. Ao continuar navegando, você concorda com nossa{" "}
            <Link
              to="/politicas-cookies"
              className="text-secondary underline hover:opacity-80"
            >
              Política de Cookies
            </Link>.
          </p>

          <div className="mt-4 flex justify-end gap-3">
            <Button
              onClick={acceptCookies}
              className="bg-secondary text-primary font-semibold hover:opacity-90 px-6"
            >
              Aceitar
            </Button>
          </div>
        </div>
      </div>
    )
  );
};

export default CookieConsent;
