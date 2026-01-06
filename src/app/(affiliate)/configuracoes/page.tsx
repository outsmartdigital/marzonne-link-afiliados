'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  User,
  Phone,
  Building,
  Save,
  CheckCircle,
  Wallet,
  AlertCircle,
  Banknote,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
  Button,
  Input,
  Select,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  PageLoading,
  Badge,
  Modal,
  ModalFooter,
} from '@/components/ui';
import { Affiliate, BankDetails } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { bankDetailsSchema, BankDetailsData } from '@/lib/validations';

const banks = [
  { value: '001', label: 'Banco do Brasil' },
  { value: '033', label: 'Santander' },
  { value: '104', label: 'Caixa Economica' },
  { value: '237', label: 'Bradesco' },
  { value: '341', label: 'Itau' },
  { value: '260', label: 'Nubank' },
  { value: '077', label: 'Inter' },
  { value: '336', label: 'C6 Bank' },
  { value: '212', label: 'Banco Original' },
  { value: '756', label: 'Sicoob' },
];

const accountTypes = [
  { value: 'corrente', label: 'Conta Corrente' },
  { value: 'poupanca', label: 'Poupanca' },
];

const pixTypes = [
  { value: 'cpf', label: 'CPF' },
  { value: 'cnpj', label: 'CNPJ' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Telefone' },
  { value: 'random', label: 'Chave Aleatoria' },
];

interface ProfileFormData {
  name: string;
  phone: string;
}

export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingBank, setSavingBank] = useState(false);
  const [savedProfile, setSavedProfile] = useState(false);
  const [savedBank, setSavedBank] = useState(false);
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const supabase = createClient();

  // Profile form
  const profileForm = useForm<ProfileFormData>();

  // Bank details form
  const bankForm = useForm<BankDetailsData>({
    resolver: zodResolver(bankDetailsSchema),
  });

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
        profileForm.reset({
          name: affiliateData.name,
          phone: affiliateData.phone || '',
        });
        if (affiliateData.bank_details) {
          bankForm.reset(affiliateData.bank_details);
        }
      }

      setLoading(false);
    };

    loadAffiliate();
  }, []);

  const onSaveProfile = async (data: ProfileFormData) => {
    if (!affiliate) return;

    setSavingProfile(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('affiliates')
        .update({
          name: data.name,
          phone: data.phone,
        })
        .eq('id', affiliate.id);

      if (updateError) throw updateError;

      setSavedProfile(true);
      setTimeout(() => setSavedProfile(false), 3000);

      setAffiliate({ ...affiliate, name: data.name, phone: data.phone });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao salvar. Tente novamente.'
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const onSaveBankDetails = async (data: BankDetailsData) => {
    if (!affiliate) return;

    setSavingBank(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('affiliates')
        .update({
          bank_details: data,
        })
        .eq('id', affiliate.id);

      if (updateError) throw updateError;

      setSavedBank(true);
      setTimeout(() => setSavedBank(false), 3000);

      setAffiliate({ ...affiliate, bank_details: data as BankDetails });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao salvar. Tente novamente.'
      );
    } finally {
      setSavingBank(false);
    }
  };

  const handleWithdraw = async () => {
    if (!affiliate) return;

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Valor invalido');
      return;
    }

    if (amount > (affiliate.credit_balance || 0)) {
      setError('Saldo insuficiente');
      return;
    }

    // Check if bank details exist
    if (!affiliate.bank_details) {
      setError('Voce precisa cadastrar seus dados bancarios antes de solicitar um resgate.');
      setShowWithdrawModal(false);
      return;
    }

    setWithdrawing(true);
    setError(null);

    try {
      // Create withdrawal request
      const { error: withdrawError } = await supabase
        .from('withdrawal_requests')
        .insert({
          affiliate_id: affiliate.id,
          amount: amount,
          status: 'pending',
        });

      if (withdrawError) throw withdrawError;

      // Update credit balance
      const { error: updateError } = await supabase
        .from('affiliates')
        .update({
          credit_balance: (affiliate.credit_balance || 0) - amount,
        })
        .eq('id', affiliate.id);

      if (updateError) throw updateError;

      setAffiliate({
        ...affiliate,
        credit_balance: (affiliate.credit_balance || 0) - amount,
      });

      setWithdrawSuccess(true);
      setWithdrawAmount('');
      setTimeout(() => {
        setWithdrawSuccess(false);
        setShowWithdrawModal(false);
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao solicitar resgate.'
      );
    } finally {
      setWithdrawing(false);
    }
  };

  const hasBankDetails = affiliate?.bank_details && affiliate.bank_details.bank;

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuracoes</h1>
        <p className="text-gray-600 mt-1">
          Gerencie seus dados pessoais, bancarios e resgate seus creditos
        </p>
      </div>

      {/* Success Messages */}
      {savedProfile && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <p className="text-sm text-emerald-700">
            Perfil atualizado com sucesso!
          </p>
        </div>
      )}

      {savedBank && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <p className="text-sm text-emerald-700">
            Dados bancarios salvos com sucesso!
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Credit Balance & Withdraw */}
      <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
        <CardContent className="py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5" />
                <span className="text-emerald-100">Seu Saldo</span>
              </div>
              <p className="text-4xl font-bold">
                {formatCurrency(affiliate?.credit_balance || 0)}
              </p>
              <p className="text-emerald-100 text-sm mt-1">
                Disponivel para resgate
              </p>
            </div>
            <Button
              onClick={() => {
                if (!hasBankDetails) {
                  setError('Voce precisa cadastrar seus dados bancarios antes de solicitar um resgate.');
                  // Scroll to bank section
                  document.getElementById('bank-section')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setShowWithdrawModal(true);
                }
              }}
              className="bg-white text-emerald-600 hover:bg-emerald-50"
              size="lg"
              leftIcon={<Banknote className="w-5 h-5" />}
              disabled={(affiliate?.credit_balance || 0) <= 0}
            >
              Solicitar Resgate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status da Conta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Codigo de afiliado</p>
              <p className="font-mono font-semibold text-lg">
                {affiliate?.affiliate_code}
              </p>
            </div>
            <Badge
              variant={
                affiliate?.status === 'approved'
                  ? 'success'
                  : affiliate?.status === 'rejected'
                  ? 'danger'
                  : 'warning'
              }
            >
              {affiliate?.status === 'approved'
                ? 'Aprovado'
                : affiliate?.status === 'rejected'
                ? 'Rejeitado'
                : 'Pendente'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Personal Info */}
      <form onSubmit={profileForm.handleSubmit(onSaveProfile)}>
        <Card>
          <CardHeader>
            <CardTitle>Informacoes Pessoais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome Completo"
                placeholder="Seu nome"
                leftIcon={<User className="w-4 h-4" />}
                {...profileForm.register('name', { required: 'Nome e obrigatorio' })}
              />
              <Input
                label="Email"
                type="email"
                value={affiliate?.email || ''}
                disabled
                helperText="O email nao pode ser alterado"
              />
              <Input
                label="Telefone"
                placeholder="11999999999"
                leftIcon={<Phone className="w-4 h-4" />}
                {...profileForm.register('phone')}
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                isLoading={savingProfile}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Salvar Perfil
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Bank Details */}
      <form onSubmit={bankForm.handleSubmit(onSaveBankDetails)} id="bank-section">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Dados Bancarios</CardTitle>
              {hasBankDetails ? (
                <Badge variant="success">Cadastrado</Badge>
              ) : (
                <Badge variant="warning">Pendente</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!hasBankDetails && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-800 font-medium">
                    Dados bancarios nao cadastrados
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Para solicitar resgate de creditos, voce precisa cadastrar seus dados bancarios.
                  </p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Banco"
                options={banks}
                placeholder="Selecione o banco"
                error={bankForm.formState.errors.bank?.message}
                {...bankForm.register('bank')}
              />
              <Select
                label="Tipo de Conta"
                options={accountTypes}
                error={bankForm.formState.errors.accountType?.message}
                {...bankForm.register('accountType')}
              />
              <Input
                label="Agencia"
                placeholder="0000"
                leftIcon={<Building className="w-4 h-4" />}
                error={bankForm.formState.errors.agency?.message}
                {...bankForm.register('agency')}
              />
              <Input
                label="Conta"
                placeholder="00000-0"
                error={bankForm.formState.errors.account?.message}
                {...bankForm.register('account')}
              />
              <Select
                label="Tipo de Chave PIX"
                options={pixTypes}
                placeholder="Selecione (opcional)"
                {...bankForm.register('pixType')}
              />
              <Input
                label="Chave PIX"
                placeholder="Sua chave PIX"
                {...bankForm.register('pix')}
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                isLoading={savingBank}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Salvar Dados Bancarios
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Withdraw Modal */}
      <Modal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        title="Solicitar Resgate"
        description="Informe o valor que deseja resgatar"
      >
        {withdrawSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Solicitacao enviada!
            </h3>
            <p className="text-gray-500 mt-2">
              Seu resgate sera processado em ate 3 dias uteis.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">
                Saldo disponivel:{' '}
                <span className="font-semibold text-gray-900">
                  {formatCurrency(affiliate?.credit_balance || 0)}
                </span>
              </p>
              <Input
                label="Valor do resgate"
                type="number"
                placeholder="0,00"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                leftIcon={<span className="text-gray-400">R$</span>}
              />
            </div>
            <ModalFooter>
              <Button
                variant="outline"
                onClick={() => setShowWithdrawModal(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleWithdraw}
                isLoading={withdrawing}
                disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
              >
                Confirmar Resgate
              </Button>
            </ModalFooter>
          </>
        )}
      </Modal>
    </div>
  );
}
