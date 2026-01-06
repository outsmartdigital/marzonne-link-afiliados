-- =============================================
-- Marzonne Affiliates - Credit System Migration
-- Execute este arquivo para adicionar o sistema de creditos
-- =============================================

-- 1. Adicionar coluna credit_balance se nao existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'affiliates' AND column_name = 'credit_balance'
  ) THEN
    ALTER TABLE affiliates ADD COLUMN credit_balance DECIMAL(10,2) DEFAULT 0;
  END IF;
END $$;

-- 2. Atualizar status padrao para 'approved' (novos cadastros sao auto-aprovados)
ALTER TABLE affiliates ALTER COLUMN status SET DEFAULT 'approved';

-- 3. Criar tabela de solicitacoes de resgate
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

-- 4. Indices para withdrawal_requests
CREATE INDEX IF NOT EXISTS idx_withdrawal_affiliate ON withdrawal_requests(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_status ON withdrawal_requests(status);

-- 5. Habilitar RLS para withdrawal_requests
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- 6. Policies para withdrawal_requests (remover se existirem e recriar)
DROP POLICY IF EXISTS "Affiliates can view own withdrawals" ON withdrawal_requests;
DROP POLICY IF EXISTS "Affiliates can request withdrawal" ON withdrawal_requests;

CREATE POLICY "Affiliates can view own withdrawals" ON withdrawal_requests
  FOR SELECT USING (
    affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid())
  );

CREATE POLICY "Affiliates can request withdrawal" ON withdrawal_requests
  FOR INSERT WITH CHECK (
    affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid())
  );

-- 7. Comments
COMMENT ON TABLE withdrawal_requests IS 'Solicitacoes de resgate de creditos';
COMMENT ON COLUMN affiliates.credit_balance IS 'Saldo de creditos disponivel para resgate';
COMMENT ON COLUMN withdrawal_requests.amount IS 'Valor solicitado para resgate';
