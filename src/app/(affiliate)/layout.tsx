'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout';
import { Sidebar, MobileNav } from '@/components/layout';
import { PageLoading } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';
import { Affiliate } from '@/types';

export default function AffiliateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        router.push('/login');
        return;
      }

      setUser({
        email: authUser.email || '',
        name: authUser.user_metadata?.name,
      });

      // Get affiliate data
      const { data: affiliateData } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      setAffiliate(affiliateData);
      setLoading(false);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 z-30">
        <Header user={user} />
      </div>

      <Sidebar />

      <main className="lg:pl-64 pt-16 pb-20 lg:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {affiliate?.status === 'pending' && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Conta pendente de aprovacao:</strong> Sua conta esta em
                analise. Voce podera compartilhar seu link assim que for
                aprovado.
              </p>
            </div>
          )}
          {affiliate?.status === 'rejected' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Conta rejeitada:</strong> Sua conta foi rejeitada. Entre
                em contato com o suporte para mais informacoes.
              </p>
            </div>
          )}
          {children}
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
