// src/pages/PoliticasCookies.tsx

export default function PoliticasCookies() {
  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] px-6 md:px-16 lg:px-32 py-16">

      {/* Título */}
      <h1 className="text-4xl font-bold mb-8 text-[#1a1a1a]">
        Política de Cookies
      </h1>

      {/* Introdução */}
      <p className="text-lg leading-relaxed mb-6 text-[#3d3d3d]">
        Esta Política de Cookies explica o que são cookies, como utilizamos no
        nosso site e como você pode gerenciar ou desativar esses arquivos.
      </p>

      {/* Secção */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3 text-[#1a1a1a]">
          1. O que são Cookies?
        </h2>
        <p className="leading-relaxed text-[#3d3d3d]">
          Cookies são pequenos arquivos armazenados no seu dispositivo quando você
          acessa um site. Eles ajudam o site a funcionar corretamente e lembrar
          informações importantes para melhorar sua experiência.
        </p>
      </section>

      {/* Secção */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3 text-[#1a1a1a]">
          2. Como utilizamos Cookies?
        </h2>

        <ul className="list-disc ml-6 space-y-2 text-[#3d3d3d]">
          <li>
            <b>Cookies Essenciais:</b> permitem que recursos básicos do site funcionem corretamente.
          </li>
          <li>
            <b>Cookies de Desempenho:</b> analisam como os usuários interagem com o site para melhorarmos continuamente.
          </li>
          <li>
            <b>Cookies de Funcionalidade:</b> lembram suas preferências, como idioma e configurações.
          </li>
          <li>
            <b>Cookies de Marketing:</b> utilizados para exibir anúncios relevantes (se aplicável).
          </li>
        </ul>
      </section>

      {/* Secção */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3 text-[#1a1a1a]">
          3. Como controlar Cookies?
        </h2>

        <p className="leading-relaxed text-[#3d3d3d] mb-3">
          Você pode desativar ou excluir cookies diretamente nas configurações do seu navegador. 
          No entanto, desativar cookies essenciais pode afetar o funcionamento do site.
        </p>
      </section>

      {/* Secção */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3 text-[#1a1a1a]">
          4. Cookies de Terceiros
        </h2>

        <p className="leading-relaxed text-[#3d3d3d]">
          Alguns serviços utilizados em nosso site, como Google Analytics ou vídeos incorporados, 
          podem armazenar seus próprios cookies para registrar estatísticas ou melhorar sua experiência.
        </p>
      </section>

      {/* Secção */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3 text-[#1a1a1a]">
          5. Atualizações desta Política
        </h2>

        <p className="leading-relaxed text-[#3d3d3d]">
          Esta política pode ser atualizada periodicamente. Sempre que ocorrer uma alteração,
          a data de atualização será exibida no início desta página.
        </p>
      </section>

      {/* Secção */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3 text-[#1a1a1a]">
          6. Contato
        </h2>

        <p className="leading-relaxed text-[#3d3d3d]">
          Se tiver alguma dúvida sobre esta Política de Cookies, entre em contato:
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
