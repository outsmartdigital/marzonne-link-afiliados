import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'DNA de Craque Afiliados - Plataforma de Afiliados',
  description:
    'Ganhe comissoes indicando atletas e scouts para a plataforma DNA de Craque. Cadastre-se como afiliado e comece a ganhar hoje!',
  keywords: ['afiliados', 'futebol', 'atletas', 'scouts', 'dna de craque'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
