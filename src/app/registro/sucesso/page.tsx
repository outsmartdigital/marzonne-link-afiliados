'use client';

import Link from 'next/link';
import { CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Button, Card, CardContent } from '@/components/ui';
import { Header } from '@/components/layout';

export default function RegistroSucessoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header showAuthButtons={false} />

      <main className="max-w-lg mx-auto px-4 py-16">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-[#FEF9E7] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-[#FCD34D]" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Cadastro realizado com sucesso!
            </h1>

            <p className="text-gray-600 mb-6">
              Sua conta de afiliado foi criada e esta aguardando aprovacao.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-yellow-800 mb-2">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">Aguardando aprovacao</span>
              </div>
              <p className="text-sm text-yellow-700">
                Nossa equipe ira analisar seu cadastro em ate 24 horas. Voce
                recebera um email quando sua conta for aprovada.
              </p>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Apos a aprovacao, voce podera acessar seu painel de afiliado,
              obter seu link exclusivo e comecar a ganhar creditos por cada
              indicacao!
            </p>

            <Link href="/login">
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Ir para Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
