-- =====================================================
-- COMPREHENSIVE SCHEMA FIX & AUGMENTATION
-- =====================================================
-- This script ensures all tables and columns required by the 
-- Admin Dashboard exist in the database.
-- =====================================================

-- 1. SUPPLIERS TABLE
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) DEFAULT 'Other',
    contact VARCHAR(50) NOT NULL,
    address TEXT,
    notes TEXT,
    total_amount DECIMAL(10,2) DEFAULT 0,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    terms TEXT,
    is_confirmed BOOLEAN DEFAULT false,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    supplier_comment TEXT
);

-- Ensure all columns exist (in case table was created with partial schema)
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS paid_amount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS terms TEXT;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS is_confirmed BOOLEAN DEFAULT false;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS supplier_comment TEXT;

-- 2. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    action VARCHAR(255) NOT NULL,
    details TEXT,
    user_id UUID,
    user_name VARCHAR(255)
);

-- 3. INVITATIONS TABLE
CREATE TABLE IF NOT EXISTS invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title VARCHAR(255) NOT NULL,
    message TEXT,
    date DATE,
    time TIME,
    location VARCHAR(255)
);

-- 4. EXPENSES TABLE ENHANCEMENTS
-- Note: 'vendor_name' already exists in migration 001 but may need default
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS paid_by TEXT DEFAULT 'Mandal';
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS is_refunded BOOLEAN DEFAULT false;
ALTER TABLE expenses ALTER COLUMN vendor_name DROP NOT NULL;
ALTER TABLE expenses ALTER COLUMN vendor_name SET DEFAULT 'General';

-- 5. VARGANI PAYMENTS ALIGNMENT
-- Add columns expected by current admin-api.ts implementation
ALTER TABLE vargani_payments ADD COLUMN IF NOT EXISTS amount DECIMAL(10,2) DEFAULT 1500;
ALTER TABLE vargani_payments ADD COLUMN IF NOT EXISTS paid BOOLEAN DEFAULT false;
ALTER TABLE vargani_payments ADD COLUMN IF NOT EXISTS paid_date TIMESTAMP WITH TIME ZONE;

-- =====================================================
-- Permissions / RLS (Optional but recommended)
-- =====================================================
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Simple permissive policies for authenticated users
CREATE POLICY "Authenticated users full access suppliers" ON suppliers FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users full access audit_logs" ON audit_logs FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users full access invitations" ON invitations FOR ALL TO authenticated USING (true);
