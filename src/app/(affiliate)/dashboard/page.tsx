'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Users, TrendingUp, Wallet, Calendar, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { PageLoading, Card, CardContent, Button } from '@/components/ui';
import {
  StatsCard,
  AffiliateLink,
  ConversionsChart,
  RecentRegistrations,
} from '@/components/dashboard';
import { Affiliate, AffiliateStats, Conversion, ConversionStats } from '@/types';
import { formatCurrency } from '@/lib/utils';

function DashboardContent() {
  const [loading, setLoading] = useState(true);
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [chartData, setChartData] = useState<ConversionStats[]>([]);
  const searchParams = useSearchParams();
  const isWelcome = searchParams.get('welcome') === 'true';

  const supabase = createClient();

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Get affiliate
      const { data: affiliateData } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (affiliateData) {
        setAffiliate(affiliateData);

        // Get stats
        const now = new Date();
        const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const last90Days = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();

        const [
          { count: totalConversions },
          { count: conversionsLast7Days },
          { count: conversionsLast30Days },
          { count: conversionsLast90Days },
          { data: pendingWithdrawals },
          { data: paidWithdrawals },
          { data: recentConversions },
        ] = await Promise.all([
          supabase
            .from('conversions')
            .select('*', { count: 'exact', head: true })
            .eq('affiliate_id', affiliateData.id),
          supabase
            .from('conversions')
            .select('*', { count: 'exact', head: true })
            .eq('affiliate_id', affiliateData.id)
            .gte('conversion_date', last7Days),
          supabase
            .from('conversions')
            .select('*', { count: 'exact', head: true })
            .eq('affiliate_id', affiliateData.id)
            .gte('conversion_date', last30Days),
          supabase
            .from('conversions')
            .select('*', { count: 'exact', head: true })
            .eq('affiliate_id', affiliateData.id)
            .gte('conversion_date', last90Days),
          supabase
            .from('withdrawal_requests')
            .select('amount')
            .eq('affiliate_id', affiliateData.id)
            .eq('status', 'pending'),
          supabase
            .from('withdrawal_requests')
            .select('amount')
            .eq('affiliate_id', affiliateData.id)
            .eq('status', 'paid'),
          supabase
            .from('conversions')
            .select('*')
            .eq('affiliate_id', affiliateData.id)
            .order('conversion_date', { ascending: false })
            .limit(5),
        ]);

        const pendingAmount =
          pendingWithdrawals?.reduce((acc, item) => acc + (item.amount || 0), 0) || 0;
        const paidAmount =
          paidWithdrawals?.reduce((acc, item) => acc + (item.amount || 0), 0) || 0;

        setStats({
          totalConversions: totalConversions || 0,
          conversionsLast7Days: conversionsLast7Days || 0,
          conversionsLast30Days: conversionsLast30Days || 0,
          conversionsLast90Days: conversionsLast90Days || 0,
          creditBalance: affiliateData.credit_balance || 0,
          pendingWithdrawals: pendingAmount,
          totalWithdrawn: paidAmount,
        });

        setConversions(recentConversions || []);

        // Get chart data
        const { data: chartConversions } = await supabase
          .from('conversions')
          .select('conversion_date, user_type')
          .eq('affiliate_id', affiliateData.id)
          .gte('conversion_date', last30Days)
          .order('conversion_date', { ascending: true });

        if (chartConversions) {
          const grouped: Record<string, ConversionStats> = {};
          chartConversions.forEach((conv) => {
            const date = new Date(conv.conversion_date).toISOString().split('T')[0];
            if (!grouped[date]) {
              grouped[date] = { date, athletes: 0, scouts: 0, total: 0 };
            }
            if (conv.user_type === 'athlete') {
              grouped[date].athletes++;
            } else {
              grouped[date].scouts++;
            }
            grouped[date].total++;
          });
          setChartData(Object.values(grouped));
        }
      }

      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome message */}
      {isWelcome && (
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="py-4">
            <p className="text-emerald-800">
              <strong>Bem-vindo ao Marzonne Afiliados!</strong> Sua conta foi
              criada com sucesso. Compartilhe seu link e comece a ganhar creditos!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Acompanhe suas conversoes e creditos
        </p>
      </div>

      {/* Credit Balance Card */}
      <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
        <CardContent className="py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5" />
                <span className="text-emerald-100">Saldo Disponivel</span>
              </div>
              <p className="text-4xl font-bold">
                {formatCurrency(affiliate?.credit_balance || 0)}
              </p>
              {(stats?.pendingWithdrawals || 0) > 0 && (
                <p className="text-emerald-100 text-sm mt-1">
                  + {formatCurrency(stats?.pendingWithdrawals || 0)} em processamento
                </p>
              )}
            </div>
            <Link href="/configuracoes">
              <Button
                className="bg-white text-emerald-600 hover:bg-emerald-50"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Resgatar Creditos
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total de Cadastros"
          value={stats?.totalConversions || 0}
          icon={Users}
          description="Desde o inicio"
        />
        <StatsCard
          title="Ultimos 7 dias"
          value={stats?.conversionsLast7Days || 0}
          icon={Calendar}
        />
        <StatsCard
          title="Ultimos 30 dias"
          value={stats?.conversionsLast30Days || 0}
          icon={Calendar}
        />
        <StatsCard
          title="Total Resgatado"
          value={formatCurrency(stats?.totalWithdrawn || 0)}
          icon={TrendingUp}
        />
      </div>

      {/* Affiliate Link */}
      {affiliate && <AffiliateLink affiliateCode={affiliate.affiliate_code} />}

      {/* Charts and Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConversionsChart data={chartData} />
        <RecentRegistrations conversions={conversions} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <DashboardContent />
    </Suspense>
  );
}
