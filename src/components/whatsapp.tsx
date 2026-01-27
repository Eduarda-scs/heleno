import { useEffect, useState } from "react";
import { X, MessageCircle, Mail } from "lucide-react";
import { sendLeadToWebhook } from "@/components/c2sapi";
import Whatsappmodal  from "@/components/whatsappmodal";

const clients = [
  {
    name: "Ana",
    avatar: "modelo1.jpg",
    message: "Atendimento excelente!"
  },
  {
    name: "Carlos",
    avatar: "modelo2.jpg",
    message: "Fui atendida muito rápido!"
  },
  {
    name: "Juliana",
    avatar: "modelo3.jpg",
    message: "Recomendo demais!"
  },
  {
    name: "Marcos",
    avatar: "modelo4.jpg",
    message: "Corretor super atencioso!"
  }

];

const FloatingContactWidget = () => {
  const [openOptions, setOpenOptions] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [sent, setSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [clientIndex, setClientIndex] = useState(0);
  const [showMessageCTA, setShowMessageCTA] = useState(false);
  const [showWhatsappIcon, setShowWhatsappIcon] = useState(false);



  const currentClient = clients[clientIndex];


  const phoneNumber = "5547992639593";
  const message = encodeURIComponent(
    "Oi! Cheguei até você pelo site e queria saber mais sobre os imóveis em Balneário Camboriú."
  );
  


  // Mostra opções automaticamente a cada 30s
  useEffect(() => {
    if (sent) return;

    const interval = setInterval(() => {
      setShowWhatsappIcon((prev) => !prev);

      if (!showWhatsappIcon) {
        // troca cliente
        setClientIndex((prev) => (prev + 1) % clients.length);
      }

      setShowMessageCTA(true);

      setTimeout(() => {
        setShowMessageCTA(false);
      }, 6000);
    }, 8000); // pode ajustar o tempo aqui

    return () => clearInterval(interval);
  }, [sent, showWhatsappIcon]);




  return (
    <>
      <Whatsappmodal
        open={openChat}
        onClose={() => setOpenChat(false)}
        avatar={currentClient.avatar}
        name="Heleno"
      />


      {/* ===== WIDGET FLUTUANTE ===== */}
      <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
        {/* CARD DE OPÇÕES 
        {openOptions && !sent && (
          <div className="bg-white rounded-2xl shadow-xl p-4 w-[260px] animate-slideLeft">
            <p className="text-sm text-neutral-700 mb-3">
              Como prefere falar com a gente?
            </p>

            <a
              href={`https://wa.me/${phoneNumber}?text=${message}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full bg-[#25D366] text-white px-4 py-2 rounded-xl hover:opacity-90"
            >
              <MessageCircle className="w-5 h-5" />
              Falar no WhatsApp
            </a>

            <button
              onClick={() => {
                setOpenModal(true);
                setOpenOptions(false);
              }}
              className="mt-2 flex items-center gap-3 w-full border px-4 py-2 rounded-xl hover:bg-neutral-50"
            >
              <Mail className="w-5 h-5 text-primary" />
              Deixar contato
            </button>
          </div>
        )}""*/}
        {showMessageCTA && !sent && (
          <button
            onClick={() => {
              setOpenChat(true);
              setShowMessageCTA(false);
            }}
            className="bg-white text-sm text-neutral-800 px-4 py-2 rounded-full shadow-lg animate-slideLeft max-w-[240px]"
          >
            {showWhatsappIcon ? (
              <>Fale com o melhor corretor de Balneário Camboriú!!</>
            ) : (
              <> {currentClient.message}</>
            )}
          </button>
        )}


    


        {/* BOTÃO PRINCIPAL */}
        <button
          onClick={() => {
            setOpenChat(true);
            setShowMessageCTA(false);
          }}
          className="relative w-14 h-14 rounded-full shadow-xl overflow-hidden hover:scale-110 transition bg-[#25D366] flex items-center justify-center"
        >
          {showWhatsappIcon ? (
            <MessageCircle className="w-7 h-7 text-white" />
          ) : (
            <img
              key={currentClient.avatar}
              src={`/${currentClient.avatar}`}
              alt={currentClient.name}
              className="w-full h-full object-cover rounded-full"
            />
          )}
        </button>


      </div>
    </>
  );
};

export default FloatingContactWidget;
