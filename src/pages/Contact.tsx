import { useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  Instagram,
} from "lucide-react";
import { toast } from "sonner";

// Lazy Load components
const Header = lazy(() => import("@/components/Header"));
const Footer = lazy(() => import("@/components/Footer"));
const WhatsAppButton = lazy(() => import("@/components/whatsapp"));

// ⬇⬇ API C2S
import { createLeadC2S } from "@/components/c2sapi";

const contactInfo = [
  {
    icon: Phone,
    title: "Telefone",
    info: "(47) 99263-9593",
    link: "tel:+554792639593",
  },
  {
    icon: Mail,
    title: "Email",
    info: "helenoalves.alves@gmail.com",
    link: "mailto:helenoalves.alves@gmail.com",
  },
  {
    icon: MapPin,
    title: "Endereço",
    info: "Balneário Camboriú, SC",
    link: "#",
  },
  {
    icon: Clock,
    title: "Horário",
    info: "Segunda a Sexta, 9h - 18h",
    link: "#",
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      phone2: formData.phone,
      source: "site_heleno",
      ramal: "",
      city: "",
      neighbourhood: "",
      prop_ref: "",
      type_negotiation: "",
      brand: "",
      model: "",
      description: "",
      price: "",
      url: window.location.href,
      tags: [],
      body: `
Nova mensagem enviada pelo site:

Nome: ${formData.name}
Email: ${formData.email}
Telefone: ${formData.phone}

Mensagem:
${formData.message}
      `,
    };

    try {
      await createLeadC2S(payload);

      toast.success("Mensagem enviada com sucesso!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao enviar mensagem. Tente novamente.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Suspense Loading do Header */}
      <Suspense fallback={<div className="h-20 bg-background" />}>
        <Header />
      </Suspense>

      {/* Hero Section */}
      <section className="relative h-[100vh] flex items-center justify-center overflow-hidden ">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(/opt-hero-balneario.webp)` }}
        />
        <div className="absolute inset-0 bg-primary/70" />

        <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground animate-fade-up">
          <h1 className="text-5xl md:text-6xl font-bwmodelicaLightItalic mb-6">
            Entre em <span className="text-secondary">Contato</span>
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto">
            Estamos prontos para ajudá-lo a encontrar o imóvel perfeito
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-luxury-bg">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={index}
                  href={item.link}
                  className="group bg-card p-6 rounded-xl shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-gold)] transition-all duration-300 hover:-translate-y-1 animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon className="w-8 h-8 text-secondary mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.info}</p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="animate-fade-up">
              <h2 className="text-3xl md:text-4xl font-bwmodelica text-foreground mb-4">
                Envie Sua <span className="text-secondary">Mensagem</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Preencha o formulário e entraremos em contato o mais breve
                possível
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Seu nome"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(47) 99999-9999"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Mensagem *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Como podemos ajudá-lo?"
                    required
                    className="mt-1 min-h-[150px]"
                  />
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full">
                  Enviar Mensagem
                </Button>
              </form>
            </div>

            {/* Additional Contact Options */}
            <div className="animate-fade-up">
              <div className="bg-card p-8 rounded-xl shadow-[var(--shadow-soft)] mb-8">
                <h3 className="text-2xl font-bwmodelica text-foreground mb-4">
                  Ou Fale Conosco Diretamente
                </h3>
                <p className="text-muted-foreground mb-6">
                  Prefere conversar agora? Entre em contato pelos nossos canais
                  diretos
                </p>

                <div className="space-y-4">
                  <Button variant="gold" size="lg" className="w-full" asChild>
                    <a
                      href="https://wa.me/5547992639593"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Conversar no WhatsApp
                    </a>
                  </Button>
                </div>
              </div>

              {/* Redes Sociais */}
              <div className="bg-card p-8 rounded-xl shadow-[var(--shadow-soft)]">
                <h3 className="text-2xl font-bwmodelica text-foreground mb-4">
                  Redes Sociais
                </h3>
                <p className="text-muted-foreground mb-6">
                  Acompanhe nossos lançamentos e novidades
                </p>

                <div className="flex gap-4">
                  <a
                    href="https://www.instagram.com/helenoalvesof?igsh=MW4wNms0dDJiY2U4dg=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center hover:bg-secondary hover:text-primary transition-all hover:scale-110"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Suspense Loading do Footer */}
      <Suspense fallback={<div className="h-20 bg-background" />}>
        <Footer />
      </Suspense>
      <Suspense fallback={<div className="h-28 w-full bg-[#07262d]" />}>
        <WhatsAppButton />
      </Suspense>
    </div>
  );
};

export default Contact;
