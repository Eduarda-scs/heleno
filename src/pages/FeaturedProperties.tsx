import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const properties = [
  {
    id: 1,
    title: "Blue Coast",
    slug: "blue-coast-tower/201",
    image: "/opt-frentemar.webp",
    redirectToList: false, // 👈 vai para /empreendimentos

  },
  {
    id: 2,
    title: "Blue View",
    slug: "blue-view",
    image: "/opt-planta.webp",
    redirectToList: true, // 👈 vai para /empreendimentos

  },
  {
    id: 3,
    title: "Scnarium",
    slug: "scnarium",
    image: "/opt-fgempreendimento.webp",
    redirectToList: true, // 👈 vai para /empreendimentos

  },
  {
    id: 242,
    title: "Senna Tower",
    slug: "senna-tower-o-apice-do-luxo-residencial-no-mundo/242",
    image: "/opt-luxo.webp",
    redirectToList: false, // 👈 vai para /empreendimentos

  },
  {
    id: 5,
    title: "Garden Park",
    slug: "garden-park-home-club/196",
    image: "/opt-localidade.webp",
    redirectToList: false, // 👈 vai para /empreendimentos

  },
  {
    id: 6,
    title: "FG Empreendimento",
    slug: "",
    image: "/opt-fg-innovation.webp",
    redirectToList: true, // 👈 vai para /empreendimentos

  },
];


const FeaturedProperties = () => {
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
          background: linear-gradient(
            180deg,
            rgba(0,0,0,0) 0%,
            rgba(0,0,0,0.6) 100%
          );
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
            Imóveis em{" "}
            <span className="text-secondary font-normal">Destaque</span>
          </h2>
          <p className="text-sm text-white/70">
            Passe o mouse — no mobile toque para abrir.
          </p>
        </div>

        {/* LISTA DE CARDS */}
        <div className="flex-list">
          {properties.map((property) => (
            <Link
              key={property.id}
              to={
                property.redirectToList
                  ? "/empreendimentos"
                  : `/empreendimento/${property.slug}`
              }
              className="flex-item"
            >


              <img src={property.image} alt={property.title} />
              <div className="card-title">
                <h3 className="text-xs font-medium text-white">
                  {property.title}
                </h3>
              </div>
            </Link>
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
    </section>
  );
};

export default FeaturedProperties;
