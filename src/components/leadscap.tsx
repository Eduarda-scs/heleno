import { useEffect, useState } from "react";
import { X } from "lucide-react";

 function LeadModal() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  // Abre assim que a página carregar
  useEffect(() => {
    setOpen(true);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <div className="w-[340px] rounded-2xl bg-white shadow-2xl border animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-semibold text-neutral-800">
            Deixe seu contato
          </h2>
          <button onClick={() => setOpen(false)}>
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

                // 👉 aqui depois você conecta com API / WhatsApp / CRM
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
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none focus:ring-2 focus:ring-primary"
                rows={3}
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
                Em breve entraremos em contato com você.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeadModal;