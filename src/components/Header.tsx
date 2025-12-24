import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, ChevronDown, LogOut, Building2, Heart, HelpCircle, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { RegisterModal } from "@/components/RegisterModal";

const LoginModal = lazy(() => import("@/components/LoginModal"));

const navigation = [
  { name: "Início", href: "/" },
  { name: "A Cidade", href: "/cidade" },
  { name: "Empreendimentos", href: "/empreendimentos" },
  { name: "FG Empreendimentos", href: "/fgabout" },
  { name: "Sobre", href: "/sobre" },
  { name: "Contato", href: "/contato" },
];

 const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  
  // Novos estados para controle de visibilidade do header
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const modalTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const profileContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Sempre mostrar quando estiver no topo
      if (currentScrollY === 0) {
        setIsVisible(true);
        setIsScrolled(false);
      } else {
        setIsScrolled(true);
        
        // Mostrar quando fazer scroll para cima, esconder quando fazer scroll para baixo
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scroll para baixo - esconder header
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY) {
          // Scroll para cima - mostrar header
          setIsVisible(true);
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    // Debounce para melhor performance
    const debouncedScroll = () => {
      let ticking = false;
      return () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      };
    };

    window.addEventListener("scroll", debouncedScroll(), { passive: true });
    return () => window.removeEventListener("scroll", debouncedScroll());
  }, [lastScrollY]);



  const handleLoginClick = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleRegisterClick = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  

  const handleMouseEnter = () => {
    if (modalTimeoutRef.current) {
      clearTimeout(modalTimeoutRef.current);
      modalTimeoutRef.current = null;
    }
    setShowProfileModal(true);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement;

    if (profileContainerRef.current && relatedTarget && profileContainerRef.current.contains(relatedTarget)) {
      return;
    }

    modalTimeoutRef.current = setTimeout(() => {
      setShowProfileModal(false);
    }, 300);
  };

  const handleLogout = () => {
    setShowProfileModal(false);
    logout();
  };

  const handleNavigate = (path: string) => {
    setShowProfileModal(false);
    navigate(path);
  };

  useEffect(() => {
    return () => {
      if (modalTimeoutRef.current) {
        clearTimeout(modalTimeoutRef.current);
      }
    };
  }, []);

  const isAdmin = user?.department?.toLowerCase() === "admin";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-500 ease-in-out",
          "bg-[#1b4c57]/50 backdrop-blur-sm",
          // Animação de entrada/saída baseada na visibilidade
          isVisible 
            ? "translate-y-0 opacity-100" 
            : "-translate-y-full opacity-0",
          // Background quando scrolled (opcional - mantenha se quiser)
          //isScrolled && "bg-background/80 backdrop-blur-md"
        )}
      >
        <nav className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* LOGO */}
            <Link to="/" className="flex items-center">
              <img
                src="/logo2-small.webp"
                alt="Heleno Alves"
                width="200"
                height="120"
                className="h-[120px] w-auto"
                loading="eager"
                fetchpriority="high"
              />

            </Link>

            {/* MENU DESKTOP */}
            <div className="hidden md:flex items-center space-x-8 font-bwmodelica">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium transition-all duration-300 relative group",
                    location.pathname === item.href
                      ? "text-secondary"
                      : "text-primary-foreground hover:text-secondary"
                  )}
                >
                  {item.name}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-0.5 bg-secondary transition-all duration-300",
                      location.pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  />
                </Link>
              ))}

              {!user ? (
                <Button variant="gold" size="sm" onClick={handleLoginClick}>
                  Login
                </Button>
              ) : (
                <div
                  ref={profileContainerRef}
                  className="relative"
                  style={{ zIndex: 10000 }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Button variant="gold" size="sm" className="flex items-center gap-1">
                    Conta
                    <ChevronDown className={`w-4 h-4 transition-all duration-300 ${showProfileModal ? 'rotate-180' : ''}`} />
                  </Button>

                  {showProfileModal && (
                    <div
                      className="absolute right-0 top-full mt-2 w-72 rounded-xl shadow-2xl border transition-all duration-300 bg-white border-gray-200 shadow-gray-500/20"
                      style={{ zIndex: 10001 }}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          {user.profile_picture ? (
                            <img
                              className="w-12 h-12 rounded-full object-cover"
                              src={user.profile_picture}
                              alt={user.full_name}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100">
                              <User className="w-6 h-6 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-base text-gray-800">
                              {user.full_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {user.user_email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        {isAdmin ? (
                          <>
                            <button
                              onClick={() => handleNavigate('/admin/gestao-imoveis')}
                              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            >
                              <Building2 className="w-4 h-4 mr-3" />
                              Gestão de Imóveis
                            </button>
                            <button
                              onClick={() => handleNavigate('/admin/campos-extras')}
                              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            >
                              <ListChecks className="w-4 h-4 mr-3" />
                              Campos Extras
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleNavigate('/')}
                              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            >
                              <User className="w-4 h-4 mr-3" />
                              Perfil
                            </button>
                            <button
                              onClick={() => handleNavigate('/')}
                              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            >
                              <Heart className="w-4 h-4 mr-3" />
                              Favoritos
                            </button>
                            <button
                              onClick={() => handleNavigate('/')}
                              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            >
                              <HelpCircle className="w-4 h-4 mr-3" />
                              Ajuda
                            </button>
                          </>
                        )}

                        <div className="border-t border-gray-100 my-2"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sair
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* BOTÃO MOBILE */}
            <button
              className="md:hidden text-primary-foreground hover:text-secondary transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* MENU MOBILE COM OVERLAY */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay escuro */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu mobile */}
          <div className="fixed top-0 left-0 w-full bg-[#1a1a1a] z-50 py-6 px-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "text-sm font-medium px-4 py-2 rounded-md transition-colors",
                    location.pathname === item.href
                      ? "text-secondary bg-primary-foreground/10"
                      : "text-primary-foreground hover:text-secondary hover:bg-primary-foreground/5"
                  )}
                >
                  {item.name}
                </Link>
              ))}

              {!user ? (
                <Button variant="gold" size="sm" className="mt-4" onClick={handleLoginClick}>
                  Login
                </Button>
              ) : (
                <>
                  <div className="border-t border-gray-600 my-2"></div>

                  <div className="px-4">
                    <div className="flex items-center space-x-3 mb-4">
                      {user.profile_picture ? (
                        <img
                          className="w-12 h-12 rounded-full object-cover"
                          src={user.profile_picture}
                          alt={user.full_name}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100">
                          <User className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-base text-primary-foreground">
                          {user.full_name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {user.user_email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {isAdmin ? (
                    <>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate('/admin/gestao-imoveis');
                        }}
                        className="flex items-center px-4 py-2 text-sm font-medium text-primary-foreground hover:text-secondary hover:bg-primary-foreground/5 rounded-md transition-colors"
                      >
                        <Building2 className="w-4 h-4 mr-3" />
                        Gestão de Imóveis
                      </button>

                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate('/admin/campos-extras');
                        }}
                        className="flex items-center px-4 py-2 text-sm font-medium text-primary-foreground hover:text-secondary hover:bg-primary-foreground/5 rounded-md transition-colors"
                      >
                        <ListChecks className="w-4 h-4 mr-3" />
                        Campos Extras
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate('/');
                        }}
                        className="flex items-center px-4 py-2 text-sm font-medium text-primary-foreground hover:text-secondary hover:bg-primary-foreground/5 rounded-md transition-colors"
                      >
                        <User className="w-4 h-4 mr-3" />
                        Perfil
                      </button>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate('/favoritos');
                        }}
                        className="flex items-center px-4 py-2 text-sm font-medium text-primary-foreground hover:text-secondary hover:bg-primary-foreground/5 rounded-md transition-colors"
                      >
                        <Heart className="w-4 h-4 mr-3" />
                        Favoritos
                      </button>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate('/');
                        }}
                        className="flex items-center px-4 py-2 text-sm font-medium text-primary-foreground hover:text-secondary hover:bg-primary-foreground/5 rounded-md transition-colors"
                      >
                        <HelpCircle className="w-4 h-4 mr-3" />
                        Ajuda
                      </button>
                    </>
                  )}

                  <div className="border-t border-gray-600 my-2"></div>

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-md transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sair
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
       <Suspense fallback={null}>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onRegisterClick={handleRegisterClick}
      />
      </Suspense>

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onLoginClick={handleLoginClick}
      />
    </>
  );
};

export default Header;