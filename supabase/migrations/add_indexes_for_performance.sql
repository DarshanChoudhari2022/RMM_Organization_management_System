-- =====================================================
-- PERFORMANCE OPTIMIZATIONS: DATABASE INDEXES
-- =====================================================
-- Run this in your Supabase SQL Editor.
-- These indexes will dramatically speed up dashboard loading times
-- by optimising search and filtering operations when handling large
-- amounts of historical data and carrying heavy load.

-- Vargani Slips (Heavily queried by status, date, and user)
CREATE INDEX IF NOT EXISTS idx_vargani_slips_status ON vargani_slips (status);
CREATE INDEX IF NOT EXISTS idx_vargani_slips_created_at ON vargani_slips (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vargani_slips_created_by ON vargani_slips (created_by_user_id);
CREATE INDEX IF NOT EXISTS idx_vargani_slips_amount ON vargani_slips (amount);

-- Members (Queried by role and pagination/sorting)
CREATE INDEX IF NOT EXISTS idx_members_role ON members (role);
CREATE INDEX IF NOT EXISTS idx_members_joined_year ON members (joined_year);

-- Vargani Payments (Queried by year to calculate totals)
CREATE INDEX IF NOT EXISTS idx_vargani_payments_year ON vargani_payments (year);
CREATE INDEX IF NOT EXISTS idx_vargani_payments_member_id ON vargani_payments (member_id);

-- Expenses (Filtered heavily by year and category)
CREATE INDEX IF NOT EXISTS idx_expenses_year ON expenses (year);
CREATE INDEX IF NOT EXISTS idx_expenses_paid_by ON expenses (paid_by);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses (status);

-- User Profiles (Queried for auth mapping)
CREATE INDEX IF NOT EXISTS idx_user_profiles_auth_user_id ON user_profiles (auth_user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles (role);

-- Audit Logs (Queried strictly chronologically by latest)
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs (action);

-- Tasks
CREATE INDEX IF NOT EXISTS idx_tasks_date ON tasks (date DESC);

-- Suppliers
CREATE INDEX IF NOT EXISTS idx_suppliers_category ON suppliers (category);
