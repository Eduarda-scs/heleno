import { TrendingUp, Home, ShieldCheck, LucideUsersRound   } from "lucide-react";
import { motion } from "framer-motion";

export function InvestorProfileSection() {
  const items = [
    {
        icon: TrendingUp,
        title: "Valorização Patrimonial",
        text: "Ideal para quem busca crescimento sólido do patrimônio ao longo do tempo, com histórico consistente de valorização."
    },
    {
        icon: Home,
        title: "Renda com Locação",
        text: "Perfeito para investidores que desejam gerar renda recorrente com locações de alto padrão e alta demanda turística."
    },
    {
        icon: ShieldCheck,
        title: "Segurança e Solidez",
        text: "Indicado para quem prefere ativos reais, estáveis e menos expostos às oscilações do mercado financeiro."
    },
    {
        icon: LucideUsersRound ,
        title: "Lar Seguro para a Família",
        text: "Ideal para famílias que buscam segurança, infraestrutura completa, educação de qualidade e qualidade de vida em um dos municípios mais seguros do país."
    }
    ];


  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">

        {/* Title */}
        <div className="max-w-2xl mb-12">
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground">
            Para quem Balneário Camboriú é ideal?
          </h2>
          <p className="mt-4 text-muted-foreground font-body">
            Um mercado imobiliário que atende diferentes perfis de investidores, com segurança, liquidez e alto potencial de valorização.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="
                    relative
                    overflow-hidden
                    rounded-2xl
                    border border-[#d6b25e]/50
                    bg-[#f4f1ea]
                    p-7
                    transition-all
                    duration-300
                    hover:shadow-[0_18px_38px_-16px_rgba(214,178,94,0.45)]
                "
                >
                {/* Glow dourado sutil */}
                <div
                    className="
                    pointer-events-none
                    absolute inset-0
                    opacity-0
                    hover:opacity-100
                    transition-opacity duration-300
                    bg-[radial-gradient(circle_at_top,rgba(214,178,94,0.18),transparent_65%)]
                    "
                />

                {/* Ícone */}
                <motion.div
                    whileHover={{ scale: 1.06 }}
                    transition={{ type: 'spring', stiffness: 180 }}
                    className="
                    relative z-10
                    w-14 h-14
                    rounded-xl
                    bg-[#e9e3d7]
                    flex items-center justify-center
                    mb-5
                    "
                >
                    <Icon className="text-[#b89a4f]" size={24} />
                </motion.div>

                {/* Conteúdo */}
                <div className="relative z-10">
                    <h3 className="text-lg font-display font-semibold text-[#2e2a24] mb-3">
                    {item.title}
                    </h3>

                    <p className="text-sm font-body leading-relaxed text-[#5a554b]">
                    {item.text}
                    </p>
                </div>
                </motion.div>


            );
          })}
        </div>

      </div>
    </section>
  );
}
