'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Header } from '@/components/layout';
import { Button, Input, Card, CardContent } from '@/components/ui';
import { forgotPasswordSchema, ForgotPasswordData } from '@/lib/validations';
import { createClient } from '@/lib/supabase/client';

export default function EsqueciSenhaPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(
        data.email,
        {
          redirectTo: `${window.location.origin}/redefinir-senha`,
        }
      );

      if (authError) throw authError;

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao enviar email. Tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showAuthButtons={false} />

      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para login
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Esqueceu sua senha?
            </h1>
            <p className="mt-2 text-gray-600">
              Digite seu email para receber um link de recuperacao
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              {success ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-[#FEF9E7] rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-[#FCD34D]" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Email enviado!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Verifique sua caixa de entrada e siga as instrucoes para
                    redefinir sua senha.
                  </p>
                  <Link href="/login">
                    <Button variant="outline">Voltar para login</Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <Input
                    label="Email"
                    type="email"
                    placeholder="seu@email.com"
                    leftIcon={<Mail className="w-4 h-4" />}
                    error={errors.email?.message}
                    {...register('email')}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    isLoading={isLoading}
                  >
                    Enviar link de recuperacao
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
