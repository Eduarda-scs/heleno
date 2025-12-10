import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RegisterModal } from "@/components/cadastromodal";
import { createLeadC2S } from "@/components/c2sapi";
import Swal from "sweetalert2";


const properties = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  title: [
    "Frente ao Mar",
    "Planta",
    "Pronto",
    "Luxo",
    "Melhores Localidades",
    "FG empreendimento",
  ][i],
  description: `
    Explore cada empreendimento com uma visão completa: localização privilegiada, padrão construt
    utivo de alto nível, tecnologias utilizadas, comodidades, ambientes planejados e todos os diferenciais que tornam esses imóveis únicos em Balneário Camboriú.

    Quer saber mais? Plantas, valores, oportunidades exclusivas, condições especiais e detalhes que não aparecem no site estão a um clique de você.  

    Fale agora mesmo com Heleno Alves, o corretor que mais entende da região e que transforma a busca pelo imóvel perfeito em uma experiência simples, segura e personalizada.

    Ele te apresenta tudo ao vivo, envia vídeos, tira dúvidas e te ajuda a escolher o empreendimento ideal seja para morar, veranear ou investir com alta rentabilidade.
  `,
  image: ["/opt-frentemar.webp", "/opt-planta.webp", "/opt-fgempreendimento.webp", "/opt-luxo.webp", "/opt-localidade.webp", "/opt-fg-innovation.webp"][i],
}));

const FeaturedProperties = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  // Modal cadastro
  const [registerOpen, setRegisterOpen] = useState(false);

  const openModal = (property) => {
    setSelectedProperty(property);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProperty(null);
  };

  // ✅ ALERT BONITO ADICIONADO AQUI
  const handleRegisterSubmit = async (data) => {
    try {
      const response = await createLeadC2S({
        name: data.name,
        email: data.email,
        phone: data.phone,
      });

      Swal.fire({
        icon: "success",
        title: "Contato enviado!",
        text: "Em breve retornaremos.",
        confirmButtonColor: "#0a3541",
        background: "#ffffff",
        iconColor: "#16a34a",
      });

      setRegisterOpen(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro ao enviar",
        text: "Não foi possível enviar suas informações. Tente novamente.",
        confirmButtonColor: "#b91c1c",
        background: "#ffffff",
        iconColor: "#dc2626",
      });
    }
  };

  const isMobile = window.innerWidth <= 768;

  const handleCardClick = (index, property) => {
    if (isMobile) {
      setActiveIndex((prev) => (prev === index ? null : index));
      openModal(property);
    } else {
      openModal(property);
    }
  };

  return (
    <section className="py-12 bg-[#07262d]">
      <style>{`
        .flex-list {
          display: flex;
          gap: 10px;
          align-items: stretch;
          justify-content: center;
          padding: 0 8px;
        }

        .flex-item {
          flex: 0.5 1 150px;
          height: 550px;
          overflow: hidden;
          box-shadow: 0 6px 18px rgba(2,6,23,0.45);
          transition: flex 600ms cubic-bezier(.17,.67,.5,1.03);
          cursor: pointer;
          position: relative;
          background: #000;
        }

        @media (hover: hover) and (pointer: fine) {
          .flex-item:hover {
            flex: 4 1 400px;
            box-shadow: 0 12px 30px rgba(2,6,23,0.6);
          }
          .flex-item:hover img {
            transform: scale(1.03);
          }
        }

        .flex-item.active {
          flex: 4 1 400px;
        }

        .flex-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 600ms;
        }

        .card-title {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 12px;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%);
        }

        @media (max-width: 768px) {
          .flex-list {
            flex-direction: column;
            gap: 14px;
          }

          .flex-item {
            height: 230px;
            border-radius: 12px;
          }
        }
      `}</style>

      <div className="container mx-auto px-4 lg:px-8 font-bwmodelica">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-2">
            Imóveis em <span className="text-secondary font-normal">Destaque</span>
          </h2>
          <p className="text-sm text-white/70">Passe o mouse — no mobile toque para abrir.</p>
        </div>

        {/* LISTA DE CARDS */}
        <div className="flex-list">
          {properties.map((property, index) => (
            <button
              key={property.id}
              onClick={() => handleCardClick(index, property)}
              className={`flex-item ${activeIndex === index ? "active" : ""}`}
            >
              <img src={property.image} alt={property.title} />
              <div className="card-title">
                <h3 className="text-xs font-medium text-white">{property.title}</h3>
              </div>
            </button>
          ))}
        </div>

        {/* BOTÃO VER TODOS */}
        <div className="text-center mt-8">
          <Button
            variant="hero"
            size="lg"
            className="px-5 py-3 text-sm font-medium mx-auto border border-white/20 hover:border-white/40"
            asChild
          >
            <Link to="/empreendimentos">
              Ver Todos os Empreendimentos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      {/* MODAL PRINCIPAL */}
      {modalOpen && selectedProperty && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-0 md:p-4">

          <div
            className="
              bg-white w-full h-full md:h-auto md:max-w-5xl 
              grid md:grid-cols-2 relative rounded-none md:rounded-2xl
              overflow-hidden
            "
          >
            {/* FECHAR */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-black hover:text-gray-700 z-20"
            >
              <X size={32} />
            </button>

            {/* MOBILE IMAGE */}
            <div className="w-full h-48 md:hidden overflow-hidden">
              <img
                src={selectedProperty.image}
                className="w-full h-full object-cover"
                alt={selectedProperty.title}
              />
            </div>

            {/* DESKTOP IMAGE */}
            <div className="hidden md:block w-full h-full overflow-hidden">
              <img
                src={selectedProperty.image}
                className="w-full h-full object-cover"
                alt={selectedProperty.title}
              />
            </div>

            {/* CONTEÚDO */}
            <div className="flex flex-col h-full md:h-auto p-6 overflow-y-auto">

              <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
                {selectedProperty.title}
              </h3>

              <div className="mt-3 md:mt-4 leading-relaxed text-sm md:text-base text-gray-700 whitespace-pre-line">
                {selectedProperty.description}
              </div>

              <div className="pt-4 flex flex-col gap-2 md:gap-3 mt-auto text-sm md:text-base">

                {/* ABRIR MODAL DE CADASTRO */}
                <button
                  onClick={() => setRegisterOpen(true)}
                  className="
                    w-full py-2 md:py-3 rounded-lg text-white 
                    bg-green-600 hover:bg-green-700 
                    text-center font-medium flex items-center justify-center gap-2
                    text-sm md:text-base
                  "
                >
                  entrar em contato
                </button>

                <Button
                  variant="default"
                  className="w-full bg-[#07262d] text-white hover:bg-[#0a3541] py-2 md:py-3 text-sm md:text-base"
                  asChild
                >
                  <Link to="/empreendimentos">
                    Ver mais <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER MODAL */}
      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onLoginClick={() => setRegisterOpen(false)}
        onSubmitRegister={handleRegisterSubmit}
      />
    </section>
  );
};

export default FeaturedProperties;