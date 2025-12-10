export default function PoliticasPrivacidade() {
  return (
    <div className="min-h-screen bg-primary text-primary-foreground px-6 py-16">
      <div className="max-w-4xl mx-auto">

        {/* Título */}
        <h1 className="text-4xl font-bold mb-8 text-secondary">
          Política de Privacidade
        </h1>

        <p className="text-primary-foreground/80 mb-6 leading-relaxed">
          A sua privacidade é importante para nós. Esta Política de Privacidade
          explica como coletamos, usamos e protegemos suas informações enquanto
          você utiliza nosso site e serviços imobiliários.
        </p>

        {/* Sessão 1 */}
        <h2 className="text-2xl font-semibold text-secondary mb-3">
          1. Informações que Coletamos
        </h2>
        <p className="text-primary-foreground/80 mb-6">
          Podemos coletar informações pessoais como nome, telefone, e-mail e
          detalhes sobre o imóvel que deseja anunciar ou solicitar. Também
          coletamos informações de navegação, como endereço IP e dados de cookies.
        </p>

        {/* Sessão 2 */}
        <h2 className="text-2xl font-semibold text-secondary mb-3">
          2. Como Utilizamos seus Dados
        </h2>
        <p className="text-primary-foreground/80 mb-6">
          Usamos seus dados para oferecer um atendimento personalizado,
          processar anúncios, entrar em contato, melhorar nossos serviços e
          garantir uma melhor experiência de navegação.
        </p>

        {/* Sessão 3 */}
        <h2 className="text-2xl font-semibold text-secondary mb-3">
          3. Cookies e Tecnologias de Rastreamento
        </h2>
        <p className="text-primary-foreground/80 mb-6">
          Utilizamos cookies para lembrar suas preferências, melhorar o
          desempenho do site e apresentar conteúdos relevantes. Você pode
          aceitar ou recusar cookies através do banner exibido ao acessar o site.
        </p>

        {/* Sessão 4 */}
        <h2 className="text-2xl font-semibold text-secondary mb-3">
          4. Compartilhamento de Informações
        </h2>
        <p className="text-primary-foreground/80 mb-6">
          Seus dados não são vendidos ou compartilhados com terceiros,
          exceto quando necessário para o funcionamento do site ou cumprimento
          de obrigações legais.
        </p>

        {/* Sessão 5 */}
        <h2 className="text-2xl font-semibold text-secondary mb-3">
          5. Segurança das Informações
        </h2>
        <p className="text-primary-foreground/80 mb-6">
          Utilizamos medidas de segurança adequadas para proteger seus dados
          contra acessos não autorizados, alterações ou divulgação.
        </p>

        {/* Sessão 6 */}
        <h2 className="text-2xl font-semibold text-secondary mb-3">
          6. Seus Direitos
        </h2>
        <p className="text-primary-foreground/80 mb-6">
          Você pode solicitar a exclusão, alteração ou consulta de seus dados
          pessoais, conforme previsto na Lei Geral de Proteção de Dados (LGPD).
        </p>

        {/* Sessão 7 */}
        <h2 className="text-2xl font-semibold text-secondary mb-3">
          7. Contato
        </h2>
        <p className="text-primary-foreground/80 mb-6">
          Se tiver dúvidas sobre esta Política de Privacidade, entre em contato
          pelo e-mail:{" "}
          <span className="text-secondary font-semibold">
            contato@bcimoveis.com.br
          </span>
        </p>

        {/* Atualização */}
        <p className="text-xs text-primary-foreground/60 mt-12">
          Última atualização: {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
