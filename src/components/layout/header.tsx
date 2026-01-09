'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, LogOut, User, Settings } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui';

interface HeaderProps {
  user?: {
    email: string;
    name?: string;
  } | null;
  showAuthButtons?: boolean;
}

export function Header({ user, showAuthButtons = true }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    try {
      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      window.location.href = '/login';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-black">DNA de Craque</span>
            <span className="ml-2 text-sm text-[#FCD34D] font-semibold">Afiliados</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <div className="w-8 h-8 bg-[#FCD34D] rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-black" />
                  </div>
                  <span className="text-sm font-medium">
                    {user.name || user.email}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                    <Link
                      href="/configuracoes"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Configurações
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : showAuthButtons ? (
              <>
                <Link href="/login">
                  <Button variant="ghost">Entrar</Button>
                </Link>
                <Link href="/registro">
                  <Button>Cadastre-se</Button>
                </Link>
              </>
            ) : null}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            {user ? (
              <>
                <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 bg-[#FCD34D] rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-black" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {user.name || user.email}
                  </span>
                </div>
                <Link
                  href="/dashboard"
                  className="block py-2 text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/configuracoes"
                  className="block py-2 text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Configuracoes
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-red-600"
                >
                  Sair
                </button>
              </>
            ) : showAuthButtons ? (
              <>
                <Link
                  href="/login"
                  className="block py-2 text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Entrar
                </Link>
                <Link
                  href="/registro"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button className="w-full">Cadastre-se</Button>
                </Link>
              </>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}
