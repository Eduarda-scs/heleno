import { useEffect, useState } from "react";
import { X, MessageCircle } from "lucide-react";

function LeadModal() {
  const [openModal, setOpenModal] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [sent, setSent] = useState(false);

  // Abre assim que carrega
  useEffect(() => {
    setOpenModal(true);
  }, []);

  return (
    <>
      {/* MODAL */}
      {openModal && (
        <div className="fixed bottom-6 right-6 z-[9999]">
          <div className="w-[340px] rounded-2xl bg-white shadow-2xl border animate-slideUp">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="text-lg font-semibold text-neutral-800">
                Deixe seu contato
              </h2>
              <button
                onClick={() => {
                  setOpenModal(false);
                  setShowBubble(true);
                }}
              >
                <X className="w-5 h-5 text-neutral-500 hover:text-neutral-800" />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="p-4">
              {!sent ? (
                <form
                  className="space-y-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                >
                  <p className="text-sm text-neutral-600">
                    Preencha seus dados para entrarmos em contato com você.
                  </p>

                  <input
                    required
                    type="text"
                    placeholder="Nome"
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />

                  <input
                    required
                    type="tel"
                    placeholder="Telefone"
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />

                  <input
                    required
                    type="email"
                    placeholder="E-mail"
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />

                  <textarea
                    required
                    placeholder="Mensagem"
                    rows={3}
                    className="w-full rounded-lg border px-3 py-2 text-sm resize-none outline-none focus:ring-2 focus:ring-primary"
                  />

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-primary py-2 text-white font-medium hover:opacity-90 transition"
                  >
                    Enviar contato
                  </button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold text-primary">
                    Obrigado! 🎉
                  </h3>
                  <p className="text-sm text-neutral-600 mt-2">
                    Em breve entraremos em contato.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BOTÃO FLUTUANTE */}
      {showBubble && (
        <button
          onClick={() => {
            setOpenModal(true);
            setShowBubble(false);
          }}
          className="
            fixed 
            bottom-[96px] 
            right-6 
            z-[9999]
            w-14 
            h-14 
            rounded-full 
            bg-primary 
            shadow-xl 
            flex 
            items-center 
            justify-center
            animate-float
            hover:scale-105
            transition
          "
          aria-label="Abrir formulário"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      )}
    </>
  );
}

export default LeadModal;
