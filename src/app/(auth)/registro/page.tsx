import Link from 'next/link';
import { Header } from '@/components/layout';
import { AffiliateRegisterForm } from '@/components/forms';

export default function RegistroPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header showAuthButtons={false} />

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Torne-se um Afiliado
          </h1>
          <p className="mt-2 text-gray-600">
            Preencha seus dados para criar sua conta de afiliado
          </p>
        </div>

        <AffiliateRegisterForm />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Ja tem uma conta?{' '}
            <Link
              href="/login"
              className="text-[#FCD34D] hover:text-black font-medium"
            >
              Entrar
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
