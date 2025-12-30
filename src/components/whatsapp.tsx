import { useEffect, useState } from "react";
import { X, MessageCircle, Mail } from "lucide-react";
import { sendLeadToWebhook } from "@/components/c2sapi";

const FloatingContactWidget = () => {
  const [openOptions, setOpenOptions] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [sent, setSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const phoneNumber = "5547992639593";
  const message = encodeURIComponent(
    "Oi! Cheguei até você pelo site e queria saber mais sobre os imóveis em Balneário Camboriú."
  );

  // Mostra opções automaticamente a cada 30s
  useEffect(() => {
    if (sent) return;

    const interval = setInterval(() => {
      setOpenOptions(true);

      setTimeout(() => {
        setOpenOptions(false);
      }, 7000);
    }, 20000);

    return () => clearInterval(interval);
  }, [sent]);

  return (
    <>
      {/* ===== MODAL DE LEAD ===== */}
      {openModal && (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-end md:items-center justify-center">
          <div className="bg-white w-full md:w-[380px] rounded-t-2xl md:rounded-2xl shadow-2xl animate-slideUp">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="text-lg font-semibold">Deixe seu contato</h2>
              <button onClick={() => setOpenModal(false)}>
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            <div className="p-4">
              {!sent ? (
                <form
                  className="space-y-3"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const email = (formData.get("email") as string).trim();

                    if (!/^[^\s@]+@gmail\.com$/i.test(email)) {
                      setEmailError(
                        "Digite um e-mail válido do Gmail (ex: nome@gmail.com)"
                      );
                      return;
                    }

                    setEmailError(null);

                    await sendLeadToWebhook({
                      name: formData.get("name") as string,
                      phone: formData.get("phone") as string,
                      email,
                      message: formData.get("message") as string,
                      source: "floating-widget",
                    });

                    setSent(true);
                  }}
                >
                  <input
                    name="name"
                    required
                    placeholder="Nome"
                    className="w-full border rounded-lg px-3 py-2"
                  />

                  <input
                    name="phone"
                    required
                    placeholder="Telefone"
                    className="w-full border rounded-lg px-3 py-2"
                  />

                  <div>
                    <input
                      name="email"
                      required
                      placeholder="E-mail (Gmail)"
                      onChange={() => setEmailError(null)}
                      className={`w-full border rounded-lg px-3 py-2 ${
                        emailError && "border-red-500"
                      }`}
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
                    rows={3}
                    placeholder="Mensagem"
                    className="w-full border rounded-lg px-3 py-2"
                  />

                  <button className="w-full bg-primary text-white py-2 rounded-xl">
                    Enviar contato
                  </button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold text-primary">
                    Obrigado! 🎉
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Em breve entraremos em contato.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== WIDGET FLUTUANTE ===== */}
      <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
        {/* CARD DE OPÇÕES */}
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
        )}

        {/* BOTÃO PRINCIPAL */}
        <button
          onClick={() => setOpenOptions((prev) => !prev)}
          className="bg-[#25D366] text-white p-4 rounded-full shadow-xl hover:scale-110 transition"
          aria-label="Abrir opções de contato"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    </>
  );
};

export default FloatingContactWidget;
