-- =====================================================
-- FIX: RLS Policies for all tables
-- =====================================================

-- 1. Create audit_logs array if it doesn't exist (this caused the error)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    action VARCHAR(255) NOT NULL,
    details TEXT,
    user_id UUID,
    user_name VARCHAR(255)
);

-- 2. Drop old policies that may be incorrectly scoped
DO $$ 
DECLARE
    tbl TEXT;
BEGIN
    FOR tbl IN SELECT unnest(ARRAY['members', 'vargani_payments', 'tasks', 'task_responses', 'expenses', 'invitations', 'suppliers', 'user_profiles', 'vargani_slips', 'audit_logs'])
    LOOP
        -- Only attempt to drop if the table exists
        IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = tbl) THEN
            EXECUTE format('DROP POLICY IF EXISTS "Public Access" ON %I', tbl);
            EXECUTE format('DROP POLICY IF EXISTS "Authenticated full access" ON %I', tbl);
            EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated read" ON %I', tbl);
            EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated write" ON %I', tbl);
            EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated insert" ON %I', tbl);
            EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated update" ON %I', tbl);
            EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated delete" ON %I', tbl);
            EXECUTE format('DROP POLICY IF EXISTS "Authenticated users full access %I" ON %I', tbl, tbl);
        END IF;
    END LOOP;
END $$;

-- 3. Re-create proper policies scoped to authenticated users
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

-- Invitations (Create if not exists first)
CREATE TABLE IF NOT EXISTS invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title VARCHAR(255) NOT NULL,
    message TEXT,
    date DATE,
    time TIME,
    location VARCHAR(255)
);
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated full access" ON invitations FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Suppliers (Create if not exists first)
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) DEFAULT 'Other',
    contact VARCHAR(50) NOT NULL,
    address TEXT,
    notes TEXT
);
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated full access" ON suppliers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- User Profiles
CREATE POLICY "Authenticated full access" ON user_profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Vargani Slips
CREATE POLICY "Authenticated full access" ON vargani_slips FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Audit Logs
ALTER TABLE IF EXISTS audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated full access" ON audit_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
