'use client';

import { useEffect, useState } from 'react';
import { Download, Filter, Search, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
  Button,
  Input,
  Select,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
  Badge,
  PageLoading,
} from '@/components/ui';
import { Conversion, Affiliate } from '@/types';
import { formatDateTime } from '@/lib/utils';

const userTypeOptions = [
  { value: 'all', label: 'Todos os tipos' },
  { value: 'athlete', label: 'Atletas' },
  { value: 'scout', label: 'Scouts' },
];

const statusOptions = [
  { value: 'all', label: 'Todos os status' },
  { value: 'pending', label: 'Pendente' },
  { value: 'approved', label: 'Aprovado' },
  { value: 'paid', label: 'Pago' },
];

export default function CadastrosPage() {
  const [loading, setLoading] = useState(true);
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const pageSize = 10;

  const supabase = createClient();

  const loadConversions = async () => {
    if (!affiliate) return;

    setLoading(true);

    let query = supabase
      .from('conversions')
      .select('*', { count: 'exact' })
      .eq('affiliate_id', affiliate.id)
      .order('conversion_date', { ascending: false });

    // Apply filters
    if (userTypeFilter !== 'all') {
      query = query.eq('user_type', userTypeFilter);
    }
    if (statusFilter !== 'all') {
      query = query.eq('commission_status', statusFilter);
    }
    if (dateFilter) {
      query = query.gte('conversion_date', dateFilter);
    }
    if (searchTerm) {
      query = query.or(
        `user_name.ilike.%${searchTerm}%,user_email.ilike.%${searchTerm}%`
      );
    }

    // Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, count } = await query;

    setConversions(data || []);
    setTotalCount(count || 0);
    setLoading(false);
  };

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

      setAffiliate(affiliateData);
    };

    loadAffiliate();
  }, []);

  useEffect(() => {
    if (affiliate) {
      loadConversions();
    }
  }, [affiliate, page, userTypeFilter, statusFilter, dateFilter, searchTerm]);

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

  const totalPages = Math.ceil(totalCount / pageSize);

  if (loading && !affiliate) {
    return <PageLoading />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cadastros</h1>
          <p className="text-gray-600 mt-1">
            Visualize todos os cadastros realizados atraves do seu link
          </p>
        </div>
        <Button
          onClick={exportCSV}
          variant="outline"
          leftIcon={<Download className="w-4 h-4" />}
          disabled={conversions.length === 0}
        >
          Exportar CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Buscar por nome ou email"
              leftIcon={<Search className="w-4 h-4" />}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
            <Select
              options={userTypeOptions}
              value={userTypeFilter}
              onChange={(e) => {
                setUserTypeFilter(e.target.value);
                setPage(1);
              }}
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            />
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setPage(1);
              }}
              placeholder="Data inicial"
            />
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>
            {totalCount} cadastro{totalCount !== 1 ? 's' : ''} encontrado
            {totalCount !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Comissao</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Carregando...
                  </td>
                </tr>
              ) : conversions.length === 0 ? (
                <TableEmpty colSpan={5} message="Nenhum cadastro encontrado" />
              ) : (
                conversions.map((conversion) => (
                  <TableRow key={conversion.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {conversion.user_name || 'Usuario'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {conversion.user_email || '-'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          conversion.user_type === 'athlete' ? 'success' : 'info'
                        }
                      >
                        {conversion.user_type === 'athlete' ? 'Atleta' : 'Scout'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {formatDateTime(conversion.conversion_date)}
                    </TableCell>
                    <TableCell className="font-medium">
                      R$ {conversion.commission_amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          conversion.commission_status === 'paid'
                            ? 'success'
                            : conversion.commission_status === 'approved'
                            ? 'info'
                            : 'warning'
                        }
                      >
                        {conversion.commission_status === 'pending'
                          ? 'Pendente'
                          : conversion.commission_status === 'approved'
                          ? 'Aprovado'
                          : 'Pago'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Mostrando {(page - 1) * pageSize + 1} a{' '}
                {Math.min(page * pageSize, totalCount)} de {totalCount}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Proximo
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
