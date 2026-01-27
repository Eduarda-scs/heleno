import { useEffect, useRef, useState } from "react";
import { X, Send, Check, CheckCheck } from "lucide-react";
import { sendLeadToWebhook } from "@/components/c2sapi";

interface Props {
  open: boolean;
  onClose: () => void;
}

type Message = {
  id: string;
  from: "bot" | "user";
  text: string;
  status?: "sent" | "delivered" | "read";
};

type LeadPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
};

const phoneNumber = "5547992639593";

const WhatsappChatModal = ({ open, onClose }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [botTyping, setBotTyping] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [lead, setLead] = useState<LeadPayload>({
    name: "",
    email: "",
    phone: "",
    message: "",
    source: "contact_page",
  });

  /* 🔹 AUTO SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, botTyping]);

  /* 🔹 BOT COM DIGITANDO */
  const sendBotMessage = (text: string) => {
    setBotTyping(true);

    setTimeout(() => {
      setBotTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          from: "bot",
          text,
        },
      ]);
    }, 2000);
  };

  /* 🔹 MENSAGEM INICIAL */
  useEffect(() => {
    if (!open) return;

    setMessages([]);
    setStep(0);
    setLead({
      name: "",
      email: "",
      phone: "",
      message: "",
      source: "contact_page",
    });

    sendBotMessage(
      "Sou Heleno Alves, especialista em imóveis de alto padrão em Balneário Camboriú, com quase 30 anos de experiência. Como posso te chamar?"
    );
  }, [open]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    const messageId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      {
        id: messageId,
        from: "user",
        text: userMessage,
        status: "sent",
      },
    ]);

    setInput("");

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, status: "delivered" } : msg
        )
      );
    }, 300);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, status: "read" } : msg
        )
      );
    }, 600);

    setTimeout(() => {
      handleBotFlow(userMessage);
    }, 400);
  };

  const handleBotFlow = async (userReply: string) => {
    if (step === 0) {
      setLead((prev) => ({ ...prev, name: userReply }));
      sendBotMessage(
        `Prazer, ${userReply}! Para prosseguirmos com um atendimento personalizado, poderia me informar seu e-mail?`
      );
      setStep(1);
      return;
    }

    if (step === 1) {
      setLead((prev) => ({ ...prev, email: userReply }));
      sendBotMessage(
        "Excelente. Poderia me informar seu número de WhatsApp para contato?"
      );
      setStep(2);
      return;
    }

    if (step === 2) {
      setLead((prev) => ({ ...prev, phone: userReply }));
      sendBotMessage(
        "Para finalizar, se desejar, informe brevemente o que procura. Caso não tenha algo específico, pode digitar OK."
      );
      setStep(3);
      return;
    }

    if (step === 3) {
      const finalLead: LeadPayload = {
        ...lead,
        message: userReply,
      };

      setStep(4);

      sendBotMessage(
        "Perfeito. Em instantes, vou te direcionar para o WhatsApp para darmos continuidade ao atendimento."
      );

      await sendLeadToWebhook(finalLead);

      setTimeout(() => {
        const finalMessage = encodeURIComponent(
          `Oi Heleno! Meu nome é ${finalLead.name}
Email: ${finalLead.email}
WhatsApp: ${finalLead.phone}
Mensagem: ${finalLead.message}`
        );

        window.open(
          `https://wa.me/${phoneNumber}?text=${finalMessage}`,
          "_blank"
        );
      }, 2500);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <div className="fixed bottom-0 right-0 left-0 md:bottom-24 md:right-6 md:left-auto pointer-events-auto">
        <div className="bg-[#e5ddd5] w-full h-[75vh] md:w-[300px] md:h-[500px] rounded-t-2xl md:rounded-[28px] flex flex-col overflow-hidden border">

          {/* HEADER */}
          <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/heleno-hero2.webp"
                alt="Heleno"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-sm">Heleno</p>
                <span className="text-xs text-green-200">
                  {botTyping ? "digitando…" : "online"}
                </span>
              </div>
            </div>
            <button onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* MENSAGENS */}
          <div
            className="flex-1 overflow-y-auto p-3 space-y-1.5"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[78%] px-3 py-2 pb-1 rounded-lg text-[13px] ${
                  msg.from === "bot"
                    ? "bg-white self-start rounded-tl-none"
                    : "bg-[#dcf8c6] self-end ml-auto rounded-tr-none"
                }`}
              >
                <span>{msg.text}</span>

                {msg.from === "user" && (
                  <div className="flex justify-end mt-1">
                    {msg.status === "sent" && (
                      <Check className="w-3 h-3 text-gray-500" />
                    )}
                    {msg.status === "delivered" && (
                      <CheckCheck className="w-3 h-3 text-gray-500" />
                    )}
                    {msg.status === "read" && (
                      <CheckCheck className="w-3 h-3 text-blue-500" />
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* BOT DIGITANDO */}
            {botTyping && (
              <div className="bg-white px-3 py-2 rounded-lg w-fit">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}

            {/* ANCHOR */}
            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          {step < 4 && (
            <div className="bg-white p-2 flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Digite sua resposta..."
                className="flex-1 border rounded-full px-4 py-2 text-sm outline-none"
              />
              <button
                onClick={handleSend}
                className="bg-[#25D366] text-white p-2 rounded-full"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsappChatModal;
