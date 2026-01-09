'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, User, Mail, Phone } from 'lucide-react';
import { Button, Input, Card, CardContent } from '@/components/ui';
import { affiliateRegisterSchema, AffiliateRegisterData } from '@/lib/validations';
import { createClient } from '@/lib/supabase/client';
import { generateAffiliateCode } from '@/lib/utils';

export function AffiliateRegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AffiliateRegisterData>({
    resolver: zodResolver(affiliateRegisterSchema),
  });

  const onSubmit = async (data: AffiliateRegisterData) => {
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

      if (authError) {
        // Tratar erro de email já existente
        if (authError.message.includes('already registered') ||
            authError.message.includes('already exists') ||
            authError.status === 422) {
          throw new Error('Este email ja possui uma conta cadastrada. Faca login ou use outro email.');
        }
        throw authError;
      }
      if (!authData.user) throw new Error('Erro ao criar usuario');

      // 2. Generate unique affiliate code
      let affiliateCode = generateAffiliateCode();
      let attempts = 0;

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

      // 3. Create affiliate record (status pendente para aprovacao do admin)
      const { error: affiliateError } = await supabase.from('affiliates').insert({
        user_id: authData.user.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        affiliate_code: affiliateCode,
        status: 'pending',
        credit_balance: 0,
      });

      if (affiliateError) throw affiliateError;

      // 4. Fazer logout para que usuario precise fazer login
      await supabase.auth.signOut();

      // 5. Redirect to success page (not dashboard)
      router.push('/registro/sucesso');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao criar conta. Tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Personal Info */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Informacoes Pessoais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome Completo"
              placeholder="Seu nome"
              leftIcon={<User className="w-4 h-4" />}
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Telefone"
              placeholder="11999999999"
              leftIcon={<Phone className="w-4 h-4" />}
              error={errors.phone?.message}
              {...register('phone')}
              className="md:col-span-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Senha de Acesso
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimo 6 caracteres"
              error={errors.password?.message}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
              {...register('password')}
            />
            <Input
              label="Confirmar Senha"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Repita a senha"
              error={errors.confirmPassword?.message}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
              {...register('confirmPassword')}
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
        Criar Conta de Afiliado
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Ao se cadastrar, voce concorda com nossos{' '}
        <a href="/termos" className="text-[#FCD34D] hover:underline">
          Termos de Uso
        </a>{' '}
        e{' '}
        <a href="/privacidade" className="text-[#FCD34D] hover:underline">
          Politica de Privacidade
        </a>
        .
      </p>
    </form>
  );
}
