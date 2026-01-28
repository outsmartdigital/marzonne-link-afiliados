'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { User, Users, ArrowLeft, AlertCircle } from 'lucide-react';
import { Header } from '@/components/layout';
import { AthleteForm, ScoutForm } from '@/components/forms';
import { Button, Card, CardContent, PageLoading } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';
import { AthleteRegisterData, ScoutRegisterData } from '@/lib/validations';

type UserType = 'athlete' | 'scout' | null;

function translateSupabaseError(message: string): string {
  const translations: Record<string, string> = {
    'User already registered': 'Este email já possui uma conta cadastrada.',
    'Email already registered': 'Este email já possui uma conta cadastrada.',
    'Invalid login credentials': 'Credenciais de login inválidas.',
    'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres.',
    'Unable to validate email address: invalid format': 'Formato de email inválido.',
    'Email rate limit exceeded': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
    'For security purposes, you can only request this once every 60 seconds': 'Por segurança, aguarde 60 segundos antes de tentar novamente.',
  };

  for (const [english, portuguese] of Object.entries(translations)) {
    if (message.toLowerCase().includes(english.toLowerCase())) {
      return portuguese;
    }
  }

  return 'Erro ao criar conta. Tente novamente.';
}

function CadastroContent() {
  const [userType, setUserType] = useState<UserType>(null);
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null);
  const [affiliateName, setAffiliateName] = useState<string | null>(null);
  const [affiliateValid, setAffiliateValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingAffiliate, setCheckingAffiliate] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setAffiliateCode(ref);
      // Validate affiliate code
      validateAffiliateCode(ref);
    } else {
      setCheckingAffiliate(false);
    }
  }, [searchParams]);

  const validateAffiliateCode = async (code: string) => {
    try {
      const { data, error } = await supabase
        .from('affiliates')
        .select('id, status, name')
        .eq('affiliate_code', code)
        .single();

      if (error || !data) {
        setAffiliateValid(false);
      } else if (data.status !== 'approved') {
        setAffiliateValid(false);
      } else {
        setAffiliateValid(true);
        setAffiliateName(data.name);
      }
    } catch {
      setAffiliateValid(false);
    } finally {
      setCheckingAffiliate(false);
    }
  };

  const handleAthleteSubmit = async (data: AthleteRegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            phone: data.phone,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Erro ao criar usuario');

      // 2. Create user profile (same table as mobile app)
      const { error: profileError } = await supabase.from('user_profiles').insert({
        user_id: authData.user.id,
        user_type: 'athlete',
        user_plan: 'bronze',
        athlete_name: data.name,
        athlete_date_birth: data.dateOfBirth,
        athlete_position: data.position,
        phone: data.phone,
        athlete_height: data.height,
        athlete_weight: data.weight,
        father_height: data.fatherHeight || null,
        mother_height: data.motherHeight || null,
        referred_by: affiliateCode,
      });

      if (profileError) throw profileError;

      // 3. Conversion/commission tracking:
      // - O código do afiliado (referred_by) já foi salvo no user_profiles
      // - A conversão/comissão NÃO é criada no cadastro (plano bronze é gratuito)
      // - A conversão será criada apenas quando o usuário assinar plano Prata ou Ouro
      // - Essa lógica deve ser implementada no app mobile quando o usuário fizer upgrade de plano

      // 4. Redirect to success
      router.push('/sucesso?type=athlete');
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      setError(translateSupabaseError(message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleScoutSubmit = async (data: ScoutRegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            phone: data.phone,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Erro ao criar usuario');

      // 2. Create user profile (same table as mobile app)
      const { error: profileError } = await supabase.from('user_profiles').insert({
        user_id: authData.user.id,
        user_type: 'scout',
        user_plan: 'free',
        scout_name: data.name,
        scout_date_birth: data.dateOfBirth,
        scout_phone: data.phone,
        scout_role: data.role,
        referred_by: affiliateCode,
      });

      if (profileError) throw profileError;

      // 3. Conversion/commission tracking:
      // - O código do afiliado (referred_by) já foi salvo no user_profiles
      // - A conversão/comissão NÃO é criada no cadastro (plano gratuito)
      // - A conversão será criada apenas quando o usuário assinar plano Prata ou Ouro
      // - Essa lógica deve ser implementada no app mobile quando o usuário fizer upgrade de plano

      // 4. Redirect to success
      router.push('/sucesso?type=scout');
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      setError(translateSupabaseError(message));
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingAffiliate) {
    return <PageLoading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showAuthButtons={false} />

      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Affiliate Badge */}
        {affiliateCode && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              affiliateValid
                ? 'bg-[#FEF9E7] border border-[#FCD34D]'
                : 'bg-yellow-50 border border-yellow-200'
            }`}
          >
            {affiliateValid ? (
              <>
                <div className="w-8 h-8 bg-[#FEF9E7] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-[#FCD34D]" />
                </div>
                <div>
                  <p className="text-sm text-black">
                    Você foi indicado pelo afiliado <strong>{affiliateName}</strong>!
                  </p>
                  <p className="text-xs text-[#FCD34D]">
                    Código: {affiliateCode}
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <p className="text-sm text-yellow-700">
                  Codigo de afiliado invalido ou inativo. Voce ainda pode se
                  cadastrar normalmente.
                </p>
              </>
            )}
          </div>
        )}

        {/* User Type Selection */}
        {!userType && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Cadastre-se no DNA de Craque
              </h1>
              <p className="mt-2 text-gray-600">
                Escolha o tipo de conta que deseja criar
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card
                className="cursor-pointer hover:border-[#FCD34D] hover:shadow-md transition-all"
                onClick={() => setUserType('athlete')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-[#FEF9E7] rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-[#FCD34D]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Sou Atleta
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Quero mostrar meu talento e ser descoberto por scouts e
                    clubes.
                  </p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:border-[#FCD34D] hover:shadow-md transition-all"
                onClick={() => setUserType('scout')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Sou Scout
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Quero descobrir novos talentos e encontrar atletas
                    promissores.
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Registration Forms */}
        {userType && (
          <>
            <button
              onClick={() => setUserType(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                {userType === 'athlete'
                  ? 'Cadastro de Atleta'
                  : 'Cadastro de Scout'}
              </h1>
              <p className="mt-2 text-gray-600">
                Preencha seus dados para criar sua conta
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                {userType === 'athlete' ? (
                  <AthleteForm
                    onSubmit={handleAthleteSubmit}
                    isLoading={isLoading}
                    error={error}
                  />
                ) : (
                  <ScoutForm
                    onSubmit={handleScoutSubmit}
                    isLoading={isLoading}
                    error={error}
                  />
                )}

                <p className="mt-6 text-xs text-gray-500 text-center">
                  Ao se cadastrar, voce concorda com nossos{' '}
                  <Link
                    href="/termos"
                    className="text-[#FCD34D] hover:underline"
                  >
                    Termos de Uso
                  </Link>{' '}
                  e{' '}
                  <Link
                    href="/privacidade"
                    className="text-[#FCD34D] hover:underline"
                  >
                    Politica de Privacidade
                  </Link>
                  .
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}

export default function CadastroPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <CadastroContent />
    </Suspense>
  );
}
