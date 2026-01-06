-- =============================================
-- Marzonne Affiliates - Status Pending Migration
-- Novos cadastros precisam de aprovacao do admin
-- =============================================

-- Atualizar status padrao para 'pending'
ALTER TABLE affiliates ALTER COLUMN status SET DEFAULT 'pending';
