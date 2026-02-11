-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Members Table
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    role TEXT DEFAULT 'Member', -- 'President', 'Treasurer', 'Member'
    joined_year INTEGER DEFAULT 2026,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Vargani Payments (Yearly)
CREATE TABLE vargani_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    amount NUMERIC DEFAULT 1500,
    paid BOOLEAN DEFAULT FALSE,
    paid_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(member_id, year) -- One record per member per year
);

-- 3. Tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    location TEXT DEFAULT 'Kedari Nagar Chowk',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Task Responses (Who approved/declined)
CREATE TABLE task_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    member_name TEXT NOT NULL, -- Storing name directly for simplicity as generic link shares
    status TEXT NOT NULL, -- 'approved' | 'declined'
    comment TEXT,
    responded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Expenses
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    category TEXT NOT NULL, -- 'Decoration', 'Sound/DJ', etc.
    date DATE NOT NULL,
    status TEXT DEFAULT 'approved', -- 'pending' | 'approved' | 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Invitations
CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    message TEXT,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) Policies
-- For this public/admin hybrid without complex auth, we will enable public access for now
-- In a strict prod env, we would lock this down via Supabase Auth
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE vargani_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for demo purposes (Admin + Public Links)
-- IMPORTANT: You must run these policy commands!
CREATE POLICY "Public Access" ON members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON vargani_payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON task_responses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON invitations FOR ALL USING (true) WITH CHECK (true);

-- MIGRATION: 2026-02-10 (Expenses Update)
-- Run these commands in your Supabase SQL Editor to add the new fields
ALTER TABLE expenses ADD COLUMN paid_by TEXT DEFAULT 'Mandal';
ALTER TABLE expenses ADD COLUMN is_refunded BOOLEAN DEFAULT FALSE;

