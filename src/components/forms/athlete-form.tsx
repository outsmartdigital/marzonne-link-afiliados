'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, User, Mail, Phone, Calendar, Ruler } from 'lucide-react';
import { Button, Input, Select } from '@/components/ui';
import { athleteRegisterSchema, AthleteRegisterData } from '@/lib/validations';

const positions = [
  { value: 'goleiro', label: 'Goleiro' },
  { value: 'zagueiro', label: 'Zagueiro' },
  { value: 'lateral_direito', label: 'Lateral Direito' },
  { value: 'lateral_esquerdo', label: 'Lateral Esquerdo' },
  { value: 'volante', label: 'Volante' },
  { value: 'meia', label: 'Meia' },
  { value: 'ponta_direita', label: 'Ponta Direita' },
  { value: 'ponta_esquerda', label: 'Ponta Esquerda' },
  { value: 'atacante', label: 'Atacante' },
  { value: 'centroavante', label: 'Centroavante' },
];

interface AthleteFormProps {
  onSubmit: (data: AthleteRegisterData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export function AthleteForm({ onSubmit, isLoading, error }: AthleteFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AthleteRegisterData>({
    resolver: zodResolver(athleteRegisterSchema),
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
        label="Posicao"
        options={positions}
        placeholder="Selecione sua posicao"
        error={errors.position?.message}
        {...register('position')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Altura (cm)"
          type="number"
          placeholder="175"
          leftIcon={<Ruler className="w-4 h-4" />}
          error={errors.height?.message}
          {...register('height', { valueAsNumber: true })}
        />
        <Input
          label="Peso (kg)"
          type="number"
          placeholder="70"
          error={errors.weight?.message}
          {...register('weight', { valueAsNumber: true })}
        />
      </div>

      <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
        Criar Conta de Atleta
      </Button>
    </form>
  );
}
