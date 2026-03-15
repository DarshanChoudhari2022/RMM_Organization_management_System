-- =====================================================
-- FIX: RLS Policies for all tables
-- =====================================================
-- This ensures ALL authenticated users (admin + sub_admin) 
-- can read and write all shared data.
-- Run this in Supabase SQL Editor.
-- =====================================================

-- Drop old policies that may be incorrectly scoped
DO $$ 
DECLARE
    tbl TEXT;
BEGIN
    FOR tbl IN SELECT unnest(ARRAY['members', 'vargani_payments', 'tasks', 'task_responses', 'expenses', 'invitations', 'suppliers', 'user_profiles', 'vargani_slips'])
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Public Access" ON %I', tbl);
        EXECUTE format('DROP POLICY IF EXISTS "Authenticated full access" ON %I', tbl);
        EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated read" ON %I', tbl);
        EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated write" ON %I', tbl);
        EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated insert" ON %I', tbl);
        EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated update" ON %I', tbl);
        EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated delete" ON %I', tbl);
    END LOOP;
END $$;

-- Re-create proper policies scoped to authenticated users
-- Members
CREATE POLICY "Authenticated full access" ON members FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Vargani Payments
CREATE POLICY "Authenticated full access" ON vargani_payments FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Tasks
CREATE POLICY "Authenticated full access" ON tasks FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Task Responses
CREATE POLICY "Authenticated full access" ON task_responses FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Expenses
CREATE POLICY "Authenticated full access" ON expenses FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Invitations
CREATE POLICY "Authenticated full access" ON invitations FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Suppliers
CREATE POLICY "Authenticated full access" ON suppliers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- User Profiles
CREATE POLICY "Authenticated full access" ON user_profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Vargani Slips
CREATE POLICY "Authenticated full access" ON vargani_slips FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Audit Logs (ensure this exists too)
ALTER TABLE IF EXISTS audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users full access audit_logs" ON audit_logs;
DROP POLICY IF EXISTS "Authenticated full access" ON audit_logs;
CREATE POLICY "Authenticated full access" ON audit_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
