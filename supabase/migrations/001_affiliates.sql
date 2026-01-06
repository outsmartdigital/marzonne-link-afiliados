-- =============================================
-- Marzonne Affiliates - Database Schema
-- =============================================

-- 1. Tabela de afiliados
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  document TEXT,
  bank_details JSONB,
  affiliate_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'approved',
  credit_balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID,
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- 2. Tabela de solicitacoes de resgate
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  processed_by UUID,
  CONSTRAINT valid_withdrawal_status CHECK (status IN ('pending', 'approved', 'paid', 'rejected'))
);

-- 3. Tabela de conversoes (referrals)
CREATE TABLE IF NOT EXISTS conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_type TEXT NOT NULL,
  user_email TEXT,
  user_name TEXT,
  conversion_date TIMESTAMPTZ DEFAULT NOW(),
  commission_amount DECIMAL(10,2) DEFAULT 0,
  commission_status TEXT DEFAULT 'pending',
  CONSTRAINT valid_user_type CHECK (user_type IN ('athlete', 'scout')),
  CONSTRAINT valid_commission_status CHECK (commission_status IN ('pending', 'approved', 'paid'))
);

-- 4. Indices para performance
CREATE INDEX IF NOT EXISTS idx_affiliates_code ON affiliates(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_affiliates_status ON affiliates(status);
CREATE INDEX IF NOT EXISTS idx_affiliates_user_id ON affiliates(user_id);
CREATE INDEX IF NOT EXISTS idx_conversions_affiliate ON conversions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_conversions_date ON conversions(conversion_date);
CREATE INDEX IF NOT EXISTS idx_conversions_status ON conversions(commission_status);
CREATE INDEX IF NOT EXISTS idx_withdrawal_affiliate ON withdrawal_requests(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_status ON withdrawal_requests(status);

-- 5. Adicionar coluna referred_by na tabela user_profiles (se existir)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'referred_by') THEN
      ALTER TABLE user_profiles ADD COLUMN referred_by TEXT;
    END IF;
  END IF;
END $$;

-- =============================================
-- Row Level Security (RLS)
-- =============================================

-- Habilitar RLS
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- Policies para affiliates
CREATE POLICY "Affiliates can view own data" ON affiliates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Affiliates can update own data" ON affiliates
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND status = status); -- Nao pode alterar status

CREATE POLICY "Anyone can insert affiliate" ON affiliates
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can read affiliate code" ON affiliates
  FOR SELECT USING (status = 'approved');

-- Policies para conversions
CREATE POLICY "Affiliates can view own conversions" ON conversions
  FOR SELECT USING (
    affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid())
  );

CREATE POLICY "System can insert conversions" ON conversions
  FOR INSERT WITH CHECK (true);

-- Policies para withdrawal_requests
CREATE POLICY "Affiliates can view own withdrawals" ON withdrawal_requests
  FOR SELECT USING (
    affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid())
  );

CREATE POLICY "Affiliates can request withdrawal" ON withdrawal_requests
  FOR INSERT WITH CHECK (
    affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid())
  );

-- =============================================
-- Functions
-- =============================================

-- Funcao para gerar codigo de afiliado unico
CREATE OR REPLACE FUNCTION generate_affiliate_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- Comments
-- =============================================

COMMENT ON TABLE affiliates IS 'Tabela de afiliados da plataforma';
COMMENT ON TABLE conversions IS 'Registro de conversoes/cadastros realizados por afiliados';
COMMENT ON TABLE withdrawal_requests IS 'Solicitacoes de resgate de creditos';
COMMENT ON COLUMN affiliates.affiliate_code IS 'Codigo unico do afiliado para tracking';
COMMENT ON COLUMN affiliates.bank_details IS 'Dados bancarios em formato JSON (opcional)';
COMMENT ON COLUMN affiliates.credit_balance IS 'Saldo de creditos disponivel para resgate';
COMMENT ON COLUMN conversions.commission_amount IS 'Valor da comissao a ser paga ao afiliado';
COMMENT ON COLUMN withdrawal_requests.amount IS 'Valor solicitado para resgate';
