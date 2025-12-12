import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const phoneNumber = "5547992639593";
  const message = encodeURIComponent("Oi! Cheguei até você pelo site e queria saber mais sobre os imóveis em Balneário Camboriú.");

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all hover:shadow-xl animate-fade-in-scale group"
      aria-label="Fale conosco pelo WhatsApp"
    >
      <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
    </a>
  );
};

export default WhatsAppButton;
