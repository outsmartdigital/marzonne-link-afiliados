export interface BankDetails {
  bank: string;
  agency: string;
  account: string;
  accountType: 'corrente' | 'poupanca';
  pix?: string;
  pixType?: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
}

export interface Affiliate {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  document: string | null;
  bank_details: BankDetails | null;
  affiliate_code: string;
  status: 'pending' | 'approved' | 'rejected';
  credit_balance: number;
  created_at: string;
  approved_at: string | null;
  approved_by: string | null;
}

export interface AffiliateStats {
  totalConversions: number;
  conversionsLast7Days: number;
  conversionsLast30Days: number;
  conversionsLast90Days: number;
  creditBalance: number;
  pendingWithdrawals: number;
  totalWithdrawn: number;
}

export interface WithdrawalRequest {
  id: string;
  affiliate_id: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  requested_at: string;
  processed_at: string | null;
  processed_by: string | null;
}
