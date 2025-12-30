import { useEffect, useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { sendLeadToWebhook } from "@/components/c2sapi";

function LeadModal() {
  const [openModal, setOpenModal] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [sent, setSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Abre o modal assim que carrega
  useEffect(() => {
    setOpenModal(true);
  }, []);

  // Exibe mensagem estilo WhatsApp a cada 30s
  useEffect(() => {
    if (sent) return;

    const interval = setInterval(() => {
      if (!openModal) {
        setShowBubble(true);
        setShowHint(true);

        // some automaticamente
        setTimeout(() => {
          setShowHint(false);
        }, 5000);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [openModal, sent]);

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
                  onSubmit={async (e) => {
                    e.preventDefault();

                    const form = e.currentTarget;
                    const formData = new FormData(form);

                    const email = (formData.get("email") as string).trim();

                    // valida Gmail
                    if (!/^[^\s@]+@gmail\.com$/i.test(email)) {
                      setEmailError(
                        "Digite um e-mail válido do Gmail (ex: nome@gmail.com)"
                      );
                      return;
                    }

                    setEmailError(null);

                    await sendLeadToWebhook({
                      name: formData.get("name") as string,
                      email,
                      phone: formData.get("phone") as string,
                      message: formData.get("message") as string,
                      source: "modal",
                    });

                    setSent(true);
                  }}
                >
                  <p className="text-sm text-neutral-600">
                    Preencha seus dados para entrarmos em contato com você.
                  </p>

                  <input
                    name="name"
                    required
                    type="text"
                    placeholder="Nome"
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />

                  <input
                    name="phone"
                    required
                    type="tel"
                    placeholder="Telefone"
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />

                  {/* EMAIL */}
                  <div>
                    <input
                      name="email"
                      required
                      type="email"
                      placeholder="E-mail"
                      onChange={() => setEmailError(null)}
                      className={`
                        w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2
                        ${
                          emailError
                            ? "border-red-500 focus:ring-red-500"
                            : "focus:ring-primary"
                        }
                      `}
                    />

                    {emailError && (
                      <p className="text-xs text-red-500 mt-1">
                        {emailError}
                      </p>
                    )}
                  </div>

                  <textarea
                    name="message"
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

      {/* BOLHA + MENSAGEM */}
      {showBubble && (
        <div className="fixed bottom-[160px] right-6 z-[9999] flex flex-col items-end gap-2">
          {showHint && (
            <div className="bg-white text-sm text-neutral-800 px-4 py-2 rounded-2xl shadow-lg animate-fadeIn">
              Deixe seu contato 💬
            </div>
          )}

          <button
            onClick={() => {
              setOpenModal(true);
              setShowBubble(false);
              setShowHint(false);
            }}
            className="
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
        </div>
      )}
    </>
  );
}

export default LeadModal;
