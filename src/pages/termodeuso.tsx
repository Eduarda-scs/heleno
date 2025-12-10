export default function TermosUso() {
  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] px-6 md:px-16 lg:px-32 py-16">

      {/* Título */}
      <h1 className="text-4xl font-bold mb-8 text-[#1a1a1a]">
        Termos de Uso
      </h1>

      {/* Introdução */}
      <p className="text-lg leading-relaxed mb-6 text-[#3d3d3d]">
        Estes Termos de Uso descrevem as regras e condições para utilização do
        nosso site e serviços. Ao acessar nosso site, você concorda integralmente
        com estes termos. Caso não concorde, recomendamos que não utilize o serviço.
      </p>

      {/* Seção 1 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3 text-[#1a1a1a]">
          1. Aceitação dos Termos
        </h2>
        <p className="leading-relaxed text-[#3d3d3d]">
          Ao utilizar o site, você confirma que leu, compreendeu e aceita todas as
          condições descritas nesta página. Podemos atualizar os termos
          periodicamente, e o uso contínuo do site após modificações constitui
          aceitação das versões atualizadas.
        </p>
      </section>

      {/* Seção 2 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3 text-[#1a1a1a]">
          2. Uso Permitido
        </h2>
        <p className="leading-relaxed text-[#3d3d3d] mb-4">
          O usuário concorda em utilizar o site apenas para fins legais e de
          maneira que não infrinja direitos ou restrições de uso.
        </p>

        <ul className="list-disc ml-6 space-y-2 text-[#3d3d3d]">
          <li>Não utilizar o site para atividades fraudulentas.</li>
          <li>Não tentar invadir ou burlar sistemas de segurança.</li>
          <li>Não enviar conteúdos ofensivos, discriminatórios ou ilegais.</li>
          <li>Não copiar, distribuir ou reutilizar conteúdos protegidos.</li>
        </ul>
      </section>

      {/* Seção 3 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3 text-[#1a1a1a]">
          3. Responsabilidades do Usuário
        </h2>

        <p className="leading-relaxed text-[#3d3d3d]">
          O usuário é responsável por garantir a veracidade das informações
          fornecidas, manter a segurança de sua conta e respeitar as leis
          aplicáveis ao utilizar o site.
        </p>
      </section>

      {/* Seção 4 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3 text-[#1a1a1a]">
          4. Propriedade Intelectual
        </h2>

        <p className="leading-relaxed text-[#3d3d3d]">
          Todo o conteúdo presente no site — textos, imagens, logotipos, designs
          e códigos — é protegido por direitos autorais e não pode ser reproduzido
          ou distribuído sem autorização prévia.
        </p>
      </section>

      {/* Seção 5 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3 text-[#1a1a1a]">
          5. Limitação de Responsabilidade
        </h2>

        <p className="leading-relaxed text-[#3d3d3d]">
          Nos esforçamos para manter o site funcionando corretamente, porém não
          nos responsabilizamos por indisponibilidades temporárias, falhas de
          terceiros, perdas de dados ou danos resultantes do uso do site.
        </p>
      </section>

      {/* Seção 6 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3 text-[#1a1a1a]">
          6. Modificações nos Termos
        </h2>

        <p className="leading-relaxed text-[#3d3d3d]">
          Estes Termos de Uso podem ser modificados a qualquer momento. Sempre
          divulgaremos a data da última atualização no início desta página. O
          uso contínuo após atualizações implica sua concordância.
        </p>
      </section>

      {/* Seção 7 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3 text-[#1a1a1a]">
          7. Contato
        </h2>

        <p className="leading-relaxed text-[#3d3d3d]">
          Caso tenha dúvidas sobre estes Termos de Uso, entre em contato:
        </p>

        <p className="mt-2 text-[#3d3d3d]">
          📧 <b>Email:</b> contato@helenoalves.com <br />
          📞 <b>Telefone:</b> (XX) XXXXX-XXXX
        </p>
      </section>

      {/* Rodapé */}
      <footer className="mt-16 pt-6 border-t border-gray-300 text-sm text-gray-500">
        Heleno Alves — Todos os direitos reservados © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
