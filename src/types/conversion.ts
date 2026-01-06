export interface Conversion {
  id: string;
  affiliate_id: string;
  user_id: string | null;
  user_type: 'athlete' | 'scout';
  user_email: string | null;
  user_name: string | null;
  conversion_date: string;
  commission_amount: number;
  commission_status: 'pending' | 'approved' | 'paid';
}

export interface ConversionWithDetails extends Conversion {
  affiliate?: {
    name: string;
    affiliate_code: string;
  };
}

export interface ConversionFilters {
  startDate?: string;
  endDate?: string;
  userType?: 'athlete' | 'scout' | 'all';
  status?: 'pending' | 'approved' | 'paid' | 'all';
}

export interface ConversionStats {
  date: string;
  athletes: number;
  scouts: number;
  total: number;
}
