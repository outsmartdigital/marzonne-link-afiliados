import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-[#FCD34D]">
                DNA de Craque
              </span>
              <span className="ml-2 text-sm text-gray-500">Afiliados</span>
            </Link>
            <p className="mt-3 text-sm text-gray-500">
              Plataforma de afiliados para conectar talentos do esporte com
              oportunidades.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Links
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/sobre"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Sobre
                </Link>
              </li>
              <li>
                <Link
                  href="/termos"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidade"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Politica de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Contato
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="mailto:contato@marzonne.com"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  contato@marzonne.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-400 text-center">
            &copy; {currentYear} DNA de Craque. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
