-- =========================================
-- FIX: Add all missing columns and tables
-- Run this in Supabase SQL Editor
-- =========================================

-- 1. EXPENSES TABLE: Add missing 'vendor_name' column
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS vendor_name TEXT DEFAULT 'General';

-- 2. SUPPLIERS TABLE: Add all missing columns
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS total_amount NUMERIC DEFAULT 0;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS paid_amount NUMERIC DEFAULT 0;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS terms TEXT;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS is_confirmed BOOLEAN DEFAULT FALSE;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS supplier_comment TEXT;

-- 3. VARGANI SLIPS TABLE: Add missing 'payment_mode' column
ALTER TABLE vargani_slips ADD COLUMN IF NOT EXISTS payment_mode TEXT DEFAULT 'cash' CHECK (payment_mode IN ('cash', 'online'));

-- 4. AUDIT LOGS TABLE: Create if not exists
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL,
    details TEXT,
    user_id UUID,
    user_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on audit_logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow public access for audit_logs (matching existing policy pattern)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'audit_logs' AND policyname = 'Public Access'
    ) THEN
        CREATE POLICY "Public Access" ON audit_logs FOR ALL USING (true) WITH CHECK (true);
    END IF;
END
$$;

-- 5. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_expenses_year ON expenses(year);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_tasks_year ON tasks(year);
CREATE INDEX IF NOT EXISTS idx_tasks_date ON tasks(date);
CREATE INDEX IF NOT EXISTS idx_vargani_slips_created_at ON vargani_slips(created_at);
CREATE INDEX IF NOT EXISTS idx_vargani_slips_status ON vargani_slips(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_members_name ON members(name);
CREATE INDEX IF NOT EXISTS idx_vargani_payments_member_year ON vargani_payments(member_id, year);
CREATE INDEX IF NOT EXISTS idx_task_responses_task_id ON task_responses(task_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_auth_user_id ON user_profiles(auth_user_id);
