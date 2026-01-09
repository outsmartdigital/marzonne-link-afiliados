'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Download, Smartphone } from 'lucide-react';
import { Header } from '@/components/layout';
import { Button, Card, CardContent, PageLoading } from '@/components/ui';
import { AppDownloadButtons } from '@/components/common';
import { QRCode } from '@/components/common';

function SucessoContent() {
  const searchParams = useSearchParams();
  const userType = searchParams.get('type') || 'athlete';

  const appStoreUrl = process.env.NEXT_PUBLIC_APP_STORE_URL || 'https://apps.apple.com/app/marzonne';
  const playStoreUrl = process.env.NEXT_PUBLIC_PLAY_STORE_URL || 'https://play.google.com/store/apps/details?id=com.marzonne';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showAuthButtons={false} />

      <main className="max-w-2xl mx-auto px-4 py-12">
        <Card>
          <CardContent className="p-8 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-[#FEF9E7] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-[#FCD34D]" />
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Cadastro realizado com sucesso!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {userType === 'athlete'
                ? 'Bem-vindo ao DNA de Craque! Agora voce pode mostrar seu talento para scouts e clubes de todo o Brasil.'
                : 'Bem-vindo ao DNA de Craque! Agora voce pode descobrir novos talentos e encontrar os melhores atletas.'}
            </p>

            {/* Next Steps */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
                <Smartphone className="w-5 h-5" />
                Proximos passos
              </h2>
              <ol className="text-left space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#FCD34D] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">
                    1
                  </span>
                  <span>Baixe o aplicativo DNA de Craque no seu celular</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#FCD34D] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">
                    2
                  </span>
                  <span>Faca login com o email e senha que voce cadastrou</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#FCD34D] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">
                    3
                  </span>
                  <span>
                    {userType === 'athlete'
                      ? 'Complete seu perfil e envie seus videos para ser descoberto!'
                      : 'Explore o catalogo de atletas e encontre novos talentos!'}
                  </span>
                </li>
              </ol>
            </div>

            {/* Download Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Baixe o App
              </h3>
              <div className="flex justify-center">
                <AppDownloadButtons
                  appStoreUrl={appStoreUrl}
                  playStoreUrl={playStoreUrl}
                />
              </div>
            </div>

            {/* QR Code */}
            <div className="border-t border-gray-200 pt-8">
              <p className="text-sm text-gray-500 mb-4">
                Ou escaneie o QR Code abaixo com seu celular:
              </p>
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <QRCode value={appStoreUrl} size={100} />
                  <p className="text-xs text-gray-500 mt-2">App Store</p>
                </div>
                <div className="text-center">
                  <QRCode value={playStoreUrl} size={100} />
                  <p className="text-xs text-gray-500 mt-2">Google Play</p>
                </div>
              </div>
            </div>

            {/* Email Confirmation */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Importante:</strong> Verifique sua caixa de entrada para
                confirmar seu email. Caso nao encontre, verifique a pasta de spam.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-[#FCD34D] hover:text-black text-sm">
            Voltar para a pagina inicial
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function SucessoPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <SucessoContent />
    </Suspense>
  );
}
