'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Affiliate, AffiliateStats } from '@/types';
import { generateAffiliateCode } from '@/lib/utils';

interface UseAffiliateReturn {
  affiliate: Affiliate | null;
  stats: AffiliateStats | null;
  loading: boolean;
  error: string | null;
  createAffiliate: (data: CreateAffiliateData) => Promise<{ error: Error | null }>;
  updateAffiliate: (data: Partial<Affiliate>) => Promise<{ error: Error | null }>;
  refreshAffiliate: () => Promise<void>;
  refreshStats: () => Promise<void>;
}

interface CreateAffiliateData {
  name: string;
  email: string;
  phone: string;
  userId: string;
}

export function useAffiliate(): UseAffiliateReturn {
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchAffiliate = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setAffiliate(null);
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      setAffiliate(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar afiliado');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    if (!affiliate) return;

    try {
      const now = new Date();
      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const last90Days = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();

      // Total conversions
      const { count: totalConversions } = await supabase
        .from('conversions')
        .select('*', { count: 'exact', head: true })
        .eq('affiliate_id', affiliate.id);

      // Last 7 days
      const { count: conversionsLast7Days } = await supabase
        .from('conversions')
        .select('*', { count: 'exact', head: true })
        .eq('affiliate_id', affiliate.id)
        .gte('conversion_date', last7Days);

      // Last 30 days
      const { count: conversionsLast30Days } = await supabase
        .from('conversions')
        .select('*', { count: 'exact', head: true })
        .eq('affiliate_id', affiliate.id)
        .gte('conversion_date', last30Days);

      // Last 90 days
      const { count: conversionsLast90Days } = await supabase
        .from('conversions')
        .select('*', { count: 'exact', head: true })
        .eq('affiliate_id', affiliate.id)
        .gte('conversion_date', last90Days);

      // Pending withdrawals
      const { data: pendingWithdrawals } = await supabase
        .from('withdrawal_requests')
        .select('amount')
        .eq('affiliate_id', affiliate.id)
        .eq('status', 'pending');

      const pendingAmount =
        pendingWithdrawals?.reduce((acc, item) => acc + (item.amount || 0), 0) || 0;

      // Paid withdrawals
      const { data: paidWithdrawals } = await supabase
        .from('withdrawal_requests')
        .select('amount')
        .eq('affiliate_id', affiliate.id)
        .eq('status', 'paid');

      const paidAmount =
        paidWithdrawals?.reduce((acc, item) => acc + (item.amount || 0), 0) || 0;

      setStats({
        totalConversions: totalConversions || 0,
        conversionsLast7Days: conversionsLast7Days || 0,
        conversionsLast30Days: conversionsLast30Days || 0,
        conversionsLast90Days: conversionsLast90Days || 0,
        creditBalance: affiliate.credit_balance || 0,
        pendingWithdrawals: pendingAmount,
        totalWithdrawn: paidAmount,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, [affiliate]);

  useEffect(() => {
    fetchAffiliate();
  }, [fetchAffiliate]);

  useEffect(() => {
    if (affiliate) {
      fetchStats();
    }
  }, [affiliate, fetchStats]);

  const createAffiliate = async (data: CreateAffiliateData) => {
    try {
      // Generate unique affiliate code
      let affiliateCode = generateAffiliateCode();
      let attempts = 0;

      // Check if code exists
      while (attempts < 5) {
        const { data: existing } = await supabase
          .from('affiliates')
          .select('id')
          .eq('affiliate_code', affiliateCode)
          .single();

        if (!existing) break;
        affiliateCode = generateAffiliateCode();
        attempts++;
      }

      const { error: insertError } = await supabase.from('affiliates').insert({
        user_id: data.userId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        affiliate_code: affiliateCode,
        status: 'pending',
        credit_balance: 0,
      });

      if (insertError) throw insertError;

      await fetchAffiliate();
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const updateAffiliate = async (data: Partial<Affiliate>) => {
    if (!affiliate) {
      return { error: new Error('Afiliado nao encontrado') };
    }

    try {
      const { error: updateError } = await supabase
        .from('affiliates')
        .update(data)
        .eq('id', affiliate.id);

      if (updateError) throw updateError;

      await fetchAffiliate();
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  return {
    affiliate,
    stats,
    loading,
    error,
    createAffiliate,
    updateAffiliate,
    refreshAffiliate: fetchAffiliate,
    refreshStats: fetchStats,
  };
}
