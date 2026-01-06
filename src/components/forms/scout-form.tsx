'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, User, Mail, Phone, Calendar, Briefcase, Building } from 'lucide-react';
import { Button, Input, Select } from '@/components/ui';
import { scoutRegisterSchema, ScoutRegisterData } from '@/lib/validations';

const roles = [
  { value: 'scout', label: 'Scout' },
  { value: 'tecnico', label: 'Tecnico' },
  { value: 'diretor', label: 'Diretor de Futebol' },
  { value: 'empresario', label: 'Empresario' },
  { value: 'agente', label: 'Agente' },
  { value: 'analista', label: 'Analista de Desempenho' },
  { value: 'outro', label: 'Outro' },
];

interface ScoutFormProps {
  onSubmit: (data: ScoutRegisterData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export function ScoutForm({ onSubmit, isLoading, error }: ScoutFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ScoutRegisterData>({
    resolver: zodResolver(scoutRegisterSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

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

      <Input
        label="Telefone"
        placeholder="11999999999"
        leftIcon={<Phone className="w-4 h-4" />}
        error={errors.phone?.message}
        {...register('phone')}
      />

      <Input
        label="Data de Nascimento"
        type="date"
        leftIcon={<Calendar className="w-4 h-4" />}
        error={errors.dateOfBirth?.message}
        {...register('dateOfBirth')}
      />

      <Select
        label="Funcao"
        options={roles}
        placeholder="Selecione sua funcao"
        error={errors.role?.message}
        {...register('role')}
      />

      <Input
        label="Organizacao/Empresa (opcional)"
        placeholder="Nome da empresa ou clube"
        leftIcon={<Building className="w-4 h-4" />}
        {...register('organization')}
      />

      <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
        Criar Conta de Scout
      </Button>
    </form>
  );
}
