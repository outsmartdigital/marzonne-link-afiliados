'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PageLoading } from '@/components/ui';
import { AffiliateLink } from '@/components/dashboard';
import { Affiliate } from '@/types';

export default function MeuLinkPage() {
  const [loading, setLoading] = useState(true);
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const loadAffiliate = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: affiliateData } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (affiliateData) {
        setAffiliate(affiliateData);
      }

      setLoading(false);
    };

    loadAffiliate();
  }, []);

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meu Link de Afiliado</h1>
        <p className="text-gray-600 mt-1">
          Compartilhe seu link e ganhe creditos por cada cadastro realizado
        </p>
      </div>

      {affiliate?.status === 'pending' ? (
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h2 className="font-semibold text-yellow-800 mb-2">
            Conta pendente de aprovacao
          </h2>
          <p className="text-yellow-700">
            Seu link de afiliado estara disponivel apos a aprovacao da sua conta
            pela nossa equipe.
          </p>
        </div>
      ) : affiliate?.status === 'rejected' ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="font-semibold text-red-800 mb-2">Conta rejeitada</h2>
          <p className="text-red-700">
            Sua conta foi rejeitada. Entre em contato com o suporte para mais
            informacoes.
          </p>
        </div>
      ) : affiliate ? (
        <AffiliateLink affiliateCode={affiliate.affiliate_code} />
      ) : (
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-600">
            Nenhum dado de afiliado encontrado.
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Como funciona?</h2>
        <ol className="space-y-3 text-gray-600">
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-[#FEF9E7] text-[#FCD34D] rounded-full flex items-center justify-center text-sm font-semibold">
              1
            </span>
            <span>Compartilhe seu link exclusivo nas redes sociais ou com amigos</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-[#FEF9E7] text-[#FCD34D] rounded-full flex items-center justify-center text-sm font-semibold">
              2
            </span>
            <span>Quando alguem se cadastrar atraves do seu link, voce ganha creditos</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-[#FEF9E7] text-[#FCD34D] rounded-full flex items-center justify-center text-sm font-semibold">
              3
            </span>
            <span>Acumule creditos e resgate quando quiser em Configuracoes</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
