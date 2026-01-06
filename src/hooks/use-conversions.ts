'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Conversion, ConversionFilters, ConversionStats } from '@/types';

interface UseConversionsReturn {
  conversions: Conversion[];
  stats: ConversionStats[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setFilters: (filters: ConversionFilters) => void;
  filters: ConversionFilters;
  refresh: () => Promise<void>;
  exportCSV: () => void;
}

export function useConversions(affiliateId?: string): UseConversionsReturn {
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [stats, setStats] = useState<ConversionStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState<ConversionFilters>({});

  const supabase = createClient();

  const fetchConversions = useCallback(async () => {
    if (!affiliateId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let query = supabase
        .from('conversions')
        .select('*', { count: 'exact' })
        .eq('affiliate_id', affiliateId)
        .order('conversion_date', { ascending: false });

      // Apply filters
      if (filters.startDate) {
        query = query.gte('conversion_date', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('conversion_date', filters.endDate);
      }
      if (filters.userType && filters.userType !== 'all') {
        query = query.eq('user_type', filters.userType);
      }
      if (filters.status && filters.status !== 'all') {
        query = query.eq('commission_status', filters.status);
      }

      // Pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      setConversions(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar conversoes');
    } finally {
      setLoading(false);
    }
  }, [affiliateId, page, pageSize, filters]);

  const fetchStats = useCallback(async () => {
    if (!affiliateId) return;

    try {
      // Get conversions for the last 30 days for chart
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data } = await supabase
        .from('conversions')
        .select('conversion_date, user_type')
        .eq('affiliate_id', affiliateId)
        .gte('conversion_date', thirtyDaysAgo.toISOString())
        .order('conversion_date', { ascending: true });

      if (!data) return;

      // Group by date
      const groupedStats: Record<string, ConversionStats> = {};

      data.forEach((conv) => {
        const date = new Date(conv.conversion_date).toISOString().split('T')[0];
        if (!groupedStats[date]) {
          groupedStats[date] = { date, athletes: 0, scouts: 0, total: 0 };
        }
        if (conv.user_type === 'athlete') {
          groupedStats[date].athletes++;
        } else {
          groupedStats[date].scouts++;
        }
        groupedStats[date].total++;
      });

      setStats(Object.values(groupedStats));
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, [affiliateId]);

  useEffect(() => {
    fetchConversions();
  }, [fetchConversions]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const exportCSV = () => {
    if (conversions.length === 0) return;

    const headers = ['Data', 'Nome', 'Email', 'Tipo', 'Comissao', 'Status'];
    const rows = conversions.map((conv) => [
      new Date(conv.conversion_date).toLocaleDateString('pt-BR'),
      conv.user_name || '-',
      conv.user_email || '-',
      conv.user_type === 'athlete' ? 'Atleta' : 'Scout',
      `R$ ${conv.commission_amount.toFixed(2)}`,
      conv.commission_status === 'pending'
        ? 'Pendente'
        : conv.commission_status === 'approved'
        ? 'Aprovado'
        : 'Pago',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `conversoes_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    conversions,
    stats,
    loading,
    error,
    totalCount,
    page,
    pageSize,
    setPage,
    setFilters,
    filters,
    refresh: fetchConversions,
    exportCSV,
  };
}
