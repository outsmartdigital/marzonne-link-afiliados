import { z } from 'zod';

// Validation helpers
function isValidCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;
  if (/^(\d)\1+$/.test(cleaned)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cleaned.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  return rev === parseInt(cleaned.charAt(10));
}

function isValidCNPJ(cnpj: string): boolean {
  const cleaned = cnpj.replace(/\D/g, '');
  if (cleaned.length !== 14) return false;
  if (/^(\d)\1+$/.test(cleaned)) return false;

  let size = cleaned.length - 2;
  let numbers = cleaned.substring(0, size);
  const digits = cleaned.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  size = size + 1;
  numbers = cleaned.substring(0, size);
  sum = 0;
  pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return result === parseInt(digits.charAt(1));
}

// Affiliate registration schema (simplified - no bank details required)
export const affiliateRegisterSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
  phone: z
    .string()
    .min(10, 'Telefone inválido')
    .regex(/^\d+$/, 'Telefone deve conter apenas números'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
});

export type AffiliateRegisterData = z.infer<typeof affiliateRegisterSchema>;

// Bank details schema (for withdrawal)
export const bankDetailsSchema = z.object({
  bank: z.string().min(1, 'Banco é obrigatório'),
  agency: z.string().min(1, 'Agência é obrigatória'),
  account: z.string().min(1, 'Conta é obrigatória'),
  accountType: z.enum(['corrente', 'poupanca']),
  pix: z.string().optional(),
  pixType: z.enum(['cpf', 'cnpj', 'email', 'phone', 'random']).optional(),
});

export type BankDetailsData = z.infer<typeof bankDetailsSchema>;

// Withdrawal request schema
export const withdrawalSchema = z.object({
  amount: z.number().min(1, 'Valor mínimo: R$ 1,00'),
});

export type WithdrawalData = z.infer<typeof withdrawalSchema>;

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export type LoginData = z.infer<typeof loginSchema>;

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

// Athlete registration schema
export const athleteRegisterSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
  phone: z
    .string()
    .min(10, 'Telefone inválido')
    .regex(/^\d+$/, 'Telefone deve conter apenas números'),
  dateOfBirth: z.string().min(1, 'Data de nascimento é obrigatória'),
  position: z.string().min(1, 'Posição é obrigatória'),
  height: z.number().min(100, 'Altura mínima: 100cm').max(250, 'Altura máxima: 250cm').optional(),
  weight: z.number().min(30, 'Peso mínimo: 30kg').max(200, 'Peso máximo: 200kg').optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
});

export type AthleteRegisterData = z.infer<typeof athleteRegisterSchema>;

// Scout registration schema
export const scoutRegisterSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
  phone: z
    .string()
    .min(10, 'Telefone inválido')
    .regex(/^\d+$/, 'Telefone deve conter apenas números'),
  dateOfBirth: z.string().min(1, 'Data de nascimento é obrigatória'),
  role: z.string().min(1, 'Função é obrigatória'),
  organization: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
});

export type ScoutRegisterData = z.infer<typeof scoutRegisterSchema>;
