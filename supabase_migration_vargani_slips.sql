-- ============================================
-- Migration: Vargani Slip Generator Feature
-- Date: 2026-03-13
-- ============================================

-- 1. User Profiles for Role Management (admin / sub_admin)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE NOT NULL,
    email TEXT NOT NULL,
    display_name TEXT,
    role TEXT DEFAULT 'sub_admin' CHECK (role IN ('admin', 'sub_admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Vargani Slips Table
CREATE TABLE IF NOT EXISTS vargani_slips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    shop_name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    location TEXT NOT NULL,
    address TEXT DEFAULT '',  -- Full address (optional)
    mobile TEXT NOT NULL,  -- WhatsApp number (mandatory)
    status TEXT DEFAULT 'pending' CHECK (status IN ('paid', 'pending')),
    tentative_date DATE,  -- When they said they'll pay (for pending entries)
    slip_number TEXT,      -- Auto-generated: SGP-YYYY-XXXX
    confirmed_by_user_id UUID,
    confirmed_by_name TEXT,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    created_by_user_id UUID,
    created_by_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vargani_slips ENABLE ROW LEVEL SECURITY;

-- 4. Public access policies (matching existing pattern)
CREATE POLICY "Public Access" ON user_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON vargani_slips FOR ALL USING (true) WITH CHECK (true);
